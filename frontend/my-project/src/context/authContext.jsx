import { useState, useEffect } from "react";
import api, { authApi } from "../services/api";
import { authContext } from "./authContextCreator";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    const currentPath = window.location.pathname;

    // Always try to verify user, but use authApi to avoid redirect loops
    const initializeAuth = async () => {
      try {
        const res = await authApi.get("/users/profile/me");
        setUser(res.data.results);
        setIsAuthenticated(true);
        localStorage.setItem("userData", JSON.stringify(res.data.results));

        // If user is authenticated and on login/register page, redirect to dashboard
        if (
          currentPath === "/login" ||
          currentPath === "/register" ||
          currentPath === "/"
        ) {
          window.location.href = "/dashboard";
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("userData");
        // Don't redirect - let the user stay on current page
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
  const verifyUser = async () => {
    try {
      const res = await authApi.get("/users/profile/me");
      setUser(res.data.results);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, email, password) => {
    try {
      const res = await api.post("/users/login", { username, email, password });
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      // Store user data in localStorage for consistency
      localStorage.setItem("userData", JSON.stringify(res.data.user));
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      localStorage.removeItem("userData");
      throw err;
    }
  };
  const logout = async () => {
    try {
      await api.get("/users/logout");
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      window.location.href = "/login";
    }
  };

  const register = async (username, email, password, description) => {
    try {
      const res = await api.post("/users/register", {
        username,
        email,
        password,
        description,
      });
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      // Store user data in localStorage for consistency
      localStorage.setItem("userData", JSON.stringify(res.data.user));
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      localStorage.removeItem("userData");
      throw err;
    }
  };

  const showPopUp = (message, type) => {
    if (type == "success") {
      setNotifications({ message, type });
    }
    setTimeout(() => {
      setNotifications(null);
    }, 3000);
  };
  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    login,
    logout,
    showPopUp,
    notifications,
    setNotifications,
    register,
    verifyUser, // Expose verifyUser for manual calls
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
