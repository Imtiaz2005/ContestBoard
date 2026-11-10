import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Update this to your PHP backend's actual running URL
const API_BASE_URL = "http://localhost/ContestBoard/backend/auth/"; 

// Configure Axios to always send cookies for sessions
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/me.php`);
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login.php`, {
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true, role: response.data.user.role };
      }
    } catch (error) {
       return { 
           success: false, 
           message: error.response?.data?.message || "Login failed" 
       };
    }
  };

  const signup = async (name, email, password, role) => {
     try {
       const response = await axios.post(`${API_BASE_URL}/signup.php`, {
         name, email, password, role
       });
       return { success: true, data: response.data };
     } catch (error) {
        return { 
           success: false, 
           message: error.response?.data?.message || "Signup failed" 
       };
     }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/logout.php`);
      setUser(null);
      
      // লগআউট হওয়ার সাথে সাথে আগের ইউজারের সব লোকাল ডাটা মুছে ফেলবে
      localStorage.removeItem("contestboard-profile");
      localStorage.removeItem("contestboard-saved");
      
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);