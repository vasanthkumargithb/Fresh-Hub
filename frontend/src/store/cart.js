import { create } from "zustand";

export const useCartStore = create((set) => ({
    cart: [],
    totalItems: 0,
    totalPrice: 0,

    addToCart: (product) => {
        set((state) => {
            const existingProduct = state.cart.find((item) => item._id === product._id);
            if (existingProduct) {
                return {
                    cart: state.cart.map((item) =>
                        item._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                    totalItems: state.totalItems + 1,
                    totalPrice: state.totalPrice + product.price,
                };
            } else {
                return {
                    cart: [...state.cart, { ...product, quantity: 1 }],
                    totalItems: state.totalItems + 1,
                    totalPrice: state.totalPrice + product.price,
                };
            }
        });
    },

    removeFromCart: (productId) => {
        set((state) => {
            const productToRemove = state.cart.find((item) => item._id === productId);
            if (!productToRemove) return state;

            return {
                cart: state.cart.filter((item) => item._id !== productId),
                totalItems: state.totalItems - productToRemove.quantity,
                totalPrice: state.totalPrice - productToRemove.price * productToRemove.quantity,
            };
        });
    },

    updateQuantity: (productId, quantity) => {
        set((state) => {
            const productToUpdate = state.cart.find((item) => item._id === productId);
            if (!productToUpdate) return state;

            const quantityDifference = quantity - productToUpdate.quantity;

            return {
                cart: state.cart.map((item) =>
                    item._id === productId ? { ...item, quantity } : item
                ),
                totalItems: state.totalItems + quantityDifference,
                totalPrice:
                    state.totalPrice +
                    productToUpdate.price * quantityDifference,
            };
        });
    },

    clearCart: () => {
        set({ cart: [], totalItems: 0, totalPrice: 0 });
    },
}));
