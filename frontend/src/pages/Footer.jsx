// src/components/Footer.jsx
import React from 'react';
import {  Box,  Container,  SimpleGrid,  Stack,  Text,  Link,  IconButton,  useColorModeValue,  Divider,} from '@chakra-ui/react';
import {  FaFacebook,  FaTwitter,  FaInstagram,  FaLinkedin,} from 'react-icons/fa';

const Footer = () => {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} color="white.700" mt={12}>
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          {/* Company Info */}
          <Stack align="flex-start">
            <Text fontSize="xl" fontWeight="bold" color="cyan.600">Fresh-Hub</Text>
            <Text fontSize="sm">
              Connecting farmers directly with consumers. Fresh, local, and reliable.
            </Text>
          </Stack>

          {/* Quick Links */}
          <Stack align="flex-start">
            <Text fontWeight="bold" mb={2}>Quick Links</Text>
            <Link href="/home">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/">Products</Link>
            <Link href="/contact">Contact</Link>
          </Stack>

          {/* Contact Info */}
          <Stack align="flex-start">
            <Text fontWeight="bold" mb={2}>Contact</Text>
            <Text>Email: support@freshhub.com</Text>
            <Text>Phone: +91-7619365927</Text>
            <Text>Location: Bangalore, India</Text>
          </Stack>

          {/* Social Media */}
          <Stack align="flex-start">
            <Text fontWeight="bold" mb={2}>Follow Us</Text>
            <Stack direction="row" spacing={4}>
              <IconButton as="a" href="https://facebook.com" aria-label="Facebook" icon={<FaFacebook />} />
              <IconButton as="a" href="https://twitter.com" aria-label="Twitter" icon={<FaTwitter />} />
              <IconButton as="a" href="https://instagram.com" aria-label="Instagram" icon={<FaInstagram />} />
              <IconButton as="a" href="https://linkedin.com" aria-label="LinkedIn" icon={<FaLinkedin />} />
            </Stack>
          </Stack>
        </SimpleGrid>

        <Divider my={6} />
        <Text textAlign="center" fontSize="sm">
          &copy; {new Date().getFullYear()} Fresh-Hub. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
