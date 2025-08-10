import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuthStore } from "../store/authStore";

const ShowOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/payment/records/${user._id}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
    }
  }, [user]);

  return (
    <Box p={6}>
      <Heading mb={4}>Your Orders</Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <VStack spacing={4} align="start">
          {orders.map((order) => (
            <Box key={order._id} p={4} bg={useColorModeValue("gray.100", "gray.700")} w="full" rounded="md" shadow="md">

              <Text><strong>Name:</strong> {order.name}</Text>
              <Text><strong>Address:</strong> {order.address}, {order.city}, {order.district}, {order.state} - {order.pinCode}</Text>
              <Text><strong>Payment ID:</strong> {order.paymentId}</Text>
              <Text><strong>Products:</strong> {order.productIds.map(p => p.name).join(", ")}</Text>
              <Text><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</Text>
              <Divider mt={2} />
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ShowOrders;
