"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomInputField } from "@/components/ui/CustomInputField";
import Link from "next/link";
import { loginSchema, LoginFormValues } from "./login-schema";
import { useEffect } from "react";
import GoogleAuthButton from "@/components/ui/GoogleAuthButton";
import { loginAction } from "@/app/actions/auth/loginAction";
import { extractValidationErrors } from "@/lib/apiErrorHelpers";

interface LoginFormProps {
  onTwoFARequired: (identifier: string, password: string) => void;
}

export function LoginForm({ onTwoFARequired }: LoginFormProps) {
  const { user, loginLoading } = useAuth();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  useEffect(() => {
    if (user && user.id && !loginLoading) {
      router.replace("/user/dashboard");
    }
  }, [user, loginLoading, router]);

  // Helper to set root error from any response or error
  function setRootErrorFromAny(err: unknown) {
    const errors = extractValidationErrors(err);
    if (errors.length > 0) {
      form.setError("root", { message: errors[0] });
    } else {
      form.setError("root", { message: "Login failed. Please try again." });
    }
  }

  // Utility to check for nested property
  function hasNestedProp<T = any>(obj: unknown, ...props: string[]): obj is T {
    let current = obj;
    for (const prop of props) {
      if (!current || typeof current !== "object" || !(prop in current)) {
        return false;
      }
      current = (current as any)[prop];
    }
    return true;
  }

  async function onSubmit(data: LoginFormValues) {
    try {
      const response = await loginAction(data.identifier, data.password);
      if (hasNestedProp(response, "data", "2fa_required") && response.data["2fa_required"]) {
        onTwoFARequired(data.identifier, data.password);
        return;
      }
      if (hasNestedProp(response, "data", "user") && response.data.user) {
        // Successful login, redirect handled by useEffect
        return;
      }
      setRootErrorFromAny(response);
    } catch (error: unknown) {
      setRootErrorFromAny(error);
    }
  }

  return (
    <Form {...form}>
      <div className="mb-4">
        <GoogleAuthButton />
      </div>
      <div className="relative mb-4 flex items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
        <span className="mx-3 text-xs text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root?.message && (
          <div className="mb-2 text-center text-red-600">{form.formState.errors.root.message}</div>
        )}
        <CustomInputField
          control={form.control}
          name="identifier"
          label="Email or Phone"
          type="text"
          placeholder="Enter your email or phone"
          autoComplete="email"
          disabled={loginLoading}
          loading={loginLoading}
        />
        <div>
          <CustomInputField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loginLoading}
          />
          <div className="mt-2 text-right">
            <Link
              href="/reset-password"
              className="primary-link text-muted-foreground focus-visible:ring-ring text-xs hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}