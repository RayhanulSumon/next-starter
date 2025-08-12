"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";
import { ApiError } from "@/app/actions/shared";

// Import shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

// Define an interface for API error responses
interface ApiError {
  data: {
    message?: string;
    [key: string]: unknown;
  };
}

// Type guard to check if an error is an API error
function isApiError(err: unknown): err is ApiError {
  return Boolean(
    err &&
    typeof err === 'object' &&
    'data' in err &&
    err.data &&
    typeof err.data === 'object'
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
    password: false
  });

  // Derived validation states
  const identifierError = touched.identifier && !identifier ? "Email or phone is required" : null;
  const passwordError = touched.password && !password ? "Password is required" : null;
  const isFormValid = identifier && password;

  // Redirect when authenticated
  useEffect(() => {
    if (user && !authLoading) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  // Handle field blur for validation
  const handleBlur = (field: 'identifier' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
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
      if (err instanceof ApiError) {
        setError(err.getUserMessage("Login failed"));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Phone</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your email or phone"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                onBlur={() => handleBlur('identifier')}
                aria-invalid={!!identifierError}
                disabled={loginLoading}
                aria-describedby={identifierError ? "identifier-error" : undefined}
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
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/reset-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                disabled={loginLoading}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
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
              <Alert variant="destructive">
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loginLoading || !isFormValid}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}