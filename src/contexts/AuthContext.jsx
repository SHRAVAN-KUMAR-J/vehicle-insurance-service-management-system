import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/user/profile');
      setUser(res.data.user);
    } catch (error) {
      console.error('Token validation failed:', error.response?.status || error.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  const loginWithPassword = async (email, password, role) => {
    try {
      const payload = { email, password, role };
      const res = await api.post('/auth/login', payload);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      await validateToken();
      return { user: res.data.user, role: res.data.user.role };
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      }
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (data) => {
    try {
      const res = await api.post('/auth/request-otp', data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || 'OTP verification failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.replace('/login');
    return '/login';
  };

  const navigateBasedOnRole = (role) => {
    if (role === 'admin') return '/admin';
    else if (role === 'staff') return '/staff';
    else return '/customer';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithPassword, 
      register, 
      verifyOTP, 
      logout, 
      navigateBasedOnRole,
      validateToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the custom hook to use context data
export const useAuth = () => {
  return useContext(AuthContext);
};
