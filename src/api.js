// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.nikhilmamdekar.site/api", // Use the full URL for production
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
    return Promise.reject(error);
  }
);

export default api;
