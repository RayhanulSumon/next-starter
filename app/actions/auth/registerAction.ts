"use server";
import { revalidatePath } from "next/cache";
import { cookieStore } from "../shared";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";
import type { RegisterData, User } from "@/types/auth-types";

export async function registerAction(data: RegisterData): Promise<ApiClientResponse<{ user: User; token: string }> | { error: { message: string; errors?: any; status?: number } }> {
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
  } catch (error: any) {
    // Extract error info for serialization
    let message = "Registration failed.";
    let errors = undefined;
    let status = undefined;
    if (error && typeof error === 'object') {
      message = error.message || message;
      if ('data' in error && error.data && typeof error.data === 'object') {
        errors = error.data.errors;
        status = error.data.status;
      }
      if ('status' in error && typeof error.status === 'number') {
        status = error.status;
      }
    }
    return { error: { message, errors, status } };
  }
}