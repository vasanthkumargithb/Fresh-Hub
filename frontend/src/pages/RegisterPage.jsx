import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Heading, HStack, VStack, Box, Container, useColorModeValue } from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("user"); // New state for account type
    const { signup, error, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password, name, accountType);  // Pass accountType as parameter
            navigate("/verify-email");
        } catch (error) {
            console.log("error in signing up", error);
        }
    };

    return (
        <Container>
            <Box
                w={"full"} bg={useColorModeValue("white", "gray.800")}
                rounded={"lg"} p={6} shadow={"md"} mt={"20"}>
                <VStack gap={3}>
                    <Heading as={"h1"} mb={10}>Create an Account</Heading>

                    <form onSubmit={handleSubmit}>
                        <Input
                            placeholder='Enter first name'
                            type='text'
                            name='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            marginBottom={"15px"}
                        />
                        <Input
                            placeholder="Enter your email"
                            name='email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            marginBottom={"15px"}
                        />
                        <Input
                            placeholder="Enter your password"
                            name='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            marginBottom={"15px"}
                        />
                        
                        <select 
                            value={accountType} 
                            onChange={(e) => setAccountType(e.target.value)} 
                            style={{ marginBottom: '15px', padding: '8px', borderRadius: '4px' }}
                        >
                            <option value="user">User</option>
                            <option value="sailor">Seller</option>
                        </select>

                        {error && <p style={{ color: "red" }}> {error} </p>}
                        <HStack display={"Flex"} flexDir={"column"}>
                            <Button type='submit'>{isLoading ? "Loading..." : "Register"}</Button>
                            <div>Already have an account?
                                <Link to={"/login"} style={{ color: "gray" }}>
                                    &nbsp;Login
                                </Link>
                            </div>
                        </HStack>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
};

export default RegisterPage;
