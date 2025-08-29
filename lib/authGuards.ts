import type { User } from "@/types/auth-types";

export function isTwoFARequired(data: unknown): data is { "2fa_required": true; user: User } {
  return (
    typeof data === "object" &&
    data !== null &&
    "2fa_required" in data &&
    (data as { [key: string]: unknown })["2fa_required"] === true &&
    "user" in data
  );
}

export function isUserToken(data: unknown): data is { user: User; token: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "user" in data &&
    "token" in data &&
    (data as { user?: User }).user !== undefined &&
    (data as { token?: string }).token !== undefined
  );
}
