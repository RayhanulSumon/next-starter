// Auth-related types for context, hooks, and API

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super-admin",
}

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  two_factor_enabled?: boolean;
  avatar?: string | null;
}

export interface RegisterData {
  name: string;
  email: string; // Changed from email?: string to make it required
  phone: string; // Changed from phone?: string to make it required
  password: string;
  password_confirmation: string;
  role: UserRole;
}

export interface PasswordResetRequest {
  email?: string;
  phone?: string;
}

export interface PasswordResetData {
  email?: string;
  phone?: string;
  token?: string;
  code?: string;
  password: string;
  password_confirmation: string;
}

export interface PasswordResetResponse {
  message: string;
  code?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type LoginActionResult =
  | { user: User; token: string }
  | { "2fa_required": true; user: User };

export interface AuthContextType {
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
  initialLoading: boolean;
}