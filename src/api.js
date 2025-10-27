// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.nikhilmamdekar.site/api",
  withCredentials: true,
});

export default api;
