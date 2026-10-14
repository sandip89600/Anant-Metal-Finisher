import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshAuth: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await authApi.getMe();
      if (response?.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      sessionStorage.removeItem('amf_auth_token');
      sessionStorage.removeItem('amp_auth_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    if (response?.token) {
      sessionStorage.setItem('amf_auth_token', response.token);
    }
    if (response?.user) {
      setUser(response.user);
    }
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API call failed, clearing local state.');
    } finally {
      sessionStorage.removeItem('amf_auth_token');
      sessionStorage.removeItem('amp_auth_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshAuth: checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
