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

// Extracts validation errors from an error object (Axios or plain)
export function extractValidationErrors(error: unknown): Record<string, string[]> | null {
  function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null;
  }
  function isErrorRecord(val: unknown): val is Record<string, string[]> {
    return isObject(val) && Object.values(val).every(v => Array.isArray(v) && v.every(i => typeof i === 'string'));
  }
  if (isObject(error)) {
    // Axios-style error
    if (
      'response' in error &&
      isObject(error.response) &&
      'data' in error.response &&
      isObject(error.response.data) &&
      'errors' in error.response.data &&
      isErrorRecord(error.response.data.errors)
    ) {
      return error.response.data.errors;
    }
    // Plain error with data.errors
    if (
      'data' in error &&
      isObject(error.data) &&
      'errors' in error.data &&
      isErrorRecord(error.data.errors)
    ) {
      return error.data.errors;
    }
  }
  return null;
}