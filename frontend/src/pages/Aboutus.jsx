// src/pages/AboutUs.jsx
import React from 'react';
import { Container, VStack, Text, Box, SimpleGrid } from '@chakra-ui/react';

const AboutUs = () => {
  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={10} align="start">
        <Text fontSize="4xl" fontWeight="bold" color="blue.700">
          About Fresh-Hub
        </Text>

        <Text fontSize="lg" color="gray.700" lineHeight="tall">
          Fresh-Hub is a digital platform designed to connect local farmers directly with customers, eliminating middlemen and ensuring fair trade.
          Our mission is to empower farmers, provide consumers with fresh produce, and build a more sustainable agricultural ecosystem.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
          <Box bg="gray.50" p={5} rounded="2xl" shadow="md">
            <Text fontSize="xl" fontWeight="bold" color="green.600" mb={2}>
              🌱 Mission
            </Text>
            <Text fontSize="md" color="gray.600">
              To create a transparent and fair supply chain that benefits both farmers and consumers by enabling direct communication and transactions.
            </Text>
          </Box>

          <Box bg="gray.50" p={5} rounded="2xl" shadow="md">
            <Text fontSize="xl" fontWeight="bold" color="green.600" mb={2}>
              🌾 What We Offer
            </Text>
            <VStack align="start" spacing={2} fontSize="md" color="gray.600">
              <Text>• Direct-to-customer sale of farm products</Text>
              <Text>• Crop price prediction based on 5-year historical data</Text>
              <Text>• Easy-to-use interface for both farmers and customers</Text>
              <Text>• Secure payment gateway and order tracking</Text>
              <Text>• Fair pricing and reduced wastage</Text>
            </VStack>
          </Box>

          <Box bg="gray.50" p={5} rounded="2xl" shadow="md">
            <Text fontSize="xl" fontWeight="bold" color="green.600" mb={2}>
              📈 Our Impact
            </Text>
            <Text fontSize="md" color="gray.600">
              Fresh-Hub helps farmers earn better profits and consumers get fresher, healthier produce. By minimizing intermediaries, we support local agriculture and promote sustainable food systems.
            </Text>
          </Box>
        </SimpleGrid>

        <Text fontSize="lg" color="gray.600" mt={8}>
          Together, we’re building a future where technology meets tradition to empower communities and ensure food security.
        </Text>
      </VStack>
    </Container>
  );
};

export default AboutUs;
