"use server";
import { cookieStore } from "../shared";

export async function googleCallbackAction(token: string | null) {
  console.log("[GoogleCallbackAction] Called with token:", token);

  if (!token) {
    console.error("[GoogleCallbackAction] No token provided");
    return { success: false, redirect: "/login?error=google_auth_failed" };
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
    return { success: true, redirect: "/user/dashboard" };
  } catch (e) {
    console.error("[GoogleCallbackAction] Failed to set cookie:", e);
    return { success: false, redirect: "/login?error=invalid_token" };
  }
}