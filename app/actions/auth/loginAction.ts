"use server";
import { revalidatePath } from "next/cache";
import { apiPost, ApiClientResponse } from "@/lib/apiClient";
import type { LoginActionResult, LoginResponse } from "@/types/auth";
import { cookieStore } from "../shared";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(
  identifier: string,
  password: string,
): Promise<ApiClientResponse<LoginActionResult>> {
  const result = await apiPost<LoginResponse | { twofa_required?: boolean }>(
    "/login",
    { identifier, password }
  );
  const responseData = result.data;
  function isTwoFAResponse(data: unknown): data is { twofa_required: true } {
    return (
      typeof data === "object" &&
      data !== null &&
      Object.prototype.hasOwnProperty.call(data, "twofa_required") &&
      Boolean((data as { twofa_required?: boolean }).twofa_required)
    );
  }
  function isLoginResponse(data: unknown): data is LoginResponse {
    return (
      typeof data === "object" &&
      data !== null &&
      Object.prototype.hasOwnProperty.call(data, "token") &&
      Object.prototype.hasOwnProperty.call(data, "user")
    );
  }
  if (isTwoFAResponse(responseData)) {
    return { twofa_required: true } as LoginActionResult;
  }
  if (isLoginResponse(responseData)) {
    await cookieStore.set("token", responseData.token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    revalidatePath("/user/dashboard");
    return { user: responseData.user, token: responseData.token };
  }
  throw new Error("Unexpected login response from /login.");
}