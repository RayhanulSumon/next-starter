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
  if (
    typeof result.data === "object" &&
    result.data !== null &&
    Object.prototype.hasOwnProperty.call(result.data, "token") &&
    Object.prototype.hasOwnProperty.call(result.data, "user")
  ) {
    const responseData = result.data as LoginResponse;
    await cookieStore.set("token", responseData.token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    revalidatePath("/user/dashboard");
  }
  return result;
}