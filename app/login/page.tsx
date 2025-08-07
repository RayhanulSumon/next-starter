"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";

export default function LoginPage() {
  // Use enhanced auth context with loginLoading state
  const { login, user, loginLoading, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Redirect when authenticated
  useEffect(() => {
    if (user && !authLoading) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);

    try {
      // Use the login method from enhanced auth context
      await login(identifier, password);
      // No need to redirect here, the useEffect will handle it
    } catch (err: unknown) {
      // Improved error handling
      if (err && typeof err === 'object' && 'data' in err && err.data) {
        // Handle structured API errors
        setError(err.data.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message || "Login failed");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Login to Your Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="identifier" className="block text-sm font-medium">
            Email or Phone
          </label>
          <input
            id="identifier"
            type="text"
            placeholder="Enter your email or phone"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            autoComplete="username"
            disabled={loginLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            autoComplete="current-password"
            disabled={loginLoading}
          />
        </div>

        {error && (
          <div
            className="p-3 bg-red-50 border border-red-200 text-red-700 rounded"
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:opacity-50 disabled:bg-blue-400"
          disabled={loginLoading}
          aria-busy={loginLoading}
        >
          {loginLoading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}