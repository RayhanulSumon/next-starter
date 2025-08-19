"use server";
import type { User } from "@/types/auth";
import { cookieStore, apiRequest } from "../shared";

export async function getCurrentUser(): Promise<User | null> {
  // Only check for token in cookies (server-side)
  const token = await cookieStore.get("token");
  if (!token) {
    return null;
  }
  try {
    const data = await apiRequest<any>("/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    // Debug: Log the backend response
    console.log("getCurrentUser: backend response:", data);
    // Handle both direct user object and { message, data } format
    if (data && typeof data === "object") {
      if ("id" in data && "name" in data && "role" in data) {
        return data as User;
      }
      if ("data" in data && data.data && typeof data.data === "object" && "id" in data.data) {
        return data.data as User;
      }
    }
    return null;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    await cookieStore.delete("token");
    return null;
  }
}