"use server";
import type { User } from "@/types/auth";
import { cookieStore } from "../shared";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";

export async function getCurrentUser(): Promise<ApiClientResponse<User | null>> {
  try {
    const response = await apiFetch<User>("/user");
    if (response.data) {
      return {
        message: "User found",
        data: response.data,
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