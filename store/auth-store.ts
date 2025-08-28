import { create } from 'zustand';
import { User, UserRole, RegisterData, LoginActionResult } from '../types/auth';
import { loginHandler } from '../lib/auth/loginHandler';
import { registerAction } from '../app/actions/auth/registerAction';
import { logoutUserAction } from '../app/actions/auth/logOutAction';
import { requestPasswordReset, resetPasswordAction } from '../app/actions/auth/resetPasswordAction';
import { getCurrentUser } from '../app/actions/auth/getCurrentUser';
import type { PasswordResetRequest, PasswordResetData, PasswordResetResponse } from '../types/auth';

interface AuthState {
  user: User | null;
  loginLoading: boolean;
  registerLoading: boolean;
  resetLoading: boolean;
  requestResetLoading: boolean;
  initialLoading: boolean;
  setUser: (user: User | null) => void;
  login: (identifier: string, password: string) => Promise<LoginActionResult>;
  register: (data: RegisterData) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<PasswordResetResponse>;
  resetPassword: (data: PasswordResetData) => Promise<PasswordResetResponse>;
  fetchCurrentUser: () => Promise<void>;
  resetAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loginLoading: false,
  registerLoading: false,
  resetLoading: false,
  requestResetLoading: false,
  initialLoading: true,
  setUser: (user) => set({ user }),
  resetAuthState: () => set({
    user: null,
    loginLoading: false,
    registerLoading: false,
    resetLoading: false,
    requestResetLoading: false,
    initialLoading: false,
  }),
  login: async (identifier, password) => {
    set({ loginLoading: true });
    try {
      return await loginHandler(identifier, password, get().setUser, () => {});
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    } finally {
      set({ loginLoading: false });
    }
  },
  logout: async (redirectTo = "/login") => {
    try {
      await logoutUserAction();
      get().resetAuthState();
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    } catch (error) {
      throw error;
    }
  },
  requestPasswordReset: async (data) => {
    set({ requestResetLoading: true });
    try {
      return await requestPasswordReset(data);
    } finally {
      set({ requestResetLoading: false });
    }
  },
  resetPassword: async (data) => {
    set({ resetLoading: true });
    try {
      return await resetPasswordAction(data);
    } finally {
      set({ resetLoading: false });
    }
  },
  fetchCurrentUser: async () => {
    set({ initialLoading: true });
    try {
      const result = await getCurrentUser();
      set({ user: result.data ?? null });
    } catch {
      set({ user: null });
    } finally {
      set({ initialLoading: false });
    }
  },
  register: async (data) => {
    set({ registerLoading: true });
    try {
      if (!Object.values(UserRole).includes(data.role)) {
        data.role = UserRole.USER;
      }
      const result = await registerAction(data);
      if (result.data && result.data.user) {
        set({ user: result.data.user, initialLoading: false });
      } else {
        set({ user: null, initialLoading: false });
        throw new Error("Registration did not return a user.");
      }
    } catch (error) {
      throw error;
    } finally {
      set({ registerLoading: false });
    }
  },
  // Add other actions (reset, requestReset, etc.) as needed
}));