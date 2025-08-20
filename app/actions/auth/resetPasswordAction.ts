"use server";
import { apiFetch, ApiClientResponse } from "@/lib/apiClient";
import type {
  PasswordResetRequest,
  PasswordResetData,
  PasswordResetResponse,
} from "@/types/auth";
import { z } from "zod";

const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});
const passwordResetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function requestPasswordReset(
  data: PasswordResetRequest,
): Promise<ApiClientResponse<PasswordResetResponse | undefined>> {
  const result = await apiFetch<PasswordResetResponse>(
    "/request-password-reset",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return result;
}

export async function resetPasswordAction(
  data: PasswordResetData,
): Promise<ApiClientResponse<PasswordResetResponse | undefined>> {
  const result = await apiFetch<PasswordResetResponse>(
    "/reset-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return result;
}