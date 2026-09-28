"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from './api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<any>(null);

export const useAdminAuth = () => useContext(AuthContext);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function describeAuthError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return error?.message || 'Authentication failed. Please try again.';
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [user, setUser] = useState<{ name: string, role: string, avatar?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsRestoring(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { token, name, role, avatar } = res.data;
      
      localStorage.setItem('adminToken', token);
      
      const userData = { name, role, avatar };
      localStorage.setItem('adminUser', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isRestoring, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
