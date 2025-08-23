"use client";

import React, {
  createContext,
  useState,
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
  LoginActionResult,
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
import { isTwoFARequired, isUserToken } from "@/lib/authGuards";
import { loginHandler } from "@/lib/auth/loginHandler";

// Enhanced AuthContext with loading states for different operations
interface EnhancedAuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<LoginActionResult>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  requestPasswordReset: (
    data: PasswordResetRequest,
  ) => Promise<PasswordResetResponse>;
  resetPassword: (data: PasswordResetData) => Promise<PasswordResetResponse>;
  loginLoading: boolean;
  registerLoading: boolean;
  resetLoading: boolean;
  requestResetLoading: boolean;
  initialLoading: boolean; // New state to indicate initial loading
}

// Create a context with a default value that satisfies TypeScript but will be overridden by the provider
const AuthContext = createContext<EnhancedAuthContextType>({
  user: null,
  loading: false,
  loginLoading: false,
  registerLoading: false,
  resetLoading: false,
  requestResetLoading: false,
  initialLoading: true, // Default to true for initial loading
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
  fetchUserOnMount = true,
}: {
  children: ReactNode;
  initialUser?: User | null;
  fetchUserOnMount?: boolean;
}) => {
  // User state
  const [user, setUser] = useState<User | null>(initialUser);

  // Operation-specific loading states
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [requestResetLoading, setRequestResetLoading] =
    useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState(true); // Add initialLoading state

  // Use transition for smoother UI updates
  const [, startTransition] = useTransition();

  // Login with identifier (email or phone) and password
  const login = useCallback(
    async (
      identifier: string,
      password: string,
    ): Promise<LoginActionResult> => {
      setLoginLoading(true);
      try {
        return await loginHandler(identifier, password, setUser, startTransition);
      } catch (error: unknown) {
        if (error instanceof Error && error.message) {
          throw error;
        }
        throw new Error('Login failed');
      } finally {
        setLoginLoading(false);
      }
    },
    [setUser, startTransition],
  );

  // Register a new user
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setRegisterLoading(true);
    try {
      // Ensure role is one of the valid enum values
      if (!Object.values(UserRole).includes(data.role)) {
        data.role = UserRole.USER; // Default to user if invalid role
      }

      const result = await registerAction(data);
      startTransition(() => {
        setUser(result.data?.user ?? null);
      });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setRegisterLoading(false);
    }
  }, []);

  // Logout the current user
  const logout = useCallback(async (redirectTo: string = "/login"): Promise<void> => {
    try {
      await logoutUserAction();
      setUser(null);
      window.location.href = redirectTo;
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
    [],
  );

  // Reset password (email+token or phone+code)
  const handleResetPassword = useCallback(
    async (data: PasswordResetData): Promise<PasswordResetResponse> => {
      setResetLoading(true);
      try {
        return await resetPasswordAction(data);
      } finally {
        setResetLoading(false);
      }
    },
    [],
  );

  // Fetch current user on mount (for hydration after reload)
  React.useEffect(() => {
    if (!fetchUserOnMount) {
      setInitialLoading(false);
      return;
    }
    // Only fetch if user is not already set from initialUser
    if (user !== null) {
      setInitialLoading(false);
      return;
    }
    let isMounted = true;
    (async () => {
      try {
        const { getCurrentUser } = await import("@/app/actions/auth/getCurrentUser");
        const result = await getCurrentUser();
        if (isMounted) {
          setUser(result.data ?? null);
        }
      } catch (error) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [user, fetchUserOnMount]);

  // Memoize context value for performance
  const value = useMemo(
    () => ({
      user,
      loading:
        loginLoading || registerLoading || resetLoading || requestResetLoading,
      initialLoading,
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
      loginLoading,
      registerLoading,
      resetLoading,
      requestResetLoading,
      initialLoading,
      login,
      logout,
      register,
      handleRequestPasswordReset,
      handleResetPassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;