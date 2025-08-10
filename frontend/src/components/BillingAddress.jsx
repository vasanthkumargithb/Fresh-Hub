import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Heading,
  VStack,
  Input,
  useColorModeValue,
  Button,
  useToast,
  Alert,
  AlertIcon,
  Text,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cart";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById("razorpay-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-script";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    } else {
      resolve(true);
    }
  });
};

const BillingAddress = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart } = useCartStore();
  const toast = useToast();
  
  // Get data from navigation state or fallback to store
  const userId = state?.userId || user?._id;
  const productIds = state?.productIds || cart?.items?.map(item => item.productId?._id || item.productId || item._id) || [];
  const cartTotal = state?.cartTotal || cart?.subTotal || 0;
  const cartItems = state?.cartItems || cart?.items || [];
  
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("test@example.com");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stateField, setStateField] = useState("");
  const [loading, setLoading] = useState(false);

  // Debug logs
  console.log('🔍 BILLING DEBUG:');
  console.log('- Navigation state:', state);
  console.log('- User from store:', user);
  console.log('- Cart from store:', cart);
  console.log('- Final userId:', userId);
  console.log('- Final productIds:', productIds);
  console.log('- Final cartTotal:', cartTotal);

  // Validation
  useEffect(() => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with checkout",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      navigate('/signin');
      return;
    }

    if (!productIds || productIds.length === 0) {
      toast({
        title: "No Items in Cart",
        description: "Please add items to cart before checkout",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      navigate('/cart');
      return;
    }
  }, [userId, productIds, toast, navigate]);

  const handlePayment = async () => {
    // Validation
    if (!name.trim() || !contact.trim() || !email.trim() || !address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!userId || !productIds || productIds.length === 0) {
      toast({
        title: "Missing Information",
        description: "User ID or Product ID is missing.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (cartTotal <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Cart total must be greater than 0",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const res = await loadRazorpayScript();
    if (!res) {
      toast({
        title: "Payment Failed",
        description: "Razorpay SDK failed to load. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      console.log('💰 Creating order for amount:', cartTotal * 100);
      
      const order = await fetch("http://localhost:5000/api/payment/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}` // Add auth if needed
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ amount: cartTotal * 100 }), // Convert to paise
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      });

      console.log('📦 Order created:', order);

      if (!order.id) throw new Error("Failed to create order");

      const options = {
        key: "rzp_test_Fg7MWBV0KYlx07", // ✅ Your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: "Fresh-Hub",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          console.log('✅ Payment successful:', response);
          
          toast({
            title: "Payment Success!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          try {
            // Record payment
            const recordResponse = await fetch("http://localhost:5000/api/payment/record", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}` // Add auth if needed
              },
              credentials: 'include', // Include cookies
              body: JSON.stringify({
                userId,
                productIds,
                name: name.trim(),
                contact: contact.trim(),
                email: email.trim(),
                address: address.trim(),
                pinCode: pinCode.trim(),
                city: city.trim(),
                district: district.trim(),
                state: stateField.trim(),
                paymentId: response.razorpay_payment_id,
                amount: cartTotal,
              }),
            });

            if (recordResponse.ok) {
              console.log('✅ Payment recorded successfully');
              // Clear cart after successful payment
              // You might want to call clearCart here
              
              // Redirect to success page
              navigate('/payment-success', { 
                state: { 
                  paymentId: response.razorpay_payment_id,
                  amount: cartTotal 
                } 
              });
            } else {
              console.error('❌ Failed to record payment');
            }
          } catch (err) {
            console.error("❌ Error saving payment record:", err);
          }

          setLoading(false);
        },
        prefill: {
          name: name.trim() || "Customer Name",
          email: email.trim(),
          contact: contact.trim() || "9000090000",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      console.log("🔑 Opening Razorpay with options:", options);
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('❌ Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // Show loading if no data
  if (!userId || !productIds || productIds.length === 0) {
    return (
      <Container>
        <Box textAlign="center" py={10}>
          <Text>Loading checkout data...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="md">
      <Heading mt={5} textAlign="center">Fill your Details</Heading>
      
      
      
      <Box
        w="full"
        bg={useColorModeValue("white", "gray.800")}
        rounded="lg"
        p={6}
        shadow="md"
        mt={8}
      >
        <VStack spacing={4} as="form" onSubmit={(e) => e.preventDefault()}>
          <Input 
            placeholder="Enter Your Name *" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            isRequired
          />
          <Input 
            placeholder="Enter Your Contact Number *" 
            value={contact} 
            onChange={(e) => setContact(e.target.value)}
            type="tel"
            isRequired
          />
          <Input 
            placeholder="Enter Your Email *" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            isRequired
          />
          <Input 
            placeholder="Pin Code *" 
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            isRequired
          />
          <Input 
            placeholder="Enter Your Full Address *" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            isRequired
          />
          <Input 
            placeholder="City *" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            isRequired
          />
          <Input 
            placeholder="District *" 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            isRequired
          />
          <Input 
            placeholder="State *" 
            value={stateField}
            onChange={(e) => setStateField(e.target.value)}
            isRequired
          />
          
          <Button 
            colorScheme="blue" 
            onClick={handlePayment} 
            isLoading={loading}
            loadingText="Processing..."
            size="lg"
            w="full"
          >
            Pay ₹{cartTotal} - Proceed for Payment
          </Button>
        </VStack>
      </Box>

      {/* Raw debug data */}
      
    </Container>
  );
};

export default BillingAddress;