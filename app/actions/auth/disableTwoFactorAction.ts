"use server";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";
import { cookieStore } from "../shared";
import type { User } from "@/types/auth";

export async function disableTwoFactorAction(): Promise<ApiClientResponse<User>> {
  const token = await cookieStore.get("token");
  if (!token) throw new Error("Not authenticated");
  const response = await apiFetch<User>(
    "/user/2fa/disable",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response;
}

export async function enableTwoFactorAction(): Promise<ApiClientResponse<User>> {
  const token = await cookieStore.get("token");
  if (!token) throw new Error("Not authenticated");
  const response = await apiFetch<User>(
    "/user/2fa/enable",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response;
}