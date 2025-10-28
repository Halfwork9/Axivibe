import axios from "axios";

const api = axios.create({
  baseURL: "https://api.nikhilmamdekar.site/api",
  withCredentials: true,
});

// Add a request interceptor to ensure credentials are always included
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
