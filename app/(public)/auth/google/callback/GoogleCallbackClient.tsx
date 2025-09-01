"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { googleCallbackAction } from "@/app/actions/auth/googleCallbackAction";
import { useAuthStore } from "@/store/auth-store";

interface GoogleCallbackClientProps {
  token?: string;
  error?: string;
}

// Error types for better error handling
type AuthError = {
  type: "oauth_error" | "token_missing" | "auth_failed" | "network_error" | "unknown";
  message: string;
  redirectPath: string;
};

const ERROR_CONFIGS: Record<string, AuthError> = {
  oauth_error: {
    type: "oauth_error",
    message: "Authentication was cancelled or failed. Please try again.",
    redirectPath: "/login?error=google_auth_failed",
  },
  token_missing: {
    type: "token_missing",
    message: "No authentication token received from Google.",
    redirectPath: "/login?error=no_token",
  },
  auth_failed: {
    type: "auth_failed",
    message: "Failed to complete authentication. Please try again.",
    redirectPath: "/login?error=auth_failed",
  },
  network_error: {
    type: "network_error",
    message: "Network error occurred. Please check your connection and try again.",
    redirectPath: "/login?error=network_error",
  },
  unknown: {
    type: "unknown",
    message: "An unexpected error occurred. Please try again.",
    redirectPath: "/login?error=callback_error",
  },
};

export default function GoogleCallbackClient({ token, error }: GoogleCallbackClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorConfig, setErrorConfig] = useState<AuthError | null>(null);
  const { fetchCurrentUser } = useAuthStore();
  const hasProcessed = useRef(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleError = useCallback(
    (errorType: keyof typeof ERROR_CONFIGS, customMessage?: string) => {
      const config = ERROR_CONFIGS[errorType];
      setStatus("error");
      setErrorConfig({
        ...config,
        message: customMessage || config.message,
      });

      redirectTimeoutRef.current = setTimeout(() => {
        router.push(config.redirectPath);
      }, 3000); // Increased timeout for better UX
    },
    [router]
  );

  const handleCallback = useCallback(async () => {
    // Prevent double execution
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    console.log("[GoogleCallbackClient] Processing callback with token:", !!token, "error:", error);

    // Handle OAuth errors
    if (error) {
      console.error("[GoogleCallbackClient] OAuth error:", error);
      handleError("oauth_error");
      return;
    }

    // Handle missing token
    if (!token) {
      console.error("[GoogleCallbackClient] No token provided");
      handleError("token_missing");
      return;
    }

    try {
      const result = await googleCallbackAction(token);
      console.log("[GoogleCallbackClient] Server action result:", result);

      if (result.success) {
        setStatus("success");

        try {
          // Fetch user data after successful authentication
          await fetchCurrentUser();

          // Use router.replace to avoid back button issues
          router.replace("/user/dashboard");
        } catch (userFetchError) {
          console.warn(
            "[GoogleCallbackClient] Failed to fetch user data, but auth was successful:",
            userFetchError
          );
          // Still redirect to dashboard even if user fetch fails
          router.replace("/user/dashboard");
        }
      } else {
        handleError("auth_failed");
      }
    } catch (err) {
      console.error("[GoogleCallbackClient] Error processing callback:", err);

      // Determine error type based on error characteristics
      if (err instanceof TypeError && err.message.includes("fetch")) {
        handleError("network_error");
      } else {
        handleError("unknown", err instanceof Error ? err.message : undefined);
      }
    }
  }, [token, error, router, fetchCurrentUser, handleError]);

  useEffect(() => {
    handleCallback();

    // Cleanup function
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [handleCallback]);

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
  );

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {status === "processing" && (
          <div className="space-y-4">
            <LoadingSpinner />
            <div>
              <h2 className="mb-2 text-xl font-semibold">Authenticating with Google</h2>
              <p className="text-muted-foreground">
                Please wait while we complete your authentication...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold text-green-600">
                Authentication Successful!
              </h2>
              <p className="text-muted-foreground">Redirecting to your dashboard...</p>
            </div>
          </div>
        )}

        {status === "error" && errorConfig && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold text-red-600">Authentication Failed</h2>
              <p className="mb-2 text-red-600">{errorConfig.message}</p>
              <p className="text-muted-foreground text-sm">Redirecting to login page...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}