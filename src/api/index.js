import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://axivibe.onrender.com/api",
  withCredentials: true, // ✅ CRITICAL for cookies to persist on refresh
});

export default api;
