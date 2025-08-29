"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { axiosClient } from "@/hook/axiosClient";

interface TwoFactorFormProps {
  identifier: string;
  password: string;
  onSuccess: () => void;
}

export function TwoFactorForm({ identifier, password, onSuccess }: TwoFactorFormProps) {
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAError, setTwoFAError] = useState<string | null>(null);
  const [twoFALoading, setTwoFALoading] = useState(false);

  async function handle2FASubmit(e: React.FormEvent) {
    e.preventDefault();
    setTwoFALoading(true);
    setTwoFAError(null);
    try {
      const res = await axiosClient.post("/2fa/login", {
        identifier,
        password,
        code: twoFACode,
      });
      if (res.data.token) {
        document.cookie = `token=${res.data.token}; path=/`;
      }
      onSuccess();
    } catch (err) {
      let message = "Invalid or expired 2FA code.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: unknown } }).response === "object" &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (err as { response: { data: { message: string } } }).response.data.message;
      }
      setTwoFAError(message);
    } finally {
      setTwoFALoading(false);
    }
  }

  return (
    <form onSubmit={handle2FASubmit} className="space-y-6">
      <div className="mb-2 text-center font-medium text-blue-700">
        Two-Factor Authentication Required
      </div>
      <div>
        <label htmlFor="twofa-code" className="mb-1 block">
          Enter 6-digit code from your authenticator app:
        </label>
        <input
          id="twofa-code"
          type="text"
          value={twoFACode}
          onChange={(e) => setTwoFACode(e.target.value)}
          className="w-full rounded border px-2 py-1"
          pattern="\\d{6}"
          maxLength={6}
          required
          autoComplete="one-time-code"
          disabled={twoFALoading}
        />
      </div>
      <Button type="submit" disabled={twoFALoading || twoFACode.length !== 6} className="w-full">
        {twoFALoading ? "Verifying..." : "Verify & Login"}
      </Button>
      {twoFAError && <div className="mt-2 text-center text-red-600">{twoFAError}</div>}
    </form>
  );
}
