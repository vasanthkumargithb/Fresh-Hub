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

const Feedback = () => {
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      location: formData.get("location"),
      cropType: formData.get("cropType"),
      experience: formData.get("experience"),
      feedback: formData.get("feedback"),
    };

    try {
      const response = await fetch("http://localhost:5000/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for sharing your feedback!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        e.target.reset();
      } else {
        toast({
          title: "Submission Failed",
          description: "Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box textAlign="center" mb={8}>
        <Heading size="xl" color="green.600">Farmer Feedback</Heading>
        <Text fontSize="md" color="gray.600" mt={2}>
          Your feedback helps us improve and serve you better.
        </Text>
      </Box>

      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>

          <FormControl isRequired>
            <FormLabel>Farmer Name</FormLabel>
            <Input type="text" name="name" placeholder="Enter your name" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Location / Village</FormLabel>
            <Input type="text" name="location" placeholder="Enter your village or town" />
          </FormControl>

          <FormControl>
            <FormLabel>Crop Type</FormLabel>
            <Input type="text" name="cropType" placeholder="E.g. Wheat, Tomatoes, Rice" />
          </FormControl>

          <FormControl>
            <FormLabel>Farming Experience (in years)</FormLabel>
            <Input type="number" name="experience" placeholder="Years of experience" min={0} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Your Feedback</FormLabel>
            <Textarea name="feedback" placeholder="Share your experience or suggestions..." rows={6} />
          </FormControl>

          <Button colorScheme="green" type="submit" width="full">
            Submit Feedback
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default Feedback;
