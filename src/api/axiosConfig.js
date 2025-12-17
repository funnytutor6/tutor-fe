import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      if (error.response.status === 401) {
        // Unauthorized - clear user data
        localStorage.removeItem("user");
        localStorage.removeItem("studentId");
        localStorage.removeItem("teacherId");
        // Optionally redirect to login
        if (window.location.pathname !== "/login/student" && window.location.pathname !== "/login/teacher") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

