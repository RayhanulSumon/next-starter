"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/useAuth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInputField } from "@/components/ui/CustomInputField";
import { Form } from "@/components/ui/form";

const requestSchema = z
  .object({
    email: z.string().email("Enter a valid email").optional().or(z.literal("")),
    phone: z
      .string()
      .regex(/^\+?[0-9]{10,15}$/, "Enter a valid phone number")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email or phone is required.",
        path: [],
      });
    }
  });

const resetSchema = z
  .object({
    token: z.string().min(1, "Reset code is required"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[^A-Za-z0-9]/, "At least one symbol"),
    passwordConfirmation: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset, resetPassword, requestResetLoading, resetLoading } = useAuth();

  // State for the initial request step
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // State for the reset step
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [method, setMethod] = useState<"email" | "mobile">("email");

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

  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "", phone: "" },
  });
  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { token: "", password: "", passwordConfirmation: "" },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto w-full max-w-md">
        <Card className="w-full rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-foreground mb-2 text-3xl font-extrabold md:text-4xl">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base md:text-lg">
              {requestSent
                ? "Enter the code sent to your email or phone and set a new password."
                : "Enter your email or phone number to receive a password reset code."}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            {!requestSent ? (
              <>
                <Tabs
                  value={method}
                  onValueChange={(v) => setMethod(v as "email" | "mobile")}
                  className="mb-4 w-full"
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="email" className="flex-1">
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="mobile" className="flex-1">
                      Mobile
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Form {...requestForm}>
                  <form
                    onSubmit={requestForm.handleSubmit(async (values) => {
                      setRequestError(null);
                      try {
                        const payload: Record<string, string> = {};
                        if (method === "email" && values.email) {
                          payload.email = values.email;
                        }
                        if (method === "mobile" && values.phone) {
                          payload.phone = values.phone;
                        }
                        if (Object.keys(payload).length === 0) {
                          setRequestError("Please provide an email or phone number");
                          return;
                        }

                        const response = await requestPasswordReset(payload);
                        setRequestSent(true);
                        if (response.code) {
                          resetForm.setValue("token", response.code);
                        }
                      } catch (error: unknown) {
                        if (error instanceof Error) {
                          setRequestError(error.message);
                        } else {
                          setRequestError("Failed to request password reset");
                        }
                      }
                    })}
                    className="space-y-4"
                  >
                    {method === "email" && (
                      <div className="space-y-2">
                        <CustomInputField
                          control={requestForm.control}
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          disabled={requestResetLoading}
                          className="!mt-0"
                        />
                      </div>
                    )}
                    {method === "mobile" && (
                      <div className="space-y-2">
                        <CustomInputField
                          control={requestForm.control}
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          disabled={requestResetLoading}
                          className="!mt-0"
                        />
                      </div>
                    )}
                    {requestError && (
                      <div
                        className="my-2 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-[color:var(--destructive)] bg-[color:var(--destructive)/0.1] px-4 py-3 text-center text-sm font-medium text-[color:var(--destructive)] shadow-sm"
                        role="alert"
                      >
                        {requestError}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary w-full rounded p-2 transition focus:ring-2 focus:outline-none disabled:opacity-50"
                      disabled={requestResetLoading}
                    >
                      {requestResetLoading ? "Sending..." : "Send Reset Instructions"}
                    </button>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                          Login here
                        </Link>
                      </p>
                    </div>
                  </form>
                </Form>
              </>
            ) : resetSuccess ? (
              // Success message
              <div className="py-8 text-center">
                <div className="mb-4 text-xl text-green-600">Password reset successful!</div>
                <p className="text-gray-600">
                  Your password has been reset. You&apos;ll be redirected to the loginAction page
                  shortly.
                </p>
                <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
                  Login now
                </Link>
              </div>
            ) : (
              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(async (values) => {
                    setResetError(null);
                    try {
                      await resetPassword({
                        token: values.token,
                        password: values.password,
                        password_confirmation: values.passwordConfirmation,
                        email: method === "email" ? requestForm.getValues("email") : undefined,
                        phone: method === "mobile" ? requestForm.getValues("phone") : undefined,
                      });
                      setResetSuccess(true);
                      setTimeout(() => {
                        router.replace("/login");
                      }, 3000);
                    } catch (error: unknown) {
                      if (error instanceof Error) {
                        setResetError(error.message);
                      } else {
                        setResetError("Failed to reset password");
                      }
                    }
                  })}
                  className="space-y-4"
                >
                  <CustomInputField
                    control={resetForm.control}
                    name="token"
                    placeholder="Enter reset code"
                    disabled={resetLoading}
                  />
                  <CustomInputField
                    control={resetForm.control}
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    disabled={resetLoading}
                  />
                  <div className="mt-1 space-y-1">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.label}
                        className={`flex items-center gap-1 text-xs ${
                          req.test(resetForm.watch("password"))
                            ? "text-success"
                            : "text-[color:var(--muted-foreground)]"
                        }`}
                      >
                        <span>{req.test(resetForm.watch("password")) ? "✔" : "✗"}</span>{" "}
                        {req.label}
                      </div>
                    ))}
                  </div>
                  <CustomInputField
                    control={resetForm.control}
                    name="passwordConfirmation"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                    disabled={resetLoading}
                  />
                  {resetError && (
                    <div
                      className="my-2 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-[color:var(--destructive)] bg-[color:var(--destructive)/0.1] px-4 py-3 text-center text-sm font-medium text-[color:var(--destructive)] shadow-sm"
                      role="alert"
                    >
                      {resetError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary w-full rounded p-2 transition focus:ring-2 focus:outline-none disabled:opacity-50"
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Resetting..." : "Reset Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestSent(false)}
                    className="bg-muted text-foreground hover:bg-muted/80 focus:ring-primary mt-2 w-full rounded p-2 transition focus:ring-2 focus:outline-none disabled:opacity-50"
                    disabled={resetLoading}
                  >
                    Back to Request Form
                  </button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}