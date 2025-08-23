"use server";
import type { User } from "@/types/auth";
import { cookieStore } from "../shared";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";

export async function getCurrentUser(): Promise<ApiClientResponse<User | null>> {
  let token = await cookieStore.get("token");
  if (!token || token.trim() === "") {
    return {
      message: "Not authenticated",
      data: null,
      errors: [],
      status: 401,
    };
  }
  try {
    token = decodeURIComponent(token);
  } catch {}
  try {
    // For /user endpoint, the user object is at the top level of the response
    const result = await apiFetch<User>("/user", undefined, "GET", token);
    // Type guard: ensure result is a User
    if (result && typeof result === "object" && "id" in result) {
      return {
        message: "User found",
        data: result as User,
        errors: [],
        status: 200,
      };
    }
    return {
      message: "User not found",
      data: null,
      errors: [],
      status: 404,
    };
  } catch (error) {
    await cookieStore.delete("token");
    throw error;
  }
}