// Google OAuth Error Handler Utility
export type GoogleOAuthError =
  | "access_denied"
  | "invalid_request"
  | "unauthorized_client"
  | "unsupported_response_type"
  | "invalid_scope"
  | "server_error"
  | "temporarily_unavailable";

export interface ErrorConfig {
  title: string;
  message: string;
  userMessage: string;
  redirectPath: string;
  shouldRetry: boolean;
}

export const GOOGLE_OAUTH_ERRORS: Record<GoogleOAuthError, ErrorConfig> = {
  access_denied: {
    title: "Access Denied",
    message: "User denied the authentication request",
    userMessage:
      "You cancelled the Google sign-in process. Please try again if you want to sign in.",
    redirectPath: "/login?error=access_denied",
    shouldRetry: true,
  },
  invalid_request: {
    title: "Invalid Request",
    message: "The request is missing a required parameter or is malformed",
    userMessage: "There was a problem with the authentication request. Please try again.",
    redirectPath: "/login?error=invalid_request",
    shouldRetry: true,
  },
  unauthorized_client: {
    title: "Unauthorized Client",
    message: "The client is not authorized to request an access token",
    userMessage: "Google authentication is not properly configured. Please contact support.",
    redirectPath: "/login?error=config_error",
    shouldRetry: false,
  },
  unsupported_response_type: {
    title: "Unsupported Response Type",
    message: "The authorization server does not support this response type",
    userMessage: "There was a technical issue with Google authentication. Please contact support.",
    redirectPath: "/login?error=technical_error",
    shouldRetry: false,
  },
  invalid_scope: {
    title: "Invalid Scope",
    message: "The requested scope is invalid or unknown",
    userMessage: "Google authentication configuration issue. Please contact support.",
    redirectPath: "/login?error=config_error",
    shouldRetry: false,
  },
  server_error: {
    title: "Server Error",
    message: "The authorization server encountered an unexpected condition",
    userMessage:
      "Google is experiencing technical difficulties. Please try again in a few minutes.",
    redirectPath: "/login?error=server_error",
    shouldRetry: true,
  },
  temporarily_unavailable: {
    title: "Service Unavailable",
    message: "The authorization server is temporarily overloaded or under maintenance",
    userMessage:
      "Google authentication is temporarily unavailable. Please try again in a few minutes.",
    redirectPath: "/login?error=service_unavailable",
    shouldRetry: true,
  },
};

export function getErrorConfig(error: string | null): ErrorConfig | null {
  if (!error) return null;

  const errorKey = error as GoogleOAuthError;
  return (
    GOOGLE_OAUTH_ERRORS[errorKey] || {
      title: "Unknown Error",
      message: `Unknown OAuth error: ${error}`,
      userMessage: "An unexpected error occurred during authentication. Please try again.",
      redirectPath: "/login?error=unknown",
      shouldRetry: true,
    }
  );
}