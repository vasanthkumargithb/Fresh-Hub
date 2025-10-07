import { create } from "zustand";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  // ✅ Create new product
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.unit || !newProduct.image) {
      return { success: false, message: "Please provide full details of the product!" };
    }

    try {
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to create product" };
      }

      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created successfully!" };
    } catch (error) {
      return { success: false, message: "Network or server error while creating product." };
    }
  },

  // ✅ Fetch all products
  fetchProducts: async () => {
    try {
      const res = await fetch(`${API_URL}`);
      const data = await res.json();
      set({ products: data.data || [] });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  // ✅ Delete product
  deleteProducts: async (pid) => {
    try {
      const res = await fetch(`${API_URL}/${pid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error deleting product" };
    }
  },

  // ✅ Update product
  updateProducts: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`${API_URL}/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();
      if (!data.success)
        return { success: false, message: "Error while updating the product details" };

      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));

      return { success: true, message: "Successfully updated!" };
    } catch (error) {
      return { success: false, message: "Network or server error while updating product." };
    }
  },
}));
