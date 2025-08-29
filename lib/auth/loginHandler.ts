import { loginAction } from "@/app/actions/auth/loginAction";
import { isTwoFARequired, isUserToken } from "@/lib/authGuards";
import type { User, LoginActionResult } from "@/types/auth-types";

export async function loginHandler(
  identifier: string,
  password: string,
  setUser: (user: User) => void
): Promise<LoginActionResult> {
  const result = await loginAction(identifier, password);
  const data = result.data;
  if (result.status !== 200) {
    throw new Error(result.message || "Login failed");
  }
  if (isTwoFARequired(data)) {
    return { "2fa_required": true, user: data.user };
  }
  if (isUserToken(data)) {
    setUser(data.user); // Set user immediately for reliable redirect
    return { user: data.user, token: data.token };
  }
  throw new Error("Unexpected login response");
}
