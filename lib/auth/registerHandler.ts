import { registerAction } from "@/app/actions/auth/registerAction";
import {
  extractValidationErrors,
  isApiErrorWithFieldErrors,
  extractUserFromApiResponse,
} from "@/lib/apiErrorHelpers";
import type { User, RegisterData } from "@/types/auth-types";

export async function registerHandler(
  data: RegisterData,
  setUser: (user: User) => void
): Promise<{ user: User; token?: string }> {
  const result = await registerAction(data);

  if ("error" in result && result.error) {
    // Always throw a normalized error object
    const allMessages = extractValidationErrors(result.error);
    const fieldErrors = isApiErrorWithFieldErrors(result.error)
      ? result.error.data.errors
      : undefined;
    throw { data: { errors: allMessages, fieldErrors } };
  }

  const user = extractUserFromApiResponse<{ user: User }>(result);
  if (user) {
    setUser(user); // Set user immediately for reliable state management

    // Extract token if available
    let token: string | undefined;
    if (
      result &&
      "data" in result &&
      result.data &&
      typeof result.data === "object" &&
      "token" in result.data &&
      typeof result.data.token === "string"
    ) {
      token = result.data.token;
    }

    return { user, token };
  }

  throw { data: { errors: ["Registration did not return a user."] } };
}