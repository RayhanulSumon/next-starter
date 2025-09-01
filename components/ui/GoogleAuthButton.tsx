import * as React from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GoogleAuthButtonProps extends React.ComponentProps<typeof Button> {
  redirectUrl?: string;
  onAuthStart?: () => void;
  onAuthError?: (error: string) => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  className = "",
  redirectUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/api/auth/google/redirect`,
  children = "Continue with Google",
  disabled,
  onAuthStart,
  onAuthError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (isLoading || disabled) return;

    try {
      setIsLoading(true);
      onAuthStart?.();

      // Validate redirect URL
      new URL(redirectUrl); // This will throw if URL is invalid

      // Clear any existing error parameters from URL
      if (typeof window !== "undefined") {
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.has("error")) {
          currentUrl.searchParams.delete("error");
          window.history.replaceState({}, "", currentUrl.toString());
        }

        // Add a small delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Redirect to Laravel Google OAuth
        window.location.href = redirectUrl;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initiate Google authentication";
      console.error("[GoogleAuthButton] Error:", errorMessage);
      onAuthError?.(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={`flex w-full items-center justify-center gap-2 border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 ${className}`}
      onClick={handleGoogleAuth}
      disabled={disabled || isLoading}
      aria-label="Sign in with Google"
      {...props}
    >
      {isLoading ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <svg
            className="h-5 w-5"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g clipPath="url(#clip0_17_40)">
              <path
                d="M47.5 24.5C47.5 22.8333 47.3333 21.3333 47.0833 19.8333H24V28.6667H37.3333C36.8333 31.3333 35.1667 33.6667 32.8333 35.1667V40.1667H40.1667C44.1667 36.5 47.5 31.1667 47.5 24.5Z"
                fill="#4285F4"
              />
              <path
                d="M24 48C30.5 48 35.8333 45.8333 40.1667 40.1667L32.8333 35.1667C30.8333 36.5 28.5 37.3333 24 37.3333C18.8333 37.3333 14.3333 33.8333 12.8333 29.1667H5.33331V34.3333C9.66665 42.1667 16.3333 48 24 48Z"
                fill="#34A853"
              />
              <path
                d="M12.8333 29.1667C12.1667 27.5 11.8333 25.6667 11.8333 24C11.8333 22.3333 12.1667 20.5 12.8333 18.8333V13.6667H5.33331C3.83331 16.5 3 19.6667 3 24C3 28.3333 3.83331 31.5 5.33331 34.3333L12.8333 29.1667Z"
                fill="#FBBC05"
              />
              <path
                d="M24 10.6667C28.1667 10.6667 31.1667 12.3333 32.8333 13.8333L40.3333 7.33333C35.8333 3.16667 30.5 0 24 0C16.3333 0 9.66665 5.83333 5.33331 13.6667L12.8333 18.8333C14.3333 14.1667 18.8333 10.6667 24 10.6667Z"
                fill="#EA4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
          {children}
        </>
      )}
    </Button>
  );
};

export default GoogleAuthButton;