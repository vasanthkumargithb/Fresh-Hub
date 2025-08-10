import React, { useState } from 'react';
import {Container,Heading,VStack,Select,Input,Button,Text,Box,SimpleGrid,useToast,HStack,}from '@chakra-ui/react';
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from 'recharts';
const crops = ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton'];
const Prediction = () => {
  const toast = useToast();
  const currentYear = new Date().getFullYear();
  const [crop, setCrop] = useState('');
  const [yearPrices, setYearPrices] = useState(['', '', '', '', '']);
  const [predictions, setPredictions] = useState([]);
  const handlePriceChange = (index, value) => {
    const updatedPrices = [...yearPrices];
    updatedPrices[index] = value;
    setYearPrices(updatedPrices);
  };
  const handleSubmit = () => {
    if (!crop || yearPrices.some((price) => price === '')) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill all 5 prices and select a crop.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const numericPrices = yearPrices.map(Number);
    const differences = [];
    for (let i = 1; i < numericPrices.length; i++) {
      differences.push(numericPrices[i] - numericPrices[i - 1]);
    }

    // Average of differences
    const avgChange = differences.reduce((a, b) => a + b, 0) / differences.length;

    // Predict next 5 years
    const lastYear = currentYear;
    const lastPrice = numericPrices[4];

    const futurePredictions = [];
    for (let i = 1; i <= 5; i++) {
      const year = lastYear + i;
      const price = +(lastPrice + avgChange * i).toFixed(2);
      futurePredictions.push({ year, price });
    }

    setPredictions(futurePredictions);
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={5} align="stretch">
        <Heading color="green.600">Crop Price Prediction</Heading>

        <Select
          placeholder="Select Crop"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
        >
          {crops.map((cropName) => (
            <option key={cropName} value={cropName}>
              {cropName}
            </option>
          ))}
        </Select>

        <Box>
          <Heading size="sm" mb={2}>
            Enter Prices for Previous 5 Years (up to {currentYear})
          </Heading>
          <SimpleGrid columns={[1, 2]} spacing={3}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Input
                key={i}
                type="number"
                placeholder={`Year ${currentYear - 5 + i + 1}`}
                value={yearPrices[i]}
                onChange={(e) => handlePriceChange(i, e.target.value)}
              />
            ))}
          </SimpleGrid>
        </Box>

        <Button colorScheme="teal" onClick={handleSubmit}>
          Predict Prices
        </Button>

        {predictions.length > 0 && (
          <Box mt={6}>
            <Heading size="md" mb={4}>
              Predicted Prices for {crop} (2025–2029)
            </Heading>

            <SimpleGrid columns={2} spacing={4}>
              {predictions.map((item) => (
                <Box
                  key={item.year}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  bg="gray.200"
                  color={'black'}
                >
                  <Text fontWeight="bold">Year: {item.year}</Text>
                  <Text>Price: ₹{item.price}</Text>
                </Box>
              ))}
            </SimpleGrid>

            <Box h="300px" mt={10}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="price" fill="#38A169" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Prediction;
