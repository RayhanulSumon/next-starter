"use server";
import { revalidatePath } from "next/cache";
import { ApiError } from "../shared";
import type { LoginActionResult, LoginResponse } from "@/types/auth";
import { cookieStore, apiRequest } from "../shared";

export async function loginAction(
  identifier: string,
  password: string
): Promise<LoginActionResult> {
  try {
    const data = await apiRequest<{ message: string; data: LoginResponse | { twofa_required?: boolean } }>("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    // Adjusted for API response structure
    const responseData = data?.data;

    // Type guard for 2FA response (fixed for boolean return)
    function isTwoFAResponse(data: unknown): data is { twofa_required: true } {
      return (
        typeof data === "object" &&
        data !== null &&
        Object.prototype.hasOwnProperty.call(data, "twofa_required") &&
        Boolean((data as { twofa_required?: boolean }).twofa_required)
      );
    }

    // Type guard for LoginResponse
    function isLoginResponse(data: unknown): data is LoginResponse {
      return (
        typeof data === "object" &&
        data !== null &&
        Object.prototype.hasOwnProperty.call(data, "token") &&
        Object.prototype.hasOwnProperty.call(data, "user")
      );
    }

    if (isTwoFAResponse(responseData)) {
      return { twofa_required: true };
    }

    if (isLoginResponse(responseData)) {
      cookieStore.set("token", responseData.token, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      revalidatePath("/user/dashboard");
      return { user: responseData.user, token: responseData.token };
    }

    throw new Error("Unexpected login response");
  } catch (error) {
    // Log error for debugging
    console.error("loginAction error:", error);
    if (error instanceof ApiError) {
      console.error(
        "ApiError details:",
        error.status,
        error.data,
        error.message
      );
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Login failed",
      500,
      {}
    );
  }
}