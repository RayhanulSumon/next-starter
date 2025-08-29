import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export function isLoginErrorResponse(response: unknown): response is LoginErrorResponse {
  if (typeof response !== "object" || response === null) return false;
  const r = response as Record<string, unknown>;
  return typeof r.status === "number" && typeof r.message === "string";
}
