"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';
import type {
  User,
  RegisterData,
  PasswordResetRequest,
  PasswordResetData,
  PasswordResetResponse,
  AuthContextType,
  LoginResponse
} from '@/types/auth';
import { UserRole } from '@/types/auth';
import {axiosClient} from "@/hook/axiosClient";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Login with identifier (email or phone) and password
  const login = useCallback(async (identifier: string, password: string): Promise<void> => {
    const payload = { identifier, password };
    const { data } = await axiosClient.post<LoginResponse>('/login', payload);
    Cookies.set('token', data.token);
    setUser(data.user);
  }, []);

  // Register a new user
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    try {
      // Ensure role is one of the valid enum values
      if (!Object.values(UserRole).includes(data.role)) {
        data.role = UserRole.USER; // Default to user if invalid role
      }

      console.log('Sending registration data:', data);
      const response = await axiosClient.post('/register', data);
      console.log('Registration response:', response);

      const identifier = data.email || data.phone;
      await login(identifier, data.password);
    } catch (error: any) {
      console.error('Registration error:', error);
      // Log more detailed error information if available
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  }, [login]);

  // Logout the current user
  const logout = useCallback(async (): Promise<void> => {
    await axiosClient.post('/logout');
    Cookies.remove('token');
    setUser(null);
  }, []);

  // Request password reset (email or phone)
  const requestPasswordReset = useCallback(async (data: PasswordResetRequest): Promise<PasswordResetResponse> => {
    const res = await axiosClient.post<PasswordResetResponse>('/request-password-reset', data);
    return res.data;
  }, []);

  // Reset password (email+token or phone+code)
  const resetPassword = useCallback(async (data: PasswordResetData): Promise<PasswordResetResponse> => {
    const res = await axiosClient.post<PasswordResetResponse>('/reset-password', data);
    return res.data;
  }, []);

  // Fetch the current user
  const fetchUser = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // Check if token exists before attempting to fetch user
      const token = Cookies.get('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data } = await axiosClient.get<User>('/user');
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      // Clear token if it's invalid
      Cookies.remove('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user on mount - with better control
  useEffect(() => {
    // Only fetch user if we haven't already determined the state
    if (loading) {
      void fetchUser();
    }
  }, [fetchUser, loading]);

  // Memoize context value for performance
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    register,
    fetchUser,
    requestPasswordReset,
    resetPassword,
  }), [user, loading, login, logout, register, fetchUser, requestPasswordReset, resetPassword]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;