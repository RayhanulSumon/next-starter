"use server";
import { cookieStore } from "../shared";

export interface GoogleCallbackResult {
  success: boolean;
  redirect: string;
  error?: string;
}

export async function googleCallbackAction(token: string | null): Promise<GoogleCallbackResult> {
  console.log("[GoogleCallbackAction] Called with token:", !!token);

  // Input validation
  if (!token) {
    console.error("[GoogleCallbackAction] No token provided");
    return {
      success: false,
      redirect: "/login?error=google_auth_failed",
      error: "Invalid authentication token",
    };
  }

  // Basic token format validation (adjust based on your Laravel backend token format)
  if (token.length < 10 || token.length > 2048) {
    console.error("[GoogleCallbackAction] Token length invalid");
    return {
      success: false,
      redirect: "/login?error=invalid_token",
      error: "Token format invalid",
    };
  }

  try {
    await cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    console.log("[GoogleCallbackAction] Token cookie set successfully");
    return {
      success: true,
      redirect: "/user/dashboard",
    };
  } catch (e) {
    console.error("[GoogleCallbackAction] Failed to set cookie:", e);
    return {
      success: false,
      redirect: "/login?error=cookie_failed",
      error: e instanceof Error ? e.message : "Failed to store authentication",
    };
  }
}