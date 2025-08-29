"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/useAuth";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset, resetPassword, requestResetLoading, resetLoading } = useAuth();

  // State for the initial request step
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // State for the reset step
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const passwordRequirements = [
    { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
    {
      label: "At least one uppercase letter",
      test: (v: string) => /[A-Z]/.test(v),
    },
    {
      label: "At least one lowercase letter",
      test: (v: string) => /[a-z]/.test(v),
    },
    { label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
    {
      label: "At least one symbol",
      test: (v: string) => /[^A-Za-z0-9]/.test(v),
    },
  ];

  // Handle the initial password reset request
  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequestError(null);

    try {
      // At least one of email or phone must be provided
      if (!email && !phone) {
        setRequestError("Please provide either an email or phone number");
        return;
      }

      const response = await requestPasswordReset({
        email: email || undefined,
        phone: phone || undefined,
      });

      setRequestSent(true);
      // If there's a code in the response, pre-fill it
      if (response.code) {
        setToken(response.code);
      }
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message);
      } else {
        setRequestError("Failed to request password reset");
      }
    }
  };

  // Track password for live feedback
  const [passwordValue, setPasswordValue] = useState("");

  // Handle the actual password reset
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetError(null);

    // Validate passwords match
    if (password !== passwordConfirmation) {
      setResetError("Passwords do not match");
      return;
    }
    // Validate strong password
    for (const req of passwordRequirements) {
      if (!req.test(password)) {
        setResetError("Password does not meet all requirements.");
        return;
      }
    }

    try {
      await resetPassword({
        email: email || undefined,
        phone: phone || undefined,
        token: token || undefined,
        password,
        password_confirmation: passwordConfirmation,
      });

      setResetSuccess(true);

      // Redirect to loginAction after a delay
      setTimeout(() => {
        router.replace("/login");
      }, 3000);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response === "object" &&
        (error as { response?: { status?: number } }).response?.status === 429
      ) {
        setResetError("Too many attempts, please try again later.");
        return;
      }
      if (error instanceof Error) {
        setResetError(error.message);
      } else {
        setResetError("Failed to reset password");
      }
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded border p-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">Reset Your Password</h1>

      {!requestSent ? (
        // Step 1: Request password reset
        <form onSubmit={handleRequestReset} className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter your email or phone number to receive a password reset code.
          </p>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={requestResetLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={requestResetLoading}
            />
          </div>

          {requestError && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700" role="alert">
              {requestError}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded bg-blue-600 p-2 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            disabled={requestResetLoading}
          >
            {requestResetLoading ? "Sending..." : "Send Reset Instructions"}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </form>
      ) : resetSuccess ? (
        // Success message
        <div className="py-8 text-center">
          <div className="mb-4 text-xl text-green-600">Password reset successful!</div>
          <p className="text-gray-600">
            Your password has been reset. You&apos;ll be redirected to the loginAction page shortly.
          </p>
          <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
            Login now
          </Link>
        </div>
      ) : (
        // Step 2: Enter new password with token
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="mb-4 text-sm text-gray-600">
            Enter the reset code you received and your new password.
          </p>

          <div className="space-y-2">
            <label htmlFor="token" className="block text-sm font-medium">
              Reset Code
            </label>
            <input
              id="token"
              type="text"
              placeholder="Enter reset code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={resetLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordValue(e.target.value);
              }}
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              autoComplete="new-password"
            />
            <div className="mt-1 space-y-1">
              {passwordRequirements.map((req) => (
                <div
                  key={req.label}
                  className={`flex items-center gap-1 text-xs ${req.test(passwordValue) ? "text-green-600" : "text-gray-400"}`}
                >
                  <span>{req.test(passwordValue) ? "✔" : "✗"}</span> {req.label}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="passwordConfirmation" className="block text-sm font-medium">
              Confirm New Password
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              autoComplete="new-password"
            />
          </div>

          {resetError && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700" role="alert">
              {resetError}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded bg-blue-600 p-2 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            disabled={resetLoading}
          >
            {resetLoading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => setRequestSent(false)}
            className="mt-2 w-full rounded bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={resetLoading}
          >
            Back to Request Form
          </button>
        </form>
      )}
    </div>
  );
}
