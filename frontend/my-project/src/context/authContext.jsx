// Authentication Context Provider
// Manages user authentication state and provides auth functions to the app
import { useState, useEffect } from "react";
import api, { authApi } from "../services/api";
import { authContext } from "./authContextCreator";

export const AuthProvider = ({ children }) => {
  // State management
  const [user, setUser] = useState(null); // Current user data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth status
  const [loading, setLoading] = useState(true); // Loading state
  const [notifications, setNotifications] = useState(null); // Notifications

  // Initialize authentication on app load
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    const initializeAuth = async () => {
      try {
        // Verify user is authenticated
        const res = await authApi.get("/users/profile/me");
        const userData = Array.isArray(res.data.results)
          ? res.data.results[0]
          : res.data.results;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("userData", JSON.stringify(userData));

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
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
  const verifyUser = async () => {
    try {
      const res = await authApi.get("/users/profile/me");
      // Fix: Extract user data from array format [userData]
      const userData = Array.isArray(res.data.results)
        ? res.data.results[0]
        : res.data.results;
      setUser(userData);
      setIsAuthenticated(true);
      // Update localStorage with fresh data
      localStorage.setItem("userData", JSON.stringify(userData));
      return true;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("userData");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    // Force refresh user data (useful after completing challenges)
    try {
      const res = await authApi.get("/users/profile/me");
      // Fix: Extract user data from array format [userData]
      const userData = Array.isArray(res.data.results)
        ? res.data.results[0]
        : res.data.results;
      setUser(userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      return false;
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

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    login,
    logout,
    notifications,
    setNotifications,
    register,
    verifyUser, // Expose verifyUser for manual calls
    refreshUserData, // Expose refreshUserData for updating stats
  };

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  );
};
