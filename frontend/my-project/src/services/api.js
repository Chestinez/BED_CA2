import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Separate instance for auth verification that won't trigger redirects
export const authApi = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const responseErrConfig = err.config;
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
    console.log(`Error config: ${err.config}`);
    return Promise.reject(err);
  },
);

export default api;