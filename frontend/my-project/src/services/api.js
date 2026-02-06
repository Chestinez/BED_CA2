// API configuration with axios
// Handles HTTP requests to backend and manages JWT token refresh
import axios from "axios";

// Main API instance - automatically refreshes tokens on 401 errors
export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Send cookies with requests
});

// Auth API instance - used for auth checks without triggering redirects
export const authApi = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Response interceptor - automatically refreshes expired tokens
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const responseErrConfig = err.config;
    // If 401 error and haven't retried yet, try to refresh token
    if (!responseErrConfig._retry && err.response?.status === 401) {
      responseErrConfig._retry = true;

      try {
        await api.get("/users/refresh");
        return api(responseErrConfig);
      } catch (refreshErr) {
        // Only redirect to login if not already on login or register pages
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);

api.interceptors.request.use(
  (res) => {
    res.headers["Content-Type"] = "application/json";
    return res;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default api;