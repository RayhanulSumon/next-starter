"use server";
import { apiRequest, cookieStore } from "../shared";
import type { User } from "@/types/auth";

export async function disableTwoFactorAction(): Promise<User> {
  const token = await cookieStore.get("token");
  if (!token) throw new Error("Not authenticated");
  const response = await apiRequest<{ message: string; data: User }>("/user/2fa/disable", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
"use server";
import { apiRequest, cookieStore } from "../shared";
import type { User } from "@/types/auth";

export async function enableTwoFactorAction(): Promise<User> {
  const token = await cookieStore.get("token");
  if (!token) throw new Error("Not authenticated");
  const response = await apiRequest<{ message: string; data: User }>("/user/2fa/enable", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}