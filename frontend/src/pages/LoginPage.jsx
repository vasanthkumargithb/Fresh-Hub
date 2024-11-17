import { Container, Heading, VStack, Input, Button, HStack, Box, useColorModeValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signin,isLoading,error} = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name == "email") {
            setEmail(value);
        }
        if (name == "password") {
            setPassword(value);
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
           const response = await signin(email,password);
          if(response){
            navigate("/")
          }
        } catch (error) {
            console.log("error is: ", error)
        }
    }
    return (
        <Container>
            <Box
                w={"full"} bg={useColorModeValue("white", "gray.800")}
                rounded={"lg"} p={6} shadow={"md"} mt={"20"} >
                <VStack gap={3}  >
                    <Heading as={"h1"} mb={10}>
                        Please Login!
                    </Heading >
                    <form onSubmit={handleLogin}>
                    <Input
                        placeholder='Enter the email of Phone number'
                        type='text'
                        name='email'
                        value={email}
                        onChange={handleChange}
                        marginBottom={"15px"}
                        />

                    <Input
                        placeholder="Enter your password"
                        name='password'
                        type='password'
                        value={password}
                        onChange={handleChange}
                        marginBottom={"15px"}
                    />
                    {error && <p style={{color:"red"}}>{error}</p>}
                    <HStack display={"flex"} flexDir={"column"}>
                        <Button type='submit'>{isLoading ? "Loading...": "Login"}</Button>
                        <div>
                            Don't have an account?
                            <Link to={"/register"} style={{ color: "gray" }}>
                                &nbsp; Register
                            </Link>
                        </div>
                    </HStack>
                    </form>
                </VStack>
            </Box>
        </Container>
    )
}

export default LoginPage