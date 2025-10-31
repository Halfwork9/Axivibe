// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.nikhilmamdekar.site/api", // Use the full URL for production
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error("Request timed out");
    }
    // Handle 404 errors
    if (error.response?.status === 404) {
      console.error("Resource not found:", error.config?.url);
    }
    // Handle 502 errors
    if (error.response?.status === 502) {
      console.error("Server error:", error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;
