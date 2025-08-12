// Shared types, constants, and error class for auth actions
import type {
  RegisterData,
  User,
  PasswordResetRequest,
  PasswordResetData,
  PasswordResetResponse,
} from '@/types/auth';

// Only import 'cookies' if running in a server environment
let cookies: any;
if (typeof window === 'undefined') {
  // @ts-ignore
  cookies = require('next/headers').cookies;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export type CookieOptions = {
  httpOnly?: boolean;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
  maxAge?: number;
  expires?: Date;
};

export interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorData;
  cause?: unknown;

  constructor(message: string, status: number, data: ApiErrorData = {}, cause?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.cause = cause;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toString() {
    return `${this.name} (${this.status}): ${this.message}` + (this.data?.message ? ` - ${this.data.message}` : '');
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      message: this.message,
      data: this.data,
      cause: this.cause instanceof Error ? this.cause.message : this.cause,
      stack: this.stack,
    };
  }

  /**
   * Create an ApiError from a fetch Response object
   */
  static async fromResponse(response: Response): Promise<ApiError> {
    let data: ApiErrorData = {};
    let message = `API error (${response.status})`;
    try {
      data = await response.json();
      if (typeof data.message === 'string') message = data.message;
    } catch {
      // ignore JSON parse errors
    }
    return new ApiError(message, response.status, data);
  }

  /**
   * Get a user-friendly error message for UI display
   */
  getUserMessage(defaultMsg = 'Something went wrong'): string {
    if (this.data?.message) return this.data.message;
    if (this.message) return this.message;
    return defaultMsg;
  }
}

// Add apiRequest and cookieStore utilities
export const cookieStore = {
  set(name: string, value: string, options?: CookieOptions): void {
    if (!cookies) return;
    const cookieJar = cookies() as any;
    cookieJar.set(name, value, options);
  },
  get(name: string): string | undefined {
    if (!cookies) return undefined;
    const cookieJar = cookies() as any;
    return cookieJar.get(name)?.value;
  },
  delete(name: string): void {
    if (!cookies) return;
    const cookieJar = cookies() as any;
    cookieJar.delete(name);
  }
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' }
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      next: { tags: ['auth'] }
    });
    const contentType = response.headers.get('content-type');
    let data: any = {};
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }
    if (!response.ok) {
      // If the error message looks like HTML, show a generic message
      const msg = (data && typeof data.message === 'string' && !/^<!DOCTYPE html>/i.test(data.message))
        ? data.message
        : `API error (${response.status})`;
      throw new Error(msg);
    }
    return data as T;
  } catch (error: any) {
    // Global error handling: always throw a simple error
    const message = error?.message || 'Network or server error';
    throw new Error(message);
  }
}