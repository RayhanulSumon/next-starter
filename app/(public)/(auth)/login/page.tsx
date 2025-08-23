"use client";

import { AuthProvider } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { axiosClient } from "@/hook/axiosClient";
import { LoginForm } from "./LoginForm";
import { TwoFactorForm } from "./TwoFactorForm";

export default function LoginPage() {
  return (
    <AuthProvider fetchUserOnMount={false}>
      <LoginPageContent />
    </AuthProvider>
  );
}

function LoginPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [twoFARequired, setTwoFARequired] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{
    identifier: string;
    password: string;
  } | null>(null);

  // Redirect when authenticated
  useEffect(() => {
    if (user && user.id && !authLoading) {
      router.replace("/user/dashboard");
    }
  }, [user, authLoading, router]);

  function handleTwoFARequired(identifier: string, password: string) {
    setTwoFARequired(true);
    setPendingLogin({ identifier, password });
  }

  function handleTwoFASuccess() {
    router.push("/user/dashboard");
  }

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
            {twoFARequired && pendingLogin ? (
              <TwoFactorForm
                identifier={pendingLogin.identifier}
                password={pendingLogin.password}
                onSuccess={handleTwoFASuccess}
              />
            ) : (
              <LoginForm onTwoFARequired={handleTwoFARequired} />
            )}
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