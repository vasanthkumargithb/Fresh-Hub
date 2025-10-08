import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Divider,
  VStack,
  HStack,
  Image,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
} from '@chakra-ui/react';
import { useCartStore } from '../store/cart';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const MyCart = () => {
  const { cart, getCart, removeFromCart, clearCart, isLoading, error } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchCart = async () => {
      if (user && user._id) {
        console.log('🔍 Fetching cart for userId:', user._id);
        try {
          await getCart(user._id);
        } catch (error) {
          console.error('❌ Error fetching cart:', error);
        }
      }
    };
    fetchCart();
  }, [user, getCart]);

  // Enhanced debug logs
  console.log('=== CART DEBUG START ===');
  console.log('🔍 User:', user);
  console.log('🔍 Cart from store:', cart);
  console.log('🔍 Cart items:', cart?.items);
  console.log('🔍 Items length:', cart?.items?.length);
  console.log('🔍 IsLoading:', isLoading);
  console.log('🔍 Error:', error);
  console.log('=== CART DEBUG END ===');

  const handleRemoveFromCart = async (productId) => {
    console.log('🗑️ Removing product:', productId);
    
    if (!user || !user._id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to remove items from cart',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await removeFromCart(user._id, productId);
      toast({
        title: 'Item Removed',
        description: 'Item successfully removed from cart',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      // Refresh cart after removal
      await getCart(user._id);
    } catch (error) {
      console.error('❌ Remove from cart error:', error);
      toast({
        title: 'Removal Failed',
        description: error.message || 'Could not remove item from cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClearCart = async () => {
    console.log('🧹 Clearing entire cart');
    
    if (!user || !user._id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to clear cart',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await clearCart(user._id);
      toast({
        title: 'Cart Cleared',
        description: 'All items have been removed from your cart',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      // Refresh cart after clearing
      await getCart(user._id);
    } catch (error) {
      console.error('❌ Clear cart error:', error);
      toast({
        title: 'Clear Failed',
        description: error.message || 'Could not clear cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleProceedToCheckout = () => {
    console.log('🛒 Proceeding to checkout');
    
    // Prepare data for checkout
    const checkoutData = {
      userId: user._id,
      productIds: validItems.map(item => item.productId?._id || item.productId || item._id),
      cartTotal: cart?.subTotal || 0,
      cartItems: validItems
    };
    
    console.log('🔍 Checkout data:', checkoutData);
    
    // Navigate with state data
    navigate('/billing', { 
      state: checkoutData 
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text mt={4} fontSize="lg">Loading your cart...</Text>
      </Box>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <Box textAlign="center" py={20}>
        <Heading size="lg" mb={4} color="gray.600">
          Cart Access Required
        </Heading>
        <Text mb={6} color="gray.500">
          Please sign in to view and manage your cart
        </Text>
        <Button 
          colorScheme="blue" 
          size="lg"
          onClick={() => navigate('/signin')}
        >
          Sign In
        </Button>
      </Box>
    );
  }

  // Debug information for troubleshooting
  const debugInfo = {
    userId: user?._id || 'Missing',
    cartExists: !!cart,
    itemsCount: cart?.items?.length || 0,
    subTotal: cart?.subTotal || 0,
    isLoading: isLoading,
    error: error || 'None'
  };

  // Safe cart items processing
  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const validItems = cartItems.filter(item => item && typeof item === 'object');
  const hasValidItems = validItems.length > 0;

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      {/* Debug Information Panel */}
     

      {/* Main Cart Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
        <Heading size="xl" color="white.800">
          My Shopping Cart
        </Heading>
        {hasValidItems && (
          <Badge colorScheme="blue" fontSize="md" p={2} borderRadius="full">
            {validItems.length} item{validItems.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </Box>

      {/* Error Display */}
      {error && (
        <Alert status="error" mb={6} borderRadius="lg">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Cart Error:</Text>
            <Text>{error}</Text>
          </Box>
        </Alert>
      )}

      {/* Main Cart Content */}
      {!hasValidItems ? (
        <Box textAlign="center" py={16}>
          <Text fontSize="2xl" mb={4} color="gray.500">
            🛒 Your cart is empty
          </Text>
          <Text fontSize="lg" mb={8} color="gray.400">
            Discover amazing products and start shopping!
          </Text>
          <Button 
            colorScheme="blue" 
            size="lg"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <>
          {/* Cart Items List */}
          <VStack spacing={6} align="stretch" mb={8}>
            {validItems.map((item, index) => {
              // Safe property extraction with comprehensive fallbacks
              const itemId = item._id || item.productId?._id || item.productId || `item-${index}`;
              const itemImage = item.image || item.productId?.image || item.productId?.images?.[0] || '/api/placeholder/150/150';
              const itemName = item.name || item.productId?.name || item.productId?.title || 'Unknown Product';
              const itemPrice = parseFloat(item.price || item.productId?.price || 0);
              const itemQuantity = parseInt(item.quantity || 1);
              const itemTotal = parseFloat(item.total || (itemPrice * itemQuantity));
              const productIdForRemoval = item.productId?._id || item.productId || item._id;

              console.log(`📦 Item ${index}:`, {
                itemId,
                itemName,
                itemPrice,
                itemQuantity,
                itemTotal,
                productIdForRemoval,
                rawItem: item
              });

              return (
                <Box 
                  key={itemId} 
                  borderWidth="2px" 
                  borderColor="gray.200"
                  borderRadius="xl" 
                  p={6}
                  bg="white"
                  shadow="sm"
                  _hover={{ shadow: "md", borderColor: "blue.300" }}
                  transition="all 0.2s"
                >
                  <HStack spacing={6}>
                    {/* Product Image */}
                    <Box flexShrink={0}>
                      <Image 
                        src={itemImage}
                        alt={itemName}
                        boxSize="120px"
                        objectFit="cover"
                        borderRadius="lg"
                        fallback={
                          <Box 
                            boxSize="120px" 
                            bg="gray.100" 
                            borderRadius="lg"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text fontSize="sm" color="gray.500">No Image</Text>
                          </Box>
                        }
                        onError={(e) => {
                          console.warn('🖼️ Image load failed:', itemImage);
                          e.target.style.display = 'none';
                        }}
                      />
                    </Box>

                    {/* Product Details */}
                    <Box flex="1">
                      <Text fontWeight="bold" fontSize="xl" mb={2} color="gray.800">
                        {itemName}
                      </Text>
                      <VStack align="start" spacing={1}>
                        <Text color="gray.600" fontSize="md">
                          💰 Price: <Text as="span" fontWeight="semibold">₹{itemPrice.toFixed(2)}</Text>
                        </Text>
                        <Text color="gray.600" fontSize="md">
                          📦 Quantity: <Text as="span" fontWeight="semibold">{itemQuantity}</Text>
                        </Text>
                        <Text color="green.600" fontSize="lg" fontWeight="bold">
                          💳 Subtotal: ₹{itemTotal.toFixed(2)}
                        </Text>
                      </VStack>
                    </Box>

                    {/* Remove Button */}
                    <Box flexShrink={0}>
                      <Button
                        colorScheme="red"
                        variant="outline"
                        size="md"
                        onClick={() => handleRemoveFromCart(productIdForRemoval)}
                        isLoading={isLoading}
                        loadingText="Removing..."
                        _hover={{ bg: "red.50" }}
                      >
                        🗑️ Remove
                      </Button>
                    </Box>
                  </HStack>
                </Box>
              );
            })}
          </VStack>

          <Divider borderWidth="2px" borderColor="gray.200" />

          {/* Cart Summary and Actions */}
          <Box bg="gray.50" p={6} borderRadius="xl" mt={6}>
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  Total: ₹{(cart?.subTotal || 0).toFixed(2)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {validItems.length} item{validItems.length !== 1 ? 's' : ''} in your cart
                </Text>
              </Box>
              
              <HStack spacing={4}>
                
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleProceedToCheckout}
                  isLoading={isLoading}
                  loadingText="Processing..."
                >
                  🛒 Proceed to Checkout
                </Button>
              </HStack>
            </HStack>
          </Box>
        </>
      )}

     
    </Box>
  );
};

export default MyCart; 
