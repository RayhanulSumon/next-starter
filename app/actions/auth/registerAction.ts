"use server";
import { revalidatePath } from "next/cache";
import { cookieStore } from "../shared";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";
import type { RegisterData, User } from "@/types/auth-types";
import { extractValidationErrors } from "@/lib/apiErrorHelpers";

export async function registerAction(data: RegisterData): Promise<ApiClientResponse<{ user: User; token: string }> | { error: { message: string; errors?: string[]; status?: number } }> {
  try {
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
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
      });
      revalidatePath("/user/dashboard");
    }
    return result;
  } catch (error: unknown) {
    const errors = extractValidationErrors(error);
    let message = "Registration failed.";
    let status: number | undefined = undefined;
    if (error && typeof error === 'object') {
      message = (error as { message?: string }).message || message;
      if ('data' in error && error.data && typeof error.data === 'object') {
        const data = (error as { data?: { status?: number } }).data;
        if (data && typeof data.status === 'number') {
          status = data.status;
        }
      }
      if ('status' in error) {
        status = (error as { status?: number }).status;
      }
    }
    return { error: { message, errors, status } };
  }
}