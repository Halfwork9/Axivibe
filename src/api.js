// client/src/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ allows cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
