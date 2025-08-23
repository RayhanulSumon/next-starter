// lib/apiClient.ts
import { cookieStore } from "@/app/actions/shared";

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

// Helper: Build full API URL
function buildApiUrl(input: string): string {
  if (typeof window === 'undefined' && input.startsWith('/')) {
    const base = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '';
    if (!base) {
      throw new ApiError(
        'API base URL is not set. Please set NEXT_PUBLIC_API_URL or API_URL in your environment.',
        0,
        {}
      );
    }
    return base.replace(/\/$/, '') + input;
  }
  return input;
}

// Helper: Get and decode Bearer token
function getBearerToken(token?: string): string | undefined {
  let bearerToken = token;
  if (bearerToken) {
    try { bearerToken = decodeURIComponent(bearerToken); } catch {}
  } else if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    bearerToken = match ? decodeURIComponent(match[2]) : undefined;
  }
  return bearerToken;
}

// Helper: Build headers (with optional auth)
function buildHeaders(
  headers: Record<string, string> | undefined,
  token?: string
): Record<string, string> {
  const baseHeaders: Record<string, string> = { Accept: 'application/json' };
  if (headers) Object.assign(baseHeaders, headers);
  const bearerToken = getBearerToken(token);
  if (bearerToken) baseHeaders['Authorization'] = `Bearer ${bearerToken}`;
  return baseHeaders;
}

// Helper: Normalize API error
function normalizeApiError(data: unknown, status: number): ApiError {
  const errorData = (typeof data === 'object' && data !== null) ? data as Record<string, unknown> : {};
  let normalizedErrors: Record<string, string[]> | undefined;
  const errorsRaw = (errorData.errors !== undefined && errorData.errors !== null) ? errorData.errors : undefined;

  if (Array.isArray(errorsRaw)) {
    normalizedErrors = errorsRaw.length > 0 ? { general: errorsRaw } : undefined;
  } else if (errorsRaw && typeof errorsRaw === 'object') {
    normalizedErrors = errorsRaw as Record<string, string[]>;
  }

  const message = typeof errorData.message === 'string' ? errorData.message : 'Unknown error';
  const respStatus = typeof errorData.status === 'number' ? errorData.status : status;
  const respData = errorData.data;
  // Remove unused destructuring to fix ESLint warning
  const apiErrorData: Record<string, unknown> = { message, status: respStatus, data: respData };
  // Add all other properties except message, status, data
  Object.keys(errorData).forEach((key) => {
    if (key !== 'message' && key !== 'status' && key !== 'data') {
      apiErrorData[key] = errorData[key];
    }
  });
  if (normalizedErrors !== undefined) {
    apiErrorData.errors = normalizedErrors;
  }
  return new ApiError(message, respStatus, apiErrorData);
}

export async function apiFetch<T = unknown>(
  input: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: unknown;
    token?: string;
    headers?: Record<string, string>;
    [key: string]: unknown;
  } = {}
): Promise<ApiClientResponse<T>> {
  try {
    const url = buildApiUrl(input);
    const method = (options.method || 'GET').toUpperCase();
    // --- Universal token logic ---
    let token = options.token;
    if (!token && typeof window === 'undefined') {
      // On server, try to get from cookieStore
      try {
        const mod = await import("@/app/actions/shared");
        token = await mod.cookieStore.get("token");
      } catch {}
    }
    const fetchOptions = { ...options } as RequestInit & { data?: unknown; token?: string };
    delete fetchOptions.data;
    delete fetchOptions.token;
    if (options.data && method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(options.data);
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };
    } else {
      delete fetchOptions.body;
    }
    fetchOptions.headers = buildHeaders(fetchOptions.headers as Record<string, string> | undefined, token);
    if (!getBearerToken(token)) fetchOptions.credentials = 'include';
    fetchOptions.method = method;
    const res = await fetch(url, fetchOptions);
    let data: ApiClientResponse<T>;
    try { data = await res.json(); } catch { throw new ApiError('Server not found. Please try again later.', 0, {}); }
    if (!res.ok) {
      throw normalizeApiError(data, res.status);
    }
    return data;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Server not found. Please try again later.', 0, {}, err);
  }
}