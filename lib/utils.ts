import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Retrieve Sanctum token from cookies (works on both client and server)
export async function getToken(tokenName: string = 'token'): Promise<string | null> {
  // Server-side (Next.js server components)
  if (typeof window === 'undefined') {
    try {
      const mod = await import('next/headers');
      const cookies = await mod.cookies();
      return cookies.get(tokenName)?.value || null;
    } catch {
      return null;
    }
  }
  // Client-side
  const match = document.cookie.match(new RegExp('(^| )' + tokenName + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Normalize API errors to string[] | Record<string, string[]>
export function normalizeApiErrors(errors: unknown): string[] | Record<string, string[]> {
  if (Array.isArray(errors)) {
    return errors.map(e => String(e));
  }
  if (errors && typeof errors === 'object') {
    const obj = errors as Record<string, unknown>;
    if (Object.values(obj).every(v => Array.isArray(v) && v.every(i => typeof i === 'string')))
      return errors as Record<string, string[]>;
  }
  return [];
}

// Extracts all validation error messages from an error object (Axios, ApiError, or plain)
export function extractValidationErrors(error: unknown): string[] {
  function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null;
  }
  let errors: unknown = null;
  if (isObject(error)) {
    // Top-level errors (from server action error: { message, errors, status })
    if ('errors' in error) {
      errors = (error as Record<string, unknown>).errors;
    }
    // ApiError or plain error with data.errors
    else if ('data' in error && isObject(error.data) && 'errors' in error.data) {
      errors = error.data.errors;
    }
    // Axios-style error
    else if ('response' in error && isObject(error.response) && 'data' in error.response && isObject(error.response.data) && 'errors' in error.response.data) {
      errors = error.response.data.errors;
    }
  }
  if (Array.isArray(errors)) {
    return errors.map(String);
  }
  if (isObject(errors)) {
    // Flatten all string[] values from the errors object
    return Object.values(errors).flatMap((v) => Array.isArray(v) ? v.map(String) : [String(v)]);
  }
  return [];
}