'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type {
  RegisterData,
  User,
  PasswordResetRequest,
  PasswordResetData,
  PasswordResetResponse,
  UserRole
} from '@/types/auth';

// Environment variable for API URL - correctly typed and defined
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Properly typed cookie options aligned with Next.js 15.4.2
type CookieOptions = {
  httpOnly?: boolean;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
  maxAge?: number;
  expires?: Date;
};

// Define the structure for API error responses
interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

/**
 * API error class for better error handling
 */
class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(message: string, status: number, data: ApiErrorData = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Interface for the cookie store methods
 */
interface CookieStore {
  set(name: string, value: string, options?: CookieOptions): void;
  get(name: string): { name: string; value: string } | undefined;
  delete(name: string): void;
}

/**
 * Type-safe cookie management for Next.js server components
 */
const cookieStore = {
  set(name: string, value: string, options?: CookieOptions): void {
    // Use type assertion with a specific interface instead of 'any'
    const cookieJar = cookies() as unknown as CookieStore;
    cookieJar.set(name, value, options);
  },

  get(name: string): string | undefined {
    // Use type assertion with a specific interface instead of 'any'
    const cookieJar = cookies() as unknown as CookieStore;
    return cookieJar.get(name)?.value;
  },

  delete(name: string): void {
    // Use type assertion with a specific interface instead of 'any'
    const cookieJar = cookies() as unknown as CookieStore;
    cookieJar.delete(name);
  }
};

/**
 * Helper function for API requests with proper typing and error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  }
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store', // Ensure fresh data
      next: { tags: ['auth'] } // For revalidation
    });

    // Parse response as JSON with unknown type first for safety
    const data = await response.json() as unknown;

    if (!response.ok) {
      // Type guard to ensure data has expected structure
      const errorData: ApiErrorData =
        typeof data === 'object' && data !== null
          ? data as ApiErrorData
          : {};

      const errorMessage =
        typeof errorData.message === 'string'
          ? errorData.message
          : `API error (${response.status})`;

      throw new ApiError(
        errorMessage,
        response.status,
        errorData
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle fetch errors (network issues, etc.)
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown API error',
      500,
      {}
    );
  }
}

/**
 * Server-side function to login a user
 */
export async function loginUser(identifier: string, password: string): Promise<User> {
  try {
    const data = await apiRequest<{ token: string; user: User }>('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    // Set the authentication token in cookies
    cookieStore.set('token', data.token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Revalidate any data that depends on authentication
    revalidatePath('/dashboard');

    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Server-side function to register a new user
 */
export async function registerUser(data: RegisterData): Promise<User> {
  try {
    const result = await apiRequest<{ token: string; user: User }>('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Set the authentication token in cookies
    cookieStore.set('token', result.token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Revalidate any data that depends on authentication
    revalidatePath('/dashboard');

    return result.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Server-side function to logout a user
 */
export async function logoutUser(): Promise<void> {
  const token = cookieStore.get('token');

  if (token) {
    try {
      await apiRequest<void>('/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    }
  }

  // Always delete the token cookie
  cookieStore.delete('token');

  // Revalidate relevant paths
  revalidatePath('/', 'layout');

  // Redirect to home page
  redirect('/');
}

/**
 * Server-side function to get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const token = cookieStore.get('token');

  if (!token) {
    return null;
  }

  try {
    const user = await apiRequest<User>('/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return user;
  } catch (error) {
    // Token is invalid, clear it
    cookieStore.delete('token');
    return null;
  }
}

/**
 * Server-side function to request password reset
 */
export async function requestPasswordReset(data: PasswordResetRequest): Promise<PasswordResetResponse> {
  return apiRequest<PasswordResetResponse>('/request-password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/**
 * Server-side function to reset password
 */
export async function resetPassword(data: PasswordResetData): Promise<PasswordResetResponse> {
  return apiRequest<PasswordResetResponse>('/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}