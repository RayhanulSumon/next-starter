import { create } from 'zustand';
import { User, LoginActionResult } from '@/types/auth';
import { loginHandler } from '@/lib/auth/loginHandler';
import { registerAction } from '@/app/actions/auth/registerAction';
import { logoutUserAction } from '@/app/actions/auth/logOutAction';
import { requestPasswordReset, resetPasswordAction } from '@/app/actions/auth/resetPasswordAction';
import { getCurrentUser } from '@/app/actions/auth/getCurrentUser';
import type { PasswordResetRequest, PasswordResetData, PasswordResetResponse } from '@/types/auth';

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
  register: (data: { identifier: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
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
  resetAuthState: () => set({
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
      return await loginHandler(identifier, password, get().setUser);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    } finally {
      set({ loginLoading: false });
    }
  },
  logout: async (redirectTo = "/login") => {
    try {
      await logoutUserAction();
      get().resetAuthState();
      // Removed window.location.href redirect to avoid double navigation and delay
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Logout failed' });
      throw error;
    }
  },
  requestPasswordReset: async (data) => {
    set({ requestResetLoading: true, error: null });
    try {
      return await requestPasswordReset(data);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Password reset request failed' });
      throw error;
    } finally {
      set({ requestResetLoading: false });
    }
  },
  resetPassword: async (data) => {
    set({ resetLoading: true, error: null });
    try {
      return await resetPasswordAction(data);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Password reset failed' });
      throw error;
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
      set({ user: null, error: error instanceof Error ? error.message : 'Failed to fetch user' });
      throw error;
    } finally {
      set({ initialLoading: false });
    }
  },
  register: async (data) => {
    set({ registerLoading: true, error: null });
    try {

      const result = await registerAction(data);
      if (result.data && result.data.user) {
        set({ user: result.data.user, initialLoading: false });
      } else {
        set({ user: null, initialLoading: false });
        throw new Error("Registration did not return a user.");
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    } finally {
      set({ registerLoading: false });
    }
  },
  // Add other actions (reset, requestReset, etc.) as needed
}));