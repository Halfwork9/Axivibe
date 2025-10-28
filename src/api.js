// In your api/index.js file
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.nikhilmamdekar.site/api",
  withCredentials: true,
  // Add this to ensure cookies are sent with all requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include credentials in all requests
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
