import { create } from 'zustand';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/cart`;

// Configure axios to send cookies with all requests
axios.defaults.withCredentials = true;

export const useCartStore = create((set, get) => ({
  cart: [],
  error: null,
  isLoading: false,

  // Add item to the cart
  addToCart: async (userId, productId, quantity, price, image) => {
    set({ isLoading: true, error: null });
    console.log('🛒 Adding to cart:', { userId, productId, quantity, price });

    try {
      const response = await axios.post(`${API_URL}/add`, {
        userId,
        productId,
        quantity,
        price,
        image
      });

      console.log('✅ Add to cart response:', response.data);

      if (response.data.success) {
        await get().getCart(userId);
        set({ isLoading: false });
        return { success: true, message: "Product added to cart successfully!" };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      const errorMessage = error.response?.data?.message || "Failed to add to cart";
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Remove item from cart
  removeFromCart: async (userId, productId) => {
    set({ isLoading: true, error: null });
    console.log('🗑️ Removing from cart:', { userId, productId });

    try {
      const response = await axios.delete(`${API_URL}/remove`, {
        data: { userId, productId },
      });

      console.log('✅ Remove from cart response:', response.data);

      if (response.data.success) {
        await get().getCart(userId);
        set({ isLoading: false });
        return { success: true, message: "Product removed from cart successfully!" };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Remove from cart error:', error);
      const errorMessage = error.response?.data?.message || "Failed to remove from cart";
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Update quantity
  updateQuantity: async (userId, productId, quantity) => {
    set({ isLoading: true, error: null });
    console.log('🔄 Updating quantity:', { userId, productId, quantity });

    try {
      const response = await axios.put(`${API_URL}/update`, {
        userId,
        productId,
        quantity,
      });

      console.log('✅ Update quantity response:', response.data);

      if (response.data.success) {
        await get().getCart(userId);
        set({ isLoading: false });
        return { success: true, message: "Quantity updated successfully!" };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Update quantity error:', error);
      const errorMessage = error.response?.data?.message || "Failed to update quantity";
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Get current cart
  getCart: async (userId) => {
    set({ isLoading: true, error: null });
    console.log('📦 Fetching cart for userId:', userId);

    try {
      const response = await axios.get(`${API_URL}`);
      console.log('✅ Get cart response:', response.data);

      if (response.data.success) {
        set({ cart: response.data.cart || {}, isLoading: false, error: null });
        return { success: true };
      } else {
        set({ cart: {}, error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Get cart error:', error);
      const errorMessage = error.response?.data?.message || "Failed to fetch cart";
      set({ cart: {}, error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Clear the entire cart
  clearCart: async (userId) => {
    set({ isLoading: true, error: null });
    console.log('🧹 Clearing cart for userId:', userId);

    try {
      const response = await axios.delete(`${API_URL}/clear`, {
        data: { userId },
      });

      console.log('✅ Clear cart response:', response.data);

      if (response.data.success) {
        set({ cart: { items: [], subTotal: 0 }, isLoading: false, error: null });
        return { success: true, message: "Cart cleared successfully!" };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Clear cart error:', error);
      const errorMessage = error.response?.data?.message || "Failed to clear cart";
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Check for errors
  checkCartError: () => set({ error: null }),

  // Helper functions
  getCartItemsCount: () => {
    const { cart } = get();
    return cart?.items?.length || 0;
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart?.subTotal || 0;
  }
}));
 
