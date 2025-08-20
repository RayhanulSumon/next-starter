// Shared types, constants, and error class for auth actions
import { z } from "zod";

// Only import 'cookies' if running in a server environment
import { cookies as serverCookies } from "next/headers";
const cookies = typeof window === "undefined" ? serverCookies : undefined;

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

// Remove apiRequest, apiResponseSchema, and related code

// Add cookieStore utilities
export const cookieStore = {
  async set(
    name: string,
    value: string,
    options?: CookieOptions,
  ): Promise<void> {
    if (!cookies) {
      throw new Error(
        "Cookies can only be modified in a Server Action or Route Handler. See: https://nextjs.org/docs/app/api-reference/functions/cookies#options",
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