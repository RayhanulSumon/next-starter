"use server";
import { revalidatePath } from "next/cache";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";
import type { LoginActionResult, LoginResponse, User } from "@/types/auth";
import { cookieStore } from "../shared";
import { normalizeApiErrors } from "@/lib/utils";

type TwoFARequiredResponse = { "2fa_required": true; user: User };

export async function loginAction(
  identifier: string,
  password: string,
): Promise<ApiClientResponse<LoginActionResult>> {
  // Side effect: set cookie if login is successful
  // Type guard for 2FA required
  const isTwoFARequired = (data: unknown): data is TwoFARequiredResponse =>
    typeof data === "object" &&
    data !== null &&
    Object.prototype.hasOwnProperty.call(data, "2fa_required") &&
    (data as { [key: string]: unknown })["2fa_required"] === true &&
    Object.prototype.hasOwnProperty.call(data, "user");

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
      const twoFAData = result.data as TwoFARequiredResponse;
      return {
        ...result,
        data: { "2fa_required": true, user: twoFAData.user },
      };
    }
    if (isLoginResponse(result.data)) {
      const responseData = result.data;
      // Always set cross-site cookie for production (Vercel)
      await cookieStore.set("token", responseData.token, {
        httpOnly: false,
        path: "/",
        sameSite: "none",
        secure: true,
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
    if (err && typeof err === 'object' && 'status' in (err as Record<string, unknown>)) {
      const errorObj = err as { message?: string; data?: { errors?: unknown }; status?: number };
      return {
        message: errorObj.message || 'Login failed.',
        data: null,
        errors: normalizeApiErrors(errorObj.data?.errors),
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