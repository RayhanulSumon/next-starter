import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Retrieve Sanctum token from cookies (works on both client and server)
export async function getToken(tokenName: string = 'token'): Promise<string | null> {
  // Server-side (Next.js server components)
  if (typeof window === 'undefined') {
    try {
      const mod = await import('next/headers');
      const cookies = await mod.cookies();
      return cookies.get(tokenName)?.value || null;
    } catch {
      return null;
    }
  }
  // Client-side
  const match = document.cookie.match(new RegExp('(^| )' + tokenName + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}