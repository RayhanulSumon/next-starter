import type { User } from "@/types/auth";

export function isTwoFARequired(data: unknown): data is { twofa_required: true } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'twofa_required' in data &&
    (data as { twofa_required?: boolean }).twofa_required
  );
}

export function isUserToken(data: unknown): data is { user: User; token: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'user' in data &&
    'token' in data &&
    (data as { user?: User }).user !== undefined &&
    (data as { token?: string }).token !== undefined
  );
}