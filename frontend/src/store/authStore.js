import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name, accountType) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        accountType
      });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
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
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({
        error: "Error logging out",
        isLoading: false,
      });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      set({
        isAuthenticated: false,
        isCheckingAuth: false,
        error: null, // No need to show error on initial load
      });
    }
  },

  deleteAcc: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/user/delete`, {
        data: { email }
      });
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting account",
        isLoading: false,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error sending reset link",
        isLoading: false,
      });
    }
  },

  resetPassword: async (password, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error resetting password",
        isLoading: false,
      });
      throw error;
    }
  },
}));
