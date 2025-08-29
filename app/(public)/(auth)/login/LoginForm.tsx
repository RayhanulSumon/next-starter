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

interface LoginFormProps {
  onTwoFARequired: (identifier: string, password: string) => void;
}

export function LoginForm({ onTwoFARequired }: LoginFormProps) {
  const { login, user, loginLoading } = useAuth();
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

  async function onSubmit(data: LoginFormValues) {
    try {
      const response = await login(data.identifier, data.password);
      if (
        response &&
        typeof response === "object" &&
        "2fa_required" in response &&
        response["2fa_required"]
      ) {
        onTwoFARequired(data.identifier, data.password);
        return;
      }
      if (response && typeof response === "object" && "user" in response && response.user) {
        // Successful login, redirect handled by useEffect
        return;
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        form.setError("root", { message: error.message });
      } else {
        form.setError("root", { message: "Login failed. Please try again." });
      }
    }
  }

  return (
    <Form {...form}>
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
          autoComplete="username"
          disabled={loginLoading}
          helperText="Use your registered email or phone."
          loading={loginLoading}
        />
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium">Password</span>
            <Link href="/reset-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <CustomInputField
            control={form.control}
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loginLoading}
            helperText="Enter your account password."
          />
        </div>
        <Button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white shadow transition-transform duration-200 hover:scale-105 hover:shadow-xl"
          disabled={loginLoading}
        >
          {loginLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
