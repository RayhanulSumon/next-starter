"use server";
import type { User } from "@/types/auth";
import { cookieStore } from "../shared";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";

export async function getCurrentUser(): Promise<ApiClientResponse<User | null>> {
  const token = await cookieStore.get("token");
  if (!token) {
    return {
      message: "Not authenticated",
      data: null,
      errors: [],
      status: 401,
    };
  }
  try {
    const result = await apiFetch<User>("/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (result.data && typeof result.data === "object" && "id" in result.data) {
      return {
        ...result,
        message: "User found",
        status: result.status,
      };
    }
    return {
      ...result,
      message: "User not found",
      data: null,
      status: 404,
    };
  } catch (error) {
    await cookieStore.delete("token");
    throw error;
  }
}