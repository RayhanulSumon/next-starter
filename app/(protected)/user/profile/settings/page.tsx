"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/useAuth";
import TwoFactorAuth from "@/components/dashboard/TwoFactorAuth";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomInputField } from "@/components/ui/CustomInputField";

type PasswordChangeFormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export default function UserSettingsPage() {
  const { user } = useAuth();
  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const onSubmit = async () => {
    setSuccessMsg(null);
    // TODO: Integrate with backend API
    await new Promise((r) => setTimeout(r, 800));
    setSuccessMsg("Password changed successfully!");
  };

  // RootError component for displaying root-level form errors
  function RootError({ message }: { message?: string }) {
    if (!message) return null;
    const errorLines = message.includes("\n") ? message.split("\n") : null;
    return (
      <div
        className="border-destructive bg-destructive/10 text-destructive my-2 flex w-full flex-col items-center justify-center gap-2 rounded-lg border px-4 py-3 text-center text-sm font-medium shadow-sm"
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-destructive h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        {errorLines ? (
          <ul className="list-inside list-disc text-left">
            {errorLines.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        ) : (
          <span>{message}</span>
        )}
      </div>
    );
  }

  const PASSWORD_FIELD_CONFIG = [
    {
      name: "currentPassword",
      label: "Current Password",
      type: "password",
      placeholder: "Enter your current password",
      autoComplete: "current-password",
    },
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "Enter your new password",
      autoComplete: "new-password",
    },
    {
      name: "confirmNewPassword",
      label: "Confirm New Password",
      type: "password",
      placeholder: "Confirm your new password",
      autoComplete: "new-password",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      {/* Account Info */}
      <div className="bg-card rounded-lg p-6 shadow">
        <h2 className="mb-2 text-lg font-semibold">Account Info</h2>
        <div className="text-muted-foreground mb-2">Your basic account details.</div>
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-medium">Name:</span> {user?.name || "-"}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user?.email || "-"}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {user?.phone || "-"}
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card rounded-lg p-6 shadow">
        <h2 className="mb-2 text-lg font-semibold">Two-Factor Authentication</h2>
        <div className="text-muted-foreground mb-2">Protect your account with 2FA.</div>
        <TwoFactorAuth />
      </div>

      {/* Password Change */}
      <div className="bg-card rounded-lg p-6 shadow">
        <h2 className="mb-2 text-lg font-semibold">Change Password</h2>
        <div className="text-muted-foreground mb-2">Update your account password.</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RootError message={form.formState.errors.root?.message} />
            {PASSWORD_FIELD_CONFIG.map(({ name, label, type, placeholder, autoComplete }) => (
              <CustomInputField
                key={name}
                control={form.control}
                name={name as keyof PasswordChangeFormData}
                label={label}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
              />
            ))}
            {successMsg && (
              <div className="rounded-lg bg-green-100 px-4 py-2 text-center text-sm font-medium text-green-700">
                {successMsg}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}