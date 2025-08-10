import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useProductStore } from '../store/product';
import { useToast } from '@chakra-ui/react';
import FileUploadManager from '../components/FileUploadManager';

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    unit: "",
    description: ""
  });
  const [selectedImages, setSelectedImages] = useState([]); // Only one declaration
  const toast = useToast();
  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
    // Validation
    if (!newProduct.name || !newProduct.price || !newProduct.unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
        isClosable: true
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one image",
        status: "error",
        isClosable: true
      });
      return;
    }

    // Convert first selected image to base64 for temporary display
    let imageUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(newProduct.name)}`;
    
    if (selectedImages.length > 0) {
      // Convert the first image to base64
      const reader = new FileReader();
      
      try {
        // Create a promise to handle file reading
        const readFileAsBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };

        imageUrl = await readFileAsBase64(selectedImages[0]);
      } catch (error) {
        console.log('Error converting image to base64:', error);
      }
    }

    const productData = {
      name: newProduct.name,
      price: newProduct.price,
      unit: newProduct.unit,
      image: imageUrl // Use base64 image or placeholder
    };

    try {
      console.log('Sending request to:', 'http://localhost:5000/api/products');
      
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        credentials: 'include', // This includes cookies in the request
        headers: {
          'Content-Type': 'application/json', // Now we're sending JSON
        },
        body: JSON.stringify(productData), // Send JSON data instead of FormData
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        // Try to get error message
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          
          // Try to parse as JSON
          if (errorText.startsWith('{')) {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          }
        } catch (e) {
          console.log('Could not parse error response');
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Success response:', result);

      toast({
        title: "Success",
        description: "Product created successfully!",
        status: "success",
        isClosable: true
      });
      
      // Reset form
      setNewProduct({
        name: "",
        price: "",
        unit: "",
        description: ""
      });
      setSelectedImages([]);

    } catch (error) {
      console.error('Full error object:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        status: "error",
        isClosable: true
      });
    }
  };

  return (
    <Container style={{ marginTop: '50px' }}>
      <VStack>
        <Heading as={"h1"} textAlign={"center"} mb={8}>
          Create new Products
        </Heading>
        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          rounded={"lg"}
          p={6}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              value={newProduct.name}
              placeholder="Enter the product name *"
              name="name"
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <Input
              value={newProduct.price}
              placeholder="Enter the product price *"
              name="price"
              type="number"
              min="0"
              step="0.01"
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <Input
              value={newProduct.unit}
              placeholder="Enter the product unit (kg, pieces, etc) *"
              name="unit"
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
            />
            <Input
              value={newProduct.description}
              placeholder="Enter product description (optional)"
              name="description"
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />

            {/* File Upload Manager */}
            <Box w="full">
              <FileUploadManager 
                onImagesSelect={setSelectedImages}
                maxFiles={5}
                maxFileSize={5 * 1024 * 1024} // 5MB
              />
            </Box>

            <Button 
              colorScheme="blue" 
              onClick={handleAddProduct} 
              w={"full"}
              isLoading={false}
            >
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;