import React from 'react'
import {Container ,Box,Text,useColorModeValue,Input } from "@chakra-ui/react"
// import { Field } from "../components/ui/field"
import {useNavigate} from "react-router-dom"

const ResetPasswordPage = () => {
  return (
    <Container border={"2px solid yellow"}>
        <Box  w={"full"} bg={useColorModeValue("white", "gray.800")}
                rounded={"lg"} p={6} shadow={"md"} mt={"20"} textAlign={"center"}>
           
                <Text fontSize="3xl" color="blue.500">Reset Password</Text>
                <form onSubmit={handleLogin}>
                        <Input
                            placeholder='Enter your new password'
                            type='text'
                            name='email'
                            value={email}
                            onChange={handleChange}
                            marginBottom={"15px"}
                        />

                        <Input
                            placeholder="Re-Enter your new password"
                            name='password'
                            type='password'
                            value={password}
                            onChange={handleChange}
                            marginBottom={"15px"}
                        />
                        <Link to={"/reset-password"} >
                            <Text color={useColorModeValue("#6C757D", "#8A8A8A")}
                                _hover={{
                                    color: useColorModeValue("#0056D2", "#66B2FF"),
                                    textDecoration: "underline",
                                }}>
                                Forgot Password
                            </Text>
                        </Link>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <HStack display={"flex"} flexDir={"column"}>
                            <Button type='submit'>{isLoading ? "Loading..." : "Login"}</Button>
                            <div>
                                Don't have an account?
                                <Link to={"/register"} style={{ color: "gray" }}>
                                    &nbsp; Register
                                </Link>
                            </div>
                        </HStack>
                    </form>
            
        </Box>
    </Container>
  )
}

export default ResetPasswordPage