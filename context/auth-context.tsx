"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo, useTransition } from 'react';
import type {
  User,
  RegisterData,
  PasswordResetRequest,
  PasswordResetData,
  PasswordResetResponse,
  AuthContextType,
} from '@/types/auth';
import { UserRole } from '@/types/auth';

// Import server actions
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  requestPasswordReset,
  resetPassword
} from '@/app/actions/auth';

// Enhanced AuthContext with loading states for different operations
interface EnhancedAuthContextType extends AuthContextType {
  loginLoading: boolean;
  registerLoading: boolean;
  resetLoading: boolean;
  requestResetLoading: boolean;
}

const AuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialUser = null
}: {
  children: ReactNode,
  initialUser?: User | null
}) => {
  // User state
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(!initialUser);

  // Operation-specific loading states
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [requestResetLoading, setRequestResetLoading] = useState<boolean>(false);

  // Use transition for smoother UI updates
  const [isPending, startTransition] = useTransition();

  // Fetch the current user
  const fetchUser = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const userData = await getCurrentUser();
      startTransition(() => {
        setUser(userData);
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with identifier (email or phone) and password
  const login = useCallback(async (identifier: string, password: string): Promise<void> => {
    setLoginLoading(true);
    try {
      const userData = await loginUser(identifier, password);
      startTransition(() => {
        setUser(userData);
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoginLoading(false);
    }
  }, []);

  // Register a new user
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setRegisterLoading(true);
    try {
      // Ensure role is one of the valid enum values
      if (!Object.values(UserRole).includes(data.role)) {
        data.role = UserRole.USER; // Default to user if invalid role
      }

      const userData = await registerUser(data);
      startTransition(() => {
        setUser(userData);
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setRegisterLoading(false);
    }
  }, []);

  // Logout the current user
  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutUser();
      startTransition(() => {
        setUser(null);
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  // Request password reset (email or phone)
  const handleRequestPasswordReset = useCallback(async (data: PasswordResetRequest): Promise<PasswordResetResponse> => {
    setRequestResetLoading(true);
    try {
      return await requestPasswordReset(data);
    } finally {
      setRequestResetLoading(false);
    }
  }, []);

  // Reset password (email+token or phone+code)
  const handleResetPassword = useCallback(async (data: PasswordResetData): Promise<PasswordResetResponse> => {
    setResetLoading(true);
    try {
      return await resetPassword(data);
    } finally {
      setResetLoading(false);
    }
  }, []);

  // Fetch user on mount if not provided initially
  useEffect(() => {
    if (!initialUser && loading) {
      void fetchUser();
    }
  }, [fetchUser, initialUser, loading]);

  // Memoize context value for performance
  const value = useMemo(() => ({
    user,
    loading,
    loginLoading,
    registerLoading,
    resetLoading,
    requestResetLoading,
    login,
    logout,
    register,
    fetchUser,
    requestPasswordReset: handleRequestPasswordReset,
    resetPassword: handleResetPassword,
  }), [
    user,
    loading,
    loginLoading,
    registerLoading,
    resetLoading,
    requestResetLoading,
    login,
    logout,
    register,
    fetchUser,
    handleRequestPasswordReset,
    handleResetPassword
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;