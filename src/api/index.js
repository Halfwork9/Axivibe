// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.nikhilmamdekar.site/api", // Use the full URL for production
  timeout: 10000, // Increase timeout to 10 seconds
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
    return Promise.reject(error);
  }
);

export default api;
