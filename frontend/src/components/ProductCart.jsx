import React, { useState } from 'react';
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaCartPlus } from "react-icons/fa";
import { useProductStore } from '../store/product';
import { Flex, useToast } from '@chakra-ui/react';
import { useDisclosure } from "@chakra-ui/react";
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { useCartStore } from '../store/cart';

const ProductCart = ({ product }) => {
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteProducts, updateProducts } = useProductStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [quantity, setquantity] = useState(1);
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const { user } = useAuthStore();
  const { addToCart, error } = useCartStore();

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const { success, message } = await updateProducts(pid, updatedProduct);
    onClose();
    toast({
      title: success ? "Updated Successfully!" : "Update Failed",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProducts(pid);
    toast({
      title: success ? "Deleted Successfully!" : "Deletion Failed",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddtoCart = async (pid) => {
    if (quantity <= 0) {
      return toast({
        title: "Invalid Quantity",
        description: "Please select a valid quantity",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    const { success, message } = await addToCart(user._id, pid, quantity, product.price, product.image);
    toast({
      title: success ? "Product Added to Cart" : error,
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleMinus = () => {
    setquantity(quantity > 1 ? quantity - 1 : 1);
  };

  const handlePlus = () => {
    setquantity(quantity + 1);
  };

  const handleBuy = () => {
    const productId = product._id;
    const userId = user?._id;

    if (!userId || !productId) {
      toast({
        title: "Missing Information",
        description: "User ID or Product ID is missing.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    navigate("/billing", {
      state: {
        userId,
        productIds: [productId],
      },
    });
  };

  if (!user) {
    return (
      <Box p={4}>
        <Text color="red.500">Please log in to buy or add items to the cart.</Text>
      </Box>
    );
  }

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image src={product.image} alt={product.name} h={48} w={"full"} objectFit={"cover"} />

      <Box p={4}>
        <Heading as={"h3"} size={"md"} mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight={"bold"} fontSize={"xl"} color={textColor} mb={4}>
          ₹ {product.price}/{product.unit}
        </Text>

        {user.accountType === "seller" ? (
          <HStack spacing={2}>
            <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme='blue' />
            <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteProduct(product._id)} colorScheme='red' />
          </HStack>
        ) : (
          <>
            <Button mr={2} onClick={handleBuy}>Buy Now</Button>
            <IconButton icon={<FaCartPlus />} onClick={() => handleAddtoCart(product._id)} colorScheme='red' />

            <Box display={"flex"} mt={3}>
              <Button onClick={handleMinus}>-</Button>
              <Input
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setquantity(parseInt(value) || 1);
                  }
                }}
                w="80px"
                textAlign="center"
              />
              <Button onClick={handlePlus}>+</Button>
            </Box>
          </>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Input placeholder="Name" value={updatedProduct.name} onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })} />
              <Input placeholder="Price" value={updatedProduct.price} onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })} />
              <Input placeholder="Unit" value={updatedProduct.unit} onChange={(e) => setUpdatedProduct({ ...updatedProduct, unit: e.target.value })} />
              <Input placeholder="Image URL" value={updatedProduct.image} onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}>Update</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCart;
