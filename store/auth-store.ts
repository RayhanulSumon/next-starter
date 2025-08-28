import { create } from 'zustand';
import { User, UserRole, RegisterData, LoginActionResult } from '../types/auth';
import { loginHandler } from '../lib/auth/loginHandler';
import { registerAction } from '../app/actions/auth/registerAction';
import { logoutUserAction } from '../app/actions/auth/logOutAction';
import { requestPasswordReset, resetPasswordAction } from '../app/actions/auth/resetPasswordAction';
import { getCurrentUser } from '../app/actions/auth/getCurrentUser';
import type { PasswordResetRequest, PasswordResetData } from '../types/auth';

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
  requestPasswordReset: (data: PasswordResetRequest) => Promise<any>; // Update to reflect actual response type
  resetPassword: (data: PasswordResetData) => Promise<any>; // Update to reflect actual response type
  fetchCurrentUser: () => Promise<void>;
  // Add other actions as needed
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loginLoading: false,
  registerLoading: false,
  resetLoading: false,
  requestResetLoading: false,
  initialLoading: true,
  setUser: (user) => set({ user }),
  login: async (identifier, password) => {
    set({ loginLoading: true });
    try {
      const result = await loginHandler(identifier, password, get().setUser, () => {});
      return result;
    } catch (error: any) {
      throw error?.message ? error : new Error('Login failed');
    } finally {
      set({ loginLoading: false });
    }
  },
  logout: async (redirectTo: string = "/login") => {
    try {
      await logoutUserAction();
      set({ user: null });
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    } catch (error) {
      throw error;
    }
  },
  requestPasswordReset: async (data: PasswordResetRequest) => {
    set({ requestResetLoading: true });
    try {
      return await requestPasswordReset(data); // Return the response
    } finally {
      set({ requestResetLoading: false });
    }
  },
  resetPassword: async (data: PasswordResetData) => {
    set({ resetLoading: true });
    try {
      return await resetPasswordAction(data); // Return the response
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