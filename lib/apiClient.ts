// lib/apiClient.ts

export type ApiClientResponse<T = unknown> = {
  message: string;
  data: T | null;
  errors: Record<string, string[]> | string[];
  status: number;
};

// Custom ApiError class for consistent error handling
export class ApiError extends Error {
  status: number;
  data: unknown;
  cause?: unknown;

  constructor(message: string, status: number, data: unknown = {}, cause?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.cause = cause;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Global API fetch utility for both client and server components.
 * Handles Laravel-style responses and network/server errors.
 *
 * On the server, uses apiRequest (attaches Bearer token from httpOnly cookie automatically).
 * On the client, uses fetch with credentials: 'include' (cookie-based auth, cannot attach Bearer token from httpOnly cookie).
 * Throws ApiError for all error cases.
 *
 * @param input - API endpoint (relative, e.g. '/user')
 * @param options - RequestInit (fetch options)
 * @param method - HTTP method (default: 'GET')
 */
export async function apiFetch<T = unknown>(
  input: string,
  options?: RequestInit,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
): Promise<ApiClientResponse<T>> {
  try {
    let url = input;
    // If running on the server and input is a relative path, prepend base URL
    if (typeof window === 'undefined' && input.startsWith('/')) {
      const base = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '';
      if (!base) {
        throw new ApiError(
          'API base URL is not set. Please set NEXT_PUBLIC_API_URL or API_URL in your environment.',
          0,
          {}
        );
      }
      url = base.replace(/\/$/, '') + input;
    }
    // Debug: log the final URL being fetched
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[apiFetch] Fetching URL:', url);
    }
    // Remove body from options if method is GET or HEAD
    const methodUpper = (method || 'GET').toUpperCase();
    let safeOptions = { ...options };
    if ((methodUpper === 'GET' || methodUpper === 'HEAD') && 'body' in safeOptions) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[apiFetch] Removing body from options for GET/HEAD request:', url);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { body, ...rest } = safeOptions;
      safeOptions = rest;
    }
    // Remove method from safeOptions to ensure the explicit method argument is always used
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { method: _method, ...finalOptions } = safeOptions;
    // Debug: log the final fetch options
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[apiFetch] Final fetch options:', { ...finalOptions, method: methodUpper });
    }
    // Use fetch for both server and client
    const res = await fetch(url, {
      ...finalOptions,
      method: methodUpper,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(finalOptions?.headers || {}),
      },
    });
    let data: ApiClientResponse<T>;
    try {
      data = await res.json();
    } catch {
      throw new ApiError('Server not found. Please try again later.', 0, {});
    }
    if (!res.ok) {
      // Normalize errors to Record<string, string[]> | undefined for ApiError
      // Defensive: check if 'errors' exists before accessing
      const errorData = { ...data };
      let normalizedErrors: Record<string, string[]> | undefined;
      // Use unknown instead of any for type safety
      const errorsRaw = (data as unknown as { errors?: unknown }).errors;
      if (Array.isArray(errorsRaw)) {
        normalizedErrors = errorsRaw.length > 0 ? { general: errorsRaw } : undefined;
      } else if (typeof errorsRaw === 'object' && errorsRaw !== null) {
        normalizedErrors = errorsRaw as Record<string, string[]>;
      } else {
        normalizedErrors = undefined;
      }
      // Only pass allowed ApiErrorData shape (message, errors, and any other allowed fields)
      const { message, status, data: respData, ...rest } = errorData;
      const apiErrorData = { message, status, data: respData, ...rest };
      if (normalizedErrors !== undefined) {
        apiErrorData.errors = normalizedErrors;
      }
      throw new ApiError(data.message || 'Unknown error', data.status || res.status, apiErrorData);
    }
    return data;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Server not found. Please try again later.', 0, {}, err);
  }
}

export async function apiPost<T>(url: string, data: unknown): Promise<ApiClientResponse<T>> {
  return apiFetch<T>(
    url,
    {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    'POST',
  );
}