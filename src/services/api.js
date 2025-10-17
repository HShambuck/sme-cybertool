// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 60000, // Increased to 60 seconds for AI processing
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
});

// Automatically attach token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error("❌ Request setup error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle responses and errors
API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.code === "ECONNABORTED") {
      console.error("⏱️ Request timeout after 60 seconds");
      return Promise.reject({
        message: "Request timed out. Please try again.",
        code: "TIMEOUT",
      });
    }

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      console.error(`❌ API Error ${status}:`, data);

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;

        case 403:
          console.error("🚫 Access forbidden");
          break;

        case 404:
          console.error("🔍 Resource not found");
          break;

        case 429:
          console.error("⚠️ Rate limit exceeded");
          break;

        case 500:
          console.error("🔥 Server error");
          break;

        default:
          console.error(`🔴 Error ${status}`);
      }

      return Promise.reject({
        message: data.message || "An error occurred",
        status: status,
        data: data,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error("📡 No response received from server");
      return Promise.reject({
        message:
          "Unable to connect to server. Please check your internet connection.",
        code: "NO_RESPONSE",
      });
    } else {
      // Something else happened
      console.error("🔥 Request error:", error.message);
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        code: "REQUEST_ERROR",
      });
    }
  }
);

// Security API endpoints
export const securityAPI = {
  analyzeWebsite: (url) => API.post('/security/analyze', { url }),
  getScanHistory: (limit = 10) =>API.get(`/security/history?limit=${limit}`),
  getScanStats: () => API.get('/security/stats')
};

export default API;
