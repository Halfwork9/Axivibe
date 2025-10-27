const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://axivibe.onrender.com/api",
  withCredentials: true, // critical
});
