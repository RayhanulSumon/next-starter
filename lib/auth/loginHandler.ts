import { loginAction } from "@/app/actions/auth/loginAction";
import { isTwoFARequired, isUserToken } from "@/lib/authGuards";
import type { User, LoginActionResult } from "@/types/auth";

export async function loginHandler(
  identifier: string,
  password: string,
  setUser: (user: User) => void,
  startTransition: (cb: () => void) => void
): Promise<LoginActionResult> {
  const result = await loginAction(identifier, password);
  const data = result.data;
  if (result.status !== 200) {
    throw new Error(result.message || 'Login failed');
  }
  if (isTwoFARequired(data)) {
    return { twofa_required: true };
  }
  if (isUserToken(data)) {
    startTransition(() => {
      setUser(data.user);
    });
    return { user: data.user, token: data.token };
  }
  throw new Error('Unexpected login response');
}