import { create } from "zustand";
import {
  User,
  LoginActionResult,
  PasswordResetRequest,
  PasswordResetData,
  PasswordResetResponse,
} from "@/types/auth-types";
import { loginHandler } from "@/lib/auth/loginHandler";
import { registerHandler } from "@/lib/auth/registerHandler";
import { logoutUserAction } from "@/app/actions/auth/logOutAction";
import { requestPasswordReset, resetPasswordAction } from "@/app/actions/auth/resetPasswordAction";
import { getCurrentUser } from "@/app/actions/auth/getCurrentUser";

interface AuthState {
  user: User | null;
  loginLoading: boolean;
  registerLoading: boolean;
  resetLoading: boolean;
  requestResetLoading: boolean;
  initialLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (identifier: string, password: string) => Promise<LoginActionResult>;
  register: (data: {
    identifier: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<PasswordResetResponse>;
  resetPassword: (data: PasswordResetData) => Promise<PasswordResetResponse>;
  fetchCurrentUser: () => Promise<void>;
  resetAuthState: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loginLoading: false,
  registerLoading: false,
  resetLoading: false,
  requestResetLoading: false,
  initialLoading: true,
  error: null,
  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
  resetAuthState: () =>
    set({
      user: null,
      loginLoading: false,
      registerLoading: false,
      resetLoading: false,
      requestResetLoading: false,
      initialLoading: false,
      error: null,
    }),
  login: async (identifier, password) => {
    set({ loginLoading: true, error: null });
    try {
      const result = await loginHandler(identifier, password, get().setUser);
      // Set token in localStorage on the client after successful login
      if (typeof window !== "undefined" && result && "token" in result && result.token) {
        localStorage.setItem("token", result.token);
      }
      return result;
    } finally {
      set({ loginLoading: false });
    }
  },
  logout: async () => {
    try {
      await logoutUserAction();
      get().resetAuthState();
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      // Removed window.location.href redirect to avoid double navigation and delay
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Logout failed" });
      // Do not re-throw
    }
  },
  requestPasswordReset: async (data) => {
    set({ requestResetLoading: true, error: null });
    try {
      return await requestPasswordReset(data);
    } finally {
      set({ requestResetLoading: false });
    }
  },
  resetPassword: async (data) => {
    set({ resetLoading: true, error: null });
    try {
      return await resetPasswordAction(data);
    } finally {
      set({ resetLoading: false });
    }
  },
  fetchCurrentUser: async () => {
    set({ initialLoading: true, error: null });
    try {
      const result = await getCurrentUser();
      set({ user: result.data ?? null });
    } catch (error) {
      set({ user: null, error: error instanceof Error ? error.message : "Failed to fetch user" });
      throw error;
    } finally {
      set({ initialLoading: false });
    }
  },
  register: async (data) => {
    set({ registerLoading: true, error: null });
    try {
      const result = await registerHandler(data, get().setUser);
      // Set token in localStorage on the client after successful registration
      if (typeof window !== "undefined" && result.token) {
        localStorage.setItem("token", result.token);
      }
    } finally {
      set({ registerLoading: false });
    }
  },
  // Add other actions (reset, requestReset, etc.) as needed
}));