"use server";
import { revalidatePath } from "next/cache";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";
import type { LoginActionResult, LoginResponse, User } from "@/types/auth-types";
import { cookieStore } from "../shared";
import { extractValidationErrors } from "@/lib/apiErrorHelpers";

type TwoFARequiredResponse = { "2fa_required": true; user: User };

export async function loginAction(
  identifier: string,
  password: string
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
    const result = await apiFetch<unknown>("/login", {
      method: "POST",
      data: { identifier, password },
    });
    if (isTwoFARequired(result.data)) {
      const twoFAData = result.data as TwoFARequiredResponse;
      return {
        ...result,
        data: { "2fa_required": true, user: twoFAData.user },
      };
    }
    if (isLoginResponse(result.data)) {
      const responseData = result.data;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const isLocalhost = apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1");
      await cookieStore.set("token", responseData.token, {
        httpOnly: true,
        path: "/",
        sameSite: isLocalhost ? "lax" : "strict",
        secure: process.env.NODE_ENV === "production",
      });
      revalidatePath("/user/dashboard");
      return {
        ...result,
        data: { user: responseData.user, token: responseData.token },
      };
    }
    // Instead of throwing, return a serializable error object
    return {
      message: "Unexpected login response.",
      data: null,
      errors: ["Unexpected login response."],
      status: 500,
    };
  } catch (error) {
    // Use extractValidationErrors to get error messages
    const errors = extractValidationErrors(error);
    return {
      message: errors.length > 0 ? errors.join(" ") : "Login failed. Please try again.",
      data: null,
      errors,
      status: 400,
    };
  }
}