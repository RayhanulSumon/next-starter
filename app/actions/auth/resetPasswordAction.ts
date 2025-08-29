"use server";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";
import type {
  PasswordResetRequest,
  PasswordResetData,
  PasswordResetResponse,
} from "@/types/auth-types";

export async function requestPasswordReset(
  data: PasswordResetRequest,
): Promise<ApiClientResponse<PasswordResetResponse | undefined>> {
  return apiFetch<PasswordResetResponse>(
    "/request-password-reset",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
}

export async function resetPasswordAction(
  data: PasswordResetData,
): Promise<ApiClientResponse<PasswordResetResponse | undefined>> {
  return apiFetch<PasswordResetResponse>(
    "/reset-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
}