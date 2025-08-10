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
  Container
} from '@chakra-ui/react';

const ContactUs = () => {
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    e.target.reset();
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box textAlign="center" mb={8}>
        <Heading size="xl" color="green.600">Contact Us</Heading>
        <Text fontSize="md" color="gray.600" mt={2}>
          We'd love to hear from you. Fill out the form below or reach us directly.
        </Text>
      </Box>

      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>

          <FormControl isRequired>
            <FormLabel>Your Name</FormLabel>
            <Input type="text" placeholder="Enter your name" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Your Email</FormLabel>
            <Input type="email" placeholder="Enter your email" />
          </FormControl>

          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" placeholder="Enter your phone number" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Your Message</FormLabel>
            <Textarea placeholder="Type your message here..." rows={6} />
          </FormControl>

          <Button colorScheme="green" type="submit" width="full">
            Send Message
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default ContactUs;
