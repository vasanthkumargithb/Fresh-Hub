import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Select
} from '@chakra-ui/react';

const ProductFeedback = () => {
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback on our product!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    e.target.reset();
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box textAlign="center" mb={8}>
        <Heading size="xl" color="blue.600">Product Feedback</Heading>
        <Text fontSize="md" color="gray.600" mt={2}>
          Tell us what you think about the product you received.
        </Text>
      </Box>

      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>

          <FormControl isRequired>
            <FormLabel>Your Name</FormLabel>
            <Input type="text" placeholder="Enter your name" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Enter your email" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Product Name</FormLabel>
            <Input type="text" placeholder="E.g. Organic Tomatoes, Fresh Spinach" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Product Rating</FormLabel>
            <Select placeholder="Select rating">
              <option value="5">★★★★★ Excellent</option>
              <option value="4">★★★★☆ Good</option>
              <option value="3">★★★☆☆ Average</option>
              <option value="2">★★☆☆☆ Poor</option>
              <option value="1">★☆☆☆☆ Very Bad</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Your Feedback</FormLabel>
            <Textarea placeholder="Write your review here..." rows={6} />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            Submit Product Feedback
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default ProductFeedback;
