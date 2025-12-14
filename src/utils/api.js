// src/utils/api.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // You'll need this in context, see below

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor (unchanged)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// NEW: Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response, // Success: pass through
  (error) => {
    // If response exists and it's 401 (auth failure)
    if (error.response?.status === 401) {
      // Clear token and user from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // If you store user data here too

      // Optional: Clear any app state (e.g., via AuthContext)
      // You'll dispatch a logout action here (see Step 2)

      // Redirect to login (use navigate in a hook/context)
      // For now, just alert or console; integrate with router below
      console.error('Session expired. Redirecting to login...');
      window.location.href = '/login'; // Simple redirect; use navigate for SPA
    }

    // For other errors (e.g., 500), just reject normally
    return Promise.reject(error);
  }
);

export default api;