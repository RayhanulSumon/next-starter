"use server";
import { revalidatePath } from "next/cache";
import { cookieStore } from "../shared";
import { apiPost, ApiClientResponse } from "@/lib/apiClient";
import type { RegisterData, User } from "@/types/auth";

export async function registerAction(data: RegisterData): Promise<ApiClientResponse<{ user: User; token: string }>> {
  const result = await apiPost<{ token: string; user: User }>("/register", data);
  function isRegisterResponse(data: unknown): data is { token: string; user: User } {
    return (
      typeof data === "object" &&
      data !== null &&
      Object.prototype.hasOwnProperty.call(data, "token") &&
      Object.prototype.hasOwnProperty.call(data, "user")
    );
  }
  if (!isRegisterResponse(result.data)) {
    throw new Error("Unexpected register response from /register.");
  }
  await cookieStore.set("token", result.data.token, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  revalidatePath("/user/dashboard");
  return {
    message: result.message,
    data: { user: result.data.user, token: result.data.token },
    errors: result.errors,
    status: result.status,
  };
}