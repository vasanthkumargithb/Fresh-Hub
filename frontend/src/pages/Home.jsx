import React, { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  Text,
  SimpleGrid,
  Box,
  Heading,
  Icon,
  Image,
  Divider,
  Button,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import { FaLeaf, FaUsers, FaMobileAlt, FaShippingFast } from 'react-icons/fa';
import axios from 'axios'; // Make sure axios is installed

// Images
import f1 from '../images/farmer/f1.jpg';
import f2 from '../images/farmer/f2.jpg';
import f3 from '../images/farmer/f3.jpg';
import f4 from '../images/farmer/f4.jpg';
import f5 from '../images/farmer/f5.jpg';
import B from '../images/back1.png';
import crop1 from '../images/crops/crop1.jpg';
import crop2 from '../images/crops/crop2.jpg';
import crop3 from '../images/crops/crop3.jpg';
import crop4 from '../images/crops/crop4.jpg';
import crop5 from '../images/crops/crop5.jpg';
import crop6 from '../images/crops/crop6.jpg';
import crop7 from '../images/crops/crop7.jpg';
import crop8 from '../images/crops/crop8.jpg';
import crop9 from '../images/crops/crop9.jpg';
import crop10 from '../images/crops/crop10.jpg';

const features = [
  { title: 'Farmer First', description: 'Empowering farmers...', icon: FaLeaf },
  { title: 'User Friendly', description: 'Easy platform...', icon: FaUsers },
  { title: 'Mobile Responsive', description: 'Accessible on all devices.', icon: FaMobileAlt },
  { title: 'Quick Delivery', description: 'Local delivery model.', icon: FaShippingFast },
];

const farmerImages = [f1, f2, f3, f4, f5];
const cropImages = [crop1, crop2, crop3, crop4, crop5, crop6, crop7, crop8, crop9, crop10];

const Home = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedback');
      setFeedbacks(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbacks.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1
    );
  };

  const currentFeedback = feedbacks[currentIndex];

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={10} align="center">
        <VStack
          style={{
            backgroundImage: `url(${B})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            minWidth: '100%',
          }}
        ></VStack>

        {/* Features */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
          {features.map((feature, idx) => (
            <Box
              key={idx}
              textAlign="center"
              p={5}
              borderWidth={1}
              borderRadius="xl"
              shadow="md"
              _hover={{ shadow: 'lg', transform: 'scale(1.03)' }}
              transition="all 0.3s"
            >
              <Icon as={feature.icon} boxSize={8} color="cyan.500" mb={2} />
              <Text fontWeight="bold" fontSize="lg">{feature.title}</Text>
              <Text fontSize="sm" color="gray.600">{feature.description}</Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Farmers */}
        <Heading size="lg" pt={10}>Meet Our Farmers</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={5} w="full">
          {farmerImages.map((img, index) => (
            <Image key={index} src={img} alt={`Farmer ${index + 1}`} borderRadius="xl" boxShadow="lg" objectFit="cover" height="200px" w="full" />
          ))}
        </SimpleGrid>

        {/* Crops */}
        <Heading size="lg" pt={10}>Our Fresh Produce</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={5} w="full">
          {cropImages.map((img, index) => (
            <Image key={index} src={img} alt={`Crop ${index + 1}`} borderRadius="xl" boxShadow="md" objectFit="cover" height="180px" w="full" />
          ))}
        </SimpleGrid>

        {/* Testimonials from DB */}
        <Heading size="lg" pt={10} w="full" textAlign="center">
          What Our Customers Say
        </Heading>

        {loading ? (
          <Spinner size="xl" />
        ) : feedbacks.length === 0 ? (
          <Text>No feedbacks available yet.</Text>
        ) : (
          <Box
            p={6}
            maxW="container.md"
            borderWidth="1px"
            borderRadius="md"
            bg="gray.50"
            boxShadow="sm"
            textAlign="center"
          >
            <Text fontSize="lg" fontStyle="italic" color="gray.800" mb={4}>
              "{currentFeedback.feedback}"
            </Text>
            <Text fontWeight="semibold" color="gray.600" mb={2}>
              — {currentFeedback.name}, {currentFeedback.location}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Crop: {currentFeedback.cropType} | Experience: {currentFeedback.experience}
            </Text>

            <HStack justify="center" spacing={4} mt={4}>
              <Button colorScheme="cyan" onClick={handlePrevious}>
                Previous
              </Button>
              <Button colorScheme="cyan" onClick={handleNext}>
                Next
              </Button>
            </HStack>
          </Box>
        )}

        <Divider />
      </VStack>
    </Container>
  );
};

export default Home;
