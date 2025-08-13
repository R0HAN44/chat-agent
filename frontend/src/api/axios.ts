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
  console.log(token)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global error handler (optional)
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";

      // ✅ Skip redirect for public bot endpoints
      if (!url.startsWith("/agents/")) {
        localStorage.removeItem("chat-agent-token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
