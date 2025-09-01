"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { googleCallbackAction } from "@/app/actions/auth/googleCallbackAction";
import { useAuthStore } from "@/store/auth-store";

interface GoogleCallbackClientProps {
  token?: string;
  error?: string;
}

export default function GoogleCallbackClient({ token, error }: GoogleCallbackClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      console.log("[GoogleCallbackClient] Processing callback with token:", token, "error:", error);

      if (error) {
        console.error("[GoogleCallbackClient] Error from OAuth provider:", error);
        setStatus("error");
        setErrorMessage("Authentication failed. Please try again.");
        setTimeout(() => {
          router.push("/login?error=google_auth_failed");
        }, 2000);
        return;
      }

      if (!token) {
        console.error("[GoogleCallbackClient] No token provided");
        setStatus("error");
        setErrorMessage("No authentication token received.");
        setTimeout(() => {
          router.push("/login?error=no_token");
        }, 2000);
        return;
      }

      try {
        const result = await googleCallbackAction(token);
        console.log("[GoogleCallbackClient] Server action result:", result);

        if (result.success) {
          setStatus("success");
          // Fetch user data after successful authentication
          await fetchCurrentUser();
          // Use router.replace to avoid back button issues
          router.replace("/user/dashboard");
        } else {
          setStatus("error");
          setErrorMessage("Failed to authenticate. Please try again.");
          setTimeout(() => {
            router.push(result.redirect || "/login?error=auth_failed");
          }, 2000);
        }
      } catch (err) {
        console.error("[GoogleCallbackClient] Error processing callback:", err);
        setStatus("error");
        setErrorMessage("An unexpected error occurred.");
        setTimeout(() => {
          router.push("/login?error=callback_error");
        }, 2000);
      }
    };

    handleCallback();
  }, [token, error, router, fetchCurrentUser]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        {status === "processing" && (
          <>
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-muted-foreground text-lg">Authenticating with Google...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="mb-4 text-2xl text-green-600">✓</div>
            <p className="text-muted-foreground text-lg">
              Authentication successful! Redirecting...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="mb-4 text-2xl text-red-600">✗</div>
            <p className="text-lg text-red-600">{errorMessage}</p>
            <p className="text-muted-foreground mt-2 text-sm">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}