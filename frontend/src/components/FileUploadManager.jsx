import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  IconButton,
  useColorModeValue,
  Grid,
  GridItem,
  Badge,
  Progress,
  useToast
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, AttachmentIcon } from '@chakra-ui/icons';

const FileUploadManager = ({ onImagesSelect, maxFiles = 5, maxFileSize = 5 * 1024 * 1024 }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const activeBorderColor = useColorModeValue('blue.400', 'blue.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push({ file, reason: 'Not an image file' });
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        invalidFiles.push({ file, reason: 'File too large (max 5MB)' });
        return;
      }

      // Check if already selected
      const isAlreadySelected = selectedFiles.some(f => 
        f.name === file.name && f.size === file.size
      );
      
      if (isAlreadySelected) {
        invalidFiles.push({ file, reason: 'Already selected' });
        return;
      }

      validFiles.push(file);
    });

    // Show error toast for invalid files
    if (invalidFiles.length > 0) {
      toast({
        title: "Some files couldn't be added",
        description: `${invalidFiles.length} file(s) were invalid`,
        status: "warning",
        isClosable: true
      });
    }

    // Check total file limit
    const newTotalFiles = selectedFiles.length + validFiles.length;
    if (newTotalFiles > maxFiles) {
      const allowedFiles = validFiles.slice(0, maxFiles - selectedFiles.length);
      toast({
        title: "File limit reached",
        description: `Only ${maxFiles} files allowed. ${validFiles.length - allowedFiles.length} files were ignored.`,
        status: "warning",
        isClosable: true
      });
      validFiles.splice(allowedFiles.length);
    }

    if (validFiles.length > 0) {
      const newSelectedFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newSelectedFiles);
      onImagesSelect(newSelectedFiles);
      
      toast({
        title: "Files added successfully",
        description: `${validFiles.length} file(s) added`,
        status: "success",
        isClosable: true
      });
    }
  };

  const removeFile = (index) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newSelectedFiles);
    onImagesSelect(newSelectedFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    onImagesSelect([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <VStack spacing={4} w="full">
      {/* Upload Area */}
      <Box
        w="full"
        h="200px"
        bg={dragActive ? activeBorderColor : bgColor}
        border="2px"
        borderStyle="dashed"
        borderColor={dragActive ? activeBorderColor : borderColor}
        borderRadius="lg"
        p={6}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          borderColor: activeBorderColor,
          bg: useColorModeValue('blue.50', 'blue.900')
        }}
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <VStack spacing={4} justify="center" h="full">
          <AddIcon boxSize={8} color={textColor} />
          <VStack spacing={1}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Drop images here or click to browse
            </Text>
            <Text fontSize="sm" color={textColor}>
              Support: JPG, PNG, GIF, WebP (Max: {maxFiles} files, 5MB each)
            </Text>
          </VStack>
        </VStack>
      </Box>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Box w="full">
          <HStack justify="space-between" mb={3}>
            <Text fontSize="md" fontWeight="semibold">
              Selected Files ({selectedFiles.length}/{maxFiles})
            </Text>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={clearAllFiles}
            >
              Clear All
            </Button>
          </HStack>

          <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
            {selectedFiles.map((file, index) => (
              <GridItem key={`${file.name}-${index}`}>
                <Box
                  bg={useColorModeValue('white', 'gray.800')}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={3}
                  position="relative"
                  _hover={{
                    shadow: 'md'
                  }}
                >
                  {/* Remove Button */}
                  <IconButton
                    icon={<CloseIcon />}
                    size="xs"
                    colorScheme="red"
                    variant="solid"
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={1}
                    onClick={() => removeFile(index)}
                  />

                  {/* Image Preview */}
                  <Box mb={2}>
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      w="full"
                      h="120px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>

                  {/* File Info */}
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                      {file.name}
                    </Text>
                    <HStack spacing={2}>
                      <Badge colorScheme="blue" fontSize="xs">
                        {formatFileSize(file.size)}
                      </Badge>
                      <Badge colorScheme="green" fontSize="xs">
                        {file.type.split('/')[1].toUpperCase()}
                      </Badge>
                    </HStack>
                  </VStack>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Box>
      )}

      {/* Upload Button */}
      <HStack spacing={3} w="full">
        <Button
          leftIcon={<AttachmentIcon />}
          variant="outline"
          onClick={openFileDialog}
          w="full"
        >
          Choose Files
        </Button>
      </HStack>
    </VStack>
  );
};

export default FileUploadManager;