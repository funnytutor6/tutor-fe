import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      console.log("Login function called with userData:", userData);
      // Store user data directly (no API call needed since TeacherAuth handles that)
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Store additional IDs for backward compatibility
      if (userData.role === "student") {
        localStorage.setItem("studentId", userData.studentId?.toString());
      } else if (userData.role === "teacher") {
        localStorage.setItem("teacherId", userData.teacherId?.toString());
      }

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Registration is handled by auth components, this is just for storing
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Store additional IDs for backward compatibility
      if (userData.role === "student") {
        localStorage.setItem("studentId", userData.studentId?.toString());
      } else if (userData.role === "teacher") {
        localStorage.setItem("teacherId", userData.teacherId?.toString());
      }
      
      return userData;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  };

  const logout = async () => {
    try {
      // Clear user data from state and localStorage
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("studentId");
      localStorage.removeItem("teacherId");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local data even if there's an error
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("studentId");
      localStorage.removeItem("teacherId");
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Update local user data
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error.response?.data || { message: "Profile update failed" };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
