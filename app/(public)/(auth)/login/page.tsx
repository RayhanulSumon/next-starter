"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hook/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { TwoFactorForm } from "./TwoFactorForm";

export default function LoginPage() {
  return <LoginPageContent />;
}

function LoginPageContent() {
  const { user, loginLoading } = useAuth();
  const router = useRouter();

  const [twoFARequired, setTwoFARequired] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{
    identifier: string;
    password: string;
  } | null>(null);

  // Redirect when authenticated
  useEffect(() => {
    if (user && user.id && !loginLoading) {
      router.replace("/user/dashboard");
    }
  }, [user, loginLoading, router]);

  function handleTwoFARequired(identifier: string, password: string) {
    setTwoFARequired(true);
    setPendingLogin({ identifier, password });
  }

  function handleTwoFASuccess() {
    router.push("/user/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto w-full max-w-md">
        <Card className="w-full rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-foreground mb-2 text-3xl font-extrabold md:text-4xl">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base md:text-lg">
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
          <CardFooter className="mt-4 flex w-full justify-center">
            <p className="text-muted-foreground text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="primary-link font-medium hover:underline">
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}