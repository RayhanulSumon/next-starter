"use server";
import { apiFetch, ApiError } from "@/lib/apiClient";

export type TwoFAResponse = {
  qr?: string;
  secret?: string;
  error?: string;
};

export async function enable2FAAction(): Promise<TwoFAResponse> {
  try {
    const res = await apiFetch("/auth/2fa/enable", { method: "POST" });
    if (!res.data || typeof res.data !== "object") {
      return { error: "No data returned from server." };
    }
    return res.data as TwoFAResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "Unknown error" };
  }
}

export async function verify2FAAction(formData: FormData): Promise<TwoFAResponse> {
  try {
    const code = formData.get("code") as string;
    const payload = { token: code };
    const res = await apiFetch("/auth/2fa/verify", { method: "POST", data: payload });
    if (!res.data || typeof res.data !== "object") {
      return { error: "No data returned from server." };
    }
    return res.data as TwoFAResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "Unknown error" };
  }
}

export async function disable2FAAction(): Promise<TwoFAResponse> {
  try {
    const res = await apiFetch("/2fa/disable", { method: "POST" });
    if (!res.data || typeof res.data !== "object") {
      return { error: "No data returned from server." };
    }
    return res.data as TwoFAResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "Unknown error" };
  }
}