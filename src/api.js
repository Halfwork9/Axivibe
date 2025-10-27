import axios from "axios";

const api = axios.create({
  baseURL: "https://api.nikhilmamdekar.site/api",
  withCredentials: true, // 👈 critical for cookies
});

export default api;
