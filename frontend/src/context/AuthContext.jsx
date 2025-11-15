import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios'; // Dùng file api vừa tạo

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.token);
      setUser({ email: email, role: response.data.role, id: response.data.user_id });
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      alert(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      setToken(response.data.token);
      setUser({ email: userData.email, role: 'customer', id: response.data.user_id });
      navigate('/');
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      alert(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      register,
      formatCurrency
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook tiện ích
export function useAuth() {
  return useContext(AuthContext);
}