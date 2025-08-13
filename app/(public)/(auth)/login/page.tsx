"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";

// Import shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

// Define an interface for API error responses
interface LoginApiError {
  data: {
    message?: string;
    [key: string]: unknown;
  };
}

// Type guard to check if an error is an API error
function isApiError(err: unknown): err is LoginApiError {
  return Boolean(
    err &&
      typeof err === "object" &&
      "data" in err &&
      err.data &&
      typeof err.data === "object"
  );
}

export default function LoginPage() {
  // Use enhanced auth context with loginLoading state
  const { login, user, loginLoading, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form state with validation
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    identifier: false,
    password: false,
  });

  // Derived validation states
  const identifierError =
    touched.identifier && !identifier ? "Email or phone is required" : null;
  const passwordError =
    touched.password && !password ? "Password is required" : null;
  const isFormValid = identifier && password;

  // Redirect when authenticated
  useEffect(() => {
    if (user && !authLoading) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  // Handle field blur for validation
  const handleBlur = (field: "identifier" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!identifier || !password) {
      setTouched({ identifier: true, password: true });
      return;
    }
    try {
      await login(identifier, password);
      router.push("/dashboard");
    } catch (err: any) {
      if (isApiError(err)) {
        setError(err.data?.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full p-8 bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 rounded-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-gray-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="font-medium">
                  Email or Phone
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onBlur={() => handleBlur("identifier")}
                  aria-invalid={!!identifierError}
                  disabled={loginLoading}
                  aria-describedby={
                    identifierError ? "identifier-error" : undefined
                  }
                  autoComplete="username"
                  className={identifierError ? "border-destructive" : ""}
                />
                {identifierError && (
                  <p id="identifier-error" className="text-destructive text-sm">
                    {identifierError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium">
                    Password
                  </Label>
                  <Link
                    href="/reset-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  disabled={loginLoading}
                  aria-invalid={!!passwordError}
                  aria-describedby={
                    passwordError ? "password-error" : undefined
                  }
                  autoComplete="current-password"
                  className={passwordError ? "border-destructive" : ""}
                />
                {passwordError && (
                  <p id="password-error" className="text-destructive text-sm">
                    {passwordError}
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="w-full my-2">
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform duration-200"
                disabled={loginLoading || !isFormValid}
              >
                {loginLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-4 w-full">
            <p className="text-sm text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
