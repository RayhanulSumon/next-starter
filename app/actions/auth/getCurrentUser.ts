"use server";
import { cookies } from "next/headers";
import type { User } from "@/types/auth";
import { ApiError, cookieStore, apiRequest } from "../shared";

export async function getCurrentUser(): Promise<User | null> {
  const token = await cookieStore.get("token");
  if (!token) {
    return null;
  }
  try {
    return await apiRequest<User>("/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    await cookieStore.delete("token");
    return null;
  }
}
