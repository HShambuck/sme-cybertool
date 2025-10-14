// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 60000, // Increased to 60 seconds for AI processing
  headers: {
    "Cache-Control": "no-cache",
  },
});

// Automatically attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("⏱️ Request timeout after 60 seconds");
    } else if (error.response) {
      console.error(
        "❌ API Error Response:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("📡 No response received from server");
    } else {
      console.error("🔥 Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
