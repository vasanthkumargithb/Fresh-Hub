import {
  Container,
  Flex,
  HStack,
  Text,
  Button,
  useColorMode,
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";
import { RiAccountCircleLine } from "react-icons/ri";
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cart';

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = React.useRef();
  const { isAuthenticated, logout, user, deleteAcc } = useAuthStore();
  const { cart } = useCartStore();

  const handleLogout = () => {
    logout();
  };

  const handleDelete = (event) => {
    event.preventDefault();
    deleteAcc(user.email);
  };

  // Common hover styles for buttons
  const hoverStyles = {
    bg: "cyan.500",
    color: "white",
    transform: "scale(1.05)",
  };

  return (
    <Container maxWidth={"100%"} style={{ background: '#498000', margin: '5px 5px -25px 5px', borderRadius: '10px'}}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row"
        }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400,blue.500)"}
          bgClip={"text"}
        >
          <Link to={"/home"}> Fresh-Hub <span style={{ color: 'green' }}>🍃</span></Link>
        </Text>
        <HStack spacing={2} alignItems={"center"}>
          {/* Conditional buttons based on auth */}
          {isAuthenticated && (
            user?.accountType !== "seller" ? (
              <>
                <Link to={"/"}>
                  <Button
                    _hover={hoverStyles}
                    transition="all 0.3s ease"
                  >
                    View Products
                  </Button>
                </Link>

                <Link to={"/cart"}>
                  <Button
                    display="flex"
                    alignItems="center"
                    gap={2}
                    _hover={hoverStyles}
                    transition="all 0.3s ease"
                  >
                    <FaCartPlus fontSize={20} />
                    <span style={{ position: "relative", top: "-2px" }}></span>
                  </Button>
                </Link>

                <Link to={"/pfeed"}>
                  <Button
                    _hover={hoverStyles}
                    transition="all 0.3s ease"
                  >
                    Feedback
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={"/"}>
                  <Button
                    _hover={hoverStyles}
                    transition="all 0.3s ease"
                  >
                    View Products
                  </Button>
                </Link>

                <Link to={"/create"}>
                  <Button
                    _hover={hoverStyles}
                    transition="all 0.3s ease"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <PlusSquareIcon fontSize={20} />
                  </Button>
                </Link>

                <Link to={"/feed"}>
                  <Button
                    _hover={hoverStyles}
                    transition="all 0.3s ease"
                  >
                    Feedback
                  </Button>
                </Link>
              </>
            )
          )}
          <Link to={"/contact"}>
            <Button
              _hover={hoverStyles}
              transition="all 0.3s ease"
            >
              Contact US
            </Button>
          </Link>
          
           <Link to={"/pred"}>
              <Button
               _hover={hoverStyles}
               transition="all 0.3s ease"
              >
                Prediction
            </Button>
          </Link>
          <Link to={"/about"}>
            <Button
              _hover={hoverStyles}
              transition="all 0.3s ease"
            >
              About US
            </Button>
          </Link>
          <Link to={"/my-orders"}>
            <Button
              _hover={hoverStyles}
              transition="all 0.3s ease"
            >
              My Orders
            </Button>
          </Link>


          <Button
            onClick={toggleColorMode}
            _hover={{
              bg: colorMode === "light" ? "gray.300" : "gray.600",
              transform: "scale(1.05)"
            }}
            transition="all 0.3s ease"
          >
            {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
          </Button>

          <Button
            ref={btnRef}
            colorScheme="black"
            onClick={onOpen}
            ml={10}
            _hover={{ bg: "gray.700", color: "white", transform: "scale(1.05)" }}
            _active={{ bg: "none" }}
            bg={"transparent"}
          >
            <RiAccountCircleLine fontSize={38} color={colorMode === "dark" ? "white" : "black"} />
          </Button>
          <Text fontWeight={"bolder"}>{user?.name}</Text>
        </HStack>
      </Flex>

      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {user ? <>{user.name}</> : <>Login</>}
          </DrawerHeader>

          <DrawerBody>
            {/* Add content here if needed */}
          </DrawerBody>

          <DrawerFooter >
            {isAuthenticated ? (
              <Box>
                <Button
                  colorScheme="red"
                  onClick={handleDelete}
                  marginRight={10}
                  _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                  transition="all 0.3s ease"
                >
                  Delete
                </Button>

                <Button
                  colorScheme="red"
                  onClick={handleLogout}
                  _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                  transition="all 0.3s ease"
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <>
                <Link to={"/register"}>
                  <Button
                    variant="outline"
                    mr={3}
                    onClick={onClose}
                    _hover={{ bg: "cyan.500", color: "white", transform: "scale(1.05)" }}
                    transition="all 0.3s ease"
                  >
                    Register
                  </Button>
                </Link>

                <Link to={"/login"}>
                  <Button
                    colorScheme="blue"
                    onClick={onClose}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                    transition="all 0.3s ease"
                  >
                    Login
                  </Button>
                </Link>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default NavBar;