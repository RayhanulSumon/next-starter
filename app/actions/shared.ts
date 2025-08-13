// Shared types, constants, and error class for auth actions
import type {
  RegisterData,
  User,
  PasswordResetRequest,
  PasswordResetData,
  PasswordResetResponse,
} from "@/types/auth";

// Only import 'cookies' if running in a server environment
let cookies: any;
if (typeof window === "undefined") {
  // @ts-ignore
  cookies = require("next/headers").cookies;
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export type CookieOptions = {
  httpOnly?: boolean;
  path?: string;
  sameSite?: "strict" | "lax" | "none";
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

  constructor(
    message: string,
    status: number,
    data: ApiErrorData = {},
    cause?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.cause = cause;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toString() {
    return (
      `${this.name} (${this.status}): ${this.message}` +
      (this.data?.message ? ` - ${this.data.message}` : "")
    );
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
      if (typeof data.message === "string") message = data.message;
    } catch {
      // ignore JSON parse errors
    }
    return new ApiError(message, response.status, data);
  }

  /**
   * Get a user-friendly error message for UI display
   */
  getUserMessage(defaultMsg = "Something went wrong"): string {
    if (this.data?.message) return this.data.message;
    if (this.message) return this.message;
    return defaultMsg;
  }
}

// Add apiRequest and cookieStore utilities
export const cookieStore = {
  async set(
    name: string,
    value: string,
    options?: CookieOptions
  ): Promise<void> {
    if (!cookies) {
      throw new Error(
        "Cookies can only be modified in a Server Action or Route Handler. See: https://nextjs.org/docs/app/api-reference/functions/cookies#options"
      );
    }
    const cookieJar = await cookies();
    cookieJar.set(name, value, options);
  },
  async get(name: string): Promise<string | undefined> {
    if (!cookies) return undefined;
    const cookieJar = await cookies();
    return cookieJar.get(name)?.value;
  },
  async delete(name: string): Promise<void> {
    if (!cookies) return;
    const cookieJar = await cookies();
    cookieJar.delete(name);
  },
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    signal?: AbortSignal;
    autoAttachToken?: boolean;
  }
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  try {
    // Attach token automatically if requested
    // Ensure headers is always a plain object
    let headers: Record<string, string> = {};
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        headers = { ...options.headers };
      }
    }
    if (options.autoAttachToken) {
      // Try to get token from cookies (server) or localStorage (client)
      let token = undefined;
      if (typeof window === "undefined") {
        token = cookieStore.get("token");
      } else {
        token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("token")
            : undefined;
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
      next: { tags: ["auth"] },
      signal: options.signal,
    });
    const contentType = response.headers.get("content-type");
    let data: any = {};
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }
    if (!response.ok) {
      // If the error message looks like HTML, show a generic message
      const msg =
        data &&
        typeof data.message === "string" &&
        !/^<!DOCTYPE html>/i.test(data.message)
          ? data.message
          : `API error (${response.status})`;
      throw new ApiError(msg, response.status, data);
    }
    return data as T;
  } catch (error: any) {
    // Log unexpected errors for reporting
    if (process.env.NODE_ENV !== "production") {
      console.error("apiRequest error:", error);
    }
    // You can add error reporting here (e.g., Sentry)
    // if (window && window.Sentry) window.Sentry.captureException(error);

    // Only throw network/server error if fetch itself fails
    const message = error?.message || "Network or server error";
    throw new ApiError(message, 0, { message });
  }
}
