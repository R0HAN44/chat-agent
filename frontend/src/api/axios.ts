// src/api/axios.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"; // Vite env
console.log(baseURL)

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("chat-agent-token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global error handler (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle 401s, logging, Sentry, etc. here
    if (error.response?.status === 401) {
      localStorage.removeItem("chat-agent-token");
      window.location.href = "/login"; // force logout
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
