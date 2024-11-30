import { Box, Container, Heading, useColorModeValue, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useProductStore } from '../store/product'

const CartPage = () => {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Container w={"100%"} textAlign={"center"}>
      <Box w={"100%"} bg={useColorModeValue("white", "gray.800")}>
        <Heading>Cart Page</Heading>
        <VStack>
          <Box w={"full"} bg={useColorModeValue("white", "gray.800")}>
            {/* {products.map((product) => (
              <ProductCart key={product._id} product={product} />
            ))} */}
          </Box>
        </VStack>
      </Box>
    </Container>
  )
}

export default CartPage;
