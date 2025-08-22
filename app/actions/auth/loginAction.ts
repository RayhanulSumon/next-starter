"use server";
import { revalidatePath } from "next/cache";
import { apiPost, ApiClientResponse } from "@/lib/apiClient";
import type { LoginActionResult, LoginResponse } from "@/types/auth";
import { cookieStore } from "../shared";

export async function loginAction(
  identifier: string,
  password: string,
): Promise<ApiClientResponse<LoginActionResult>> {
  const result = await apiPost<LoginResponse | { twofa_required?: boolean }>(
    "/login",
    { identifier, password }
  );
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

  if (isTwoFARequired(result.data)) {
    return {
      ...result,
      data: { twofa_required: true },
    };
  }
  if (isLoginResponse(result.data)) {
    const responseData = result.data;
    await cookieStore.set("token", responseData.token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    revalidatePath("/user/dashboard");
    return {
      ...result,
      data: { user: responseData.user, token: responseData.token },
    };
  }
  throw new Error("Unexpected login response from /login.");
}