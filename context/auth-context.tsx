"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import type { ReactNode } from "react";
import type {
  User,
  RegisterData,
  PasswordResetRequest,
  PasswordResetData,
  PasswordResetResponse,
  AuthContextType,
} from "@/types/auth";
import { UserRole } from "@/types/auth";

// Import server actions
import { loginAction } from "@/app/actions/auth/loginAction";
import { registerAction } from "@/app/actions/auth/registerAction";
import {
  requestPasswordReset,
  resetPasswordAction,
} from "@/app/actions/auth/resetPasswordAction";
import { logoutUserAction } from "@/app/actions/auth/logOutAction";

// Enhanced AuthContext with loading states for different operations
interface EnhancedAuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  requestPasswordReset: (
    data: PasswordResetRequest
  ) => Promise<PasswordResetResponse>;
  resetPassword: (data: PasswordResetData) => Promise<PasswordResetResponse>;
  loginLoading: boolean;
  registerLoading: boolean;
  resetLoading: boolean;
  requestResetLoading: boolean;
}

// Create a context with a default value that satisfies TypeScript but will be overridden by the provider
const AuthContext = createContext<EnhancedAuthContextType>({
  user: null,
  loading: false,
  loginLoading: false,
  registerLoading: false,
  resetLoading: false,
  requestResetLoading: false,
  login: async () => {
    throw new Error("AuthContext not initialized");
  },
  logout: async () => {
    throw new Error("AuthContext not initialized");
  },
  register: async () => {
    throw new Error("AuthContext not initialized");
  },
  requestPasswordReset: async () => {
    throw new Error("AuthContext not initialized");
  },
  resetPassword: async () => {
    throw new Error("AuthContext not initialized");
  },

});

export const AuthProvider = ({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) => {
  // Utility to fetch user after registration
  const fetchUser = useCallback(async (): Promise<User | null> => {
    const { getCurrentUser } = await import(
      "@/app/actions/auth/getCurrentUser"
    );
    return await getCurrentUser();
  }, []);
  // User state
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(!initialUser);

  // Operation-specific loading states
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [requestResetLoading, setRequestResetLoading] =
    useState<boolean>(false);

  // Use transition for smoother UI updates
  const [isPending, startTransition] = useTransition();

  // Login with identifier (email or phone) and password
  const login = useCallback(
    async (identifier: string, password: string): Promise<void> => {
      setLoginLoading(true);
      try {
        const userData = await loginAction(identifier, password);
        startTransition(() => {
          setUser(userData);
        });
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      } finally {
        setLoginLoading(false);
      }
    },
    []
  );

  // Register a new user
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setRegisterLoading(true);
    try {
      // Ensure role is one of the valid enum values
      if (!Object.values(UserRole).includes(data.role)) {
        data.role = UserRole.USER; // Default to user if invalid role
      }

      await registerAction(data);
      // Refetch user to ensure cookie is set
      const { getCurrentUser } = await import(
        "@/app/actions/auth/getCurrentUser"
      );
      const freshUser = await getCurrentUser();
      startTransition(() => {
        setUser(freshUser);
      });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setRegisterLoading(false);
    }
  }, []);

  // Logout the current user
  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutUserAction();
      startTransition(() => {
        setUser(null);
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  // Request password reset (email or phone)
  const handleRequestPasswordReset = useCallback(
    async (data: PasswordResetRequest): Promise<PasswordResetResponse> => {
      setRequestResetLoading(true);
      try {
        return await requestPasswordReset(data);
      } catch (error) {
        console.error("Password reset request error:", error);
        throw error;
      } finally {
        setRequestResetLoading(false);
      }
    },
    []
  );

  // Reset password (email+token or phone+code)
  const handleResetPassword = useCallback(
    async (data: PasswordResetData): Promise<PasswordResetResponse> => {
      setResetLoading(true);
      try {
        return await resetPasswordAction(data);
      } catch (error) {
        console.error("Password reset error:", error);
        throw error;
      } finally {
        setResetLoading(false);
      }
    },
    []
  );

  // Memoize context value for performance
  const value = useMemo(
    () => ({
      user,
      loading,
      loginLoading,
      registerLoading,
      resetLoading,
      requestResetLoading,
      login,
      logout,
      register,
      requestPasswordReset: handleRequestPasswordReset,
      resetPassword: handleResetPassword,
    }),
    [
      user,
      loading,
      loginLoading,
      registerLoading,
      resetLoading,
      requestResetLoading,
      login,
      logout,
      register,
      handleRequestPasswordReset,
      handleResetPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
