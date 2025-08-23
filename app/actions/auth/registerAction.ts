"use server";
import { revalidatePath } from "next/cache";
import { cookieStore } from "../shared";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";
import type { RegisterData, User } from "@/types/auth";

export async function registerAction(data: RegisterData): Promise<ApiClientResponse<{ user: User; token: string }>> {
  const result = await apiFetch<{ token: string; user: User }>(
    "/register",
    { method: "POST", data }
  );
  if (
    typeof result.data === "object" &&
    result.data !== null &&
    Object.prototype.hasOwnProperty.call(result.data, "token") &&
    Object.prototype.hasOwnProperty.call(result.data, "user")
  ) {
    await cookieStore.set("token", result.data.token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    revalidatePath("/user/dashboard");
  }
  return result;
}