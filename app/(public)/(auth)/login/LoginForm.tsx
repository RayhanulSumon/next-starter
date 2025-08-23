"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomInputField } from "@/components/ui/CustomInputField";
import Link from "next/link";
import { loginSchema, LoginFormValues, isLoginErrorResponse } from "./login-schema";
import { useEffect } from "react";

interface LoginFormProps {
  onTwoFARequired: (identifier: string, password: string) => void;
}

export function LoginForm({ onTwoFARequired }: LoginFormProps) {
  const { login, user, loginLoading, loading: authLoading } = useAuth();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  useEffect(() => {
    if (user && user.id && !authLoading) {
      router.replace("/user/dashboard");
    }
  }, [user, authLoading, router]);

  async function onSubmit(data: LoginFormValues) {
    try {
      const response = await login(data.identifier, data.password);
      if (isLoginErrorResponse(response) && response.status !== 200) {
        form.setError("root", { message: response.message || "Login failed. Please try again." });
        if (response.errors && typeof response.errors === "object") {
          Object.entries(response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              form.setError(field as keyof LoginFormValues, { message: messages[0] });
            }
          });
        }
        return;
      }
      if (response && typeof response === "object" && "twofa_required" in response && response.twofa_required) {
        onTwoFARequired(data.identifier, data.password);
        return;
      }
      if (response && typeof response === "object" && "user" in response && response.user) {
        router.push("/user/dashboard");
        return;
      }
      if (isLoginErrorResponse(response)) {
        form.setError("root", { message: response.message || "Unexpected login response." });
      } else {
        form.setError("root", { message: "Unexpected login response." });
      }
    } catch (err) {
      form.setError("root", { message: err instanceof Error && err.message ? err.message : "Login failed. Please try again." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root?.message && (
          <div className="text-red-600 text-center mb-2">
            {form.formState.errors.root.message}
          </div>
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
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">Password</span>
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform duration-200"
          disabled={loginLoading}
        >
          {loginLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}