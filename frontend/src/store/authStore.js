import { create } from 'zustand'
import axios from 'axios'

const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false })
            console.log("success!")
        } catch (error) {
            set({ error: error.response.data.message || "error signing up", isLoading: false });
            throw error
        }
    },

    signin: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(`${API_URL}/signin`, { email, password });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.message || "An unexpected error occurred",
                isLoading: false,
            });

        }
    }, 
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },
    verifyEmail: async (code) => {
        const verification = code;
        set({ isLoading: true, error: null })
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { "code": verification });
            console.log(response.data)
            set({ user: response.data.user, isLoading: false, isAuthenticated: true })
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false })
            throw error;
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null, })
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isAuthenticated: false, isCheckingAuth: false })
        }
    }

}))