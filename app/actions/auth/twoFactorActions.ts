"use server";
import { apiFetch, ApiError } from "@/lib/apiClient";

export type TwoFAResponse = {
  qr?: string;
  secret?: string;
  error?: string;
};

export async function enable2FAAction(): Promise<TwoFAResponse> {
  try {
    const res = await apiFetch("/2fa/enable", { method: "POST" });
    console.log("[enable2FA] Raw API response:", res);
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
    const res = await apiFetch("/2fa/verify", { method: "POST", data: { code } });
    console.log("[verify2FA] Raw API response:", res);
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
    console.log("[disable2FA] Raw API response:", res);
    return res.data as TwoFAResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "Unknown error" };
  }
}