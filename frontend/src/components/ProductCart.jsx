import React, { useState } from 'react'
import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { FaCartPlus } from "react-icons/fa";
import { useProductStore } from '../store/product';
import { useToast } from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/react";
import { useAuthStore } from '../store/authStore';

import {
    Box,
    Heading,
    HStack, VStack,
    IconButton,
    Image, Input, Button,
    Text,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@chakra-ui/react'


const ProductCart = ({ product }) => {
    const textColor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.800");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { deleteProducts, updateProducts } = useProductStore();
    const toast = useToast();
    //  console.log(product)
    const [updatedProduct, setUpdatedProduct] = useState(product);
    const {user} =useAuthStore();

    const handleUpdateProduct = async (pid, updatedProduct) => {
        const { success, message } = await updateProducts(pid, updatedProduct);
        onClose();
        if (success) {
            toast({
                title: "Updated Successfully!",
                description: message,
                status: "success",
                duration: 3000,
                isClosable: true
            })
        } else {
            toast({
                title: "Please provide proper details",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true
            })
        }

    }

    const handleDeleteProduct = async (pid) => {
        const { success, message } = await deleteProducts(pid);

        if (!success) {
            toast({
                title: "error  in deleteing the product",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true
            })
        } else {
            toast({
                title: "success!",
                description: message,
                status: "success",
                isClosable: true,
                duration: 3000
            })
        }
    }

    const handleAddtoCart = async (pid) =>{

    }
    return <Box
        shadow="lg"
        rounded="lg"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
        bg={bg}>
        <Image
            src={product.image} alt={product.name} h={48} w={"full"} objectFit={"cover"} />

        <Box p={4}>
            <Heading as={"h3"} size={"md"} mb={2}>
                {product.name}
            </Heading>

            <Text fontWeight={"bold"} fontSize={"xl"} color={textColor} mb={4}>
                ₹ {product.price}/{product.unit}
            </Text>
            {user.accountType == "seller" ? <><HStack spacing={2}>
                <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme='blue' />
                <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteProduct(product._id)} colorScheme='red' />
            </HStack>
            <>
            </>
            </> : <>
            <Button style={{marginRight:"10px"}}>Buy Now</Button>
            <IconButton icon={<FaCartPlus />} onClick={() => handleAddtoCart(product._id)} colorScheme='red' />
            </>}
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Update the details of product
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        <Input placeholder='Enter the product name' type="text" name='name' value={updatedProduct.name}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })} />

                        <Input placeholder='Enter the product price' type='number' name='price' value={updatedProduct.price}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })} />

                        <Input placeholder='Enter the Unit of product' type='text' name='unit' value={updatedProduct.unit}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, unit: e.target.value })} />

                        <Input placeholder='Enter image URL' name='image' type='text' value={updatedProduct.image}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })} />
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}>Update</Button>
                    <Button variant={"ghost"} onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </Box>
}

export default ProductCart