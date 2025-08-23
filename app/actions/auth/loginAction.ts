"use server";
import { revalidatePath } from "next/cache";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";
import type { LoginActionResult, LoginResponse } from "@/types/auth";
import { cookieStore } from "../shared";

export async function loginAction(
  identifier: string,
  password: string,
): Promise<ApiClientResponse<LoginActionResult>> {
  // Side effect: set cookie if login is successful
  // Type guard for 2FA required
  const isTwoFARequired = (data: unknown): data is { twofa_required: true } =>
    typeof data === "object" &&
    data !== null &&
    Object.prototype.hasOwnProperty.call(data, "twofa_required") &&
    (data as { twofa_required: unknown }).twofa_required === true;

  // Type guard for login response
  const isLoginResponse = (data: unknown): data is LoginResponse =>
    typeof data === "object" &&
    data !== null &&
    Object.prototype.hasOwnProperty.call(data, "token") &&
    Object.prototype.hasOwnProperty.call(data, "user");

  try {
    const result = await apiFetch<LoginResponse | { twofa_required?: boolean }>(
      "/login",
      { method: "POST", data: { identifier, password } }
    );
    // Log the raw result for debugging validation errors
    console.log('loginAction result:', JSON.stringify(result, null, 2));

    if (isTwoFARequired(result.data)) {
      return {
        ...result,
        data: { twofa_required: true },
      };
    }
    if (isLoginResponse(result.data)) {
      const responseData = result.data;
      // Set cookie as httpOnly: false and sameSite: 'lax' for local development
      await cookieStore.set("token", responseData.token, {
        httpOnly: false,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      revalidatePath("/user/dashboard");
      return {
        ...result,
        data: { user: responseData.user, token: responseData.token },
      };
    }
    // If not 2FA or login, return error object
    return {
      message: result.message || 'Login failed.',
      data: null,
      errors: result.errors || [],
      status: result.status || 500,
    };
  } catch (err: unknown) {
    // Always return a structured error object
    if (err && typeof err === 'object' && 'status' in (err as Record<string, unknown>)) {
      const errorObj = err as { message?: string; data?: { errors?: unknown }; status?: number };
      let errors: string[] | Record<string, string[]> = [];
      const rawErrors = errorObj.data?.errors;
      if (Array.isArray(rawErrors)) {
        errors = rawErrors.map(e => String(e));
      } else if (rawErrors && typeof rawErrors === 'object') {
        // Check if it's a Record<string, string[]>
        const isRecord = Object.values(rawErrors).every(
          v => Array.isArray(v) && v.every(i => typeof i === 'string')
        );
        if (isRecord) {
          errors = rawErrors as Record<string, string[]>;
        }
      }
      return {
        message: errorObj.message || 'Login failed.',
        data: null,
        errors,
        status: errorObj.status || 500,
      };
    }
    return {
      message: 'An unexpected error occurred.',
      data: null,
      errors: [],
      status: 500,
    };
  }
}