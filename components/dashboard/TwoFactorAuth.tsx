"use client";
import { useState } from "react";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import {
  enable2FAAction,
  verify2FAAction,
  disable2FAAction,
  TwoFAResponse,
} from "@/app/actions/auth/twoFactorActions";
import Image from "next/image";

export default function TwoFactorAuth() {
  const { user } = useAuth();
  const [status, setStatus] = useState(user?.two_factor_enabled ? "enabled" : "disabled");
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Enable 2FA form handler
  async function onEnable2FA() {
    setPending(true);
    setError(null);
    setSuccess(null);
    const data: TwoFAResponse = await enable2FAAction();
    setPending(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setQr(data.qr || null);
    setSecret(data.secret || null);
    setStatus("pending");
  }

  // Verify 2FA form handler
  async function onVerify2FA(formData: FormData) {
    setPending(true);
    setError(null);
    setSuccess(null);
    const data: TwoFAResponse = await verify2FAAction(formData);
    setPending(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setStatus("enabled");
    setSuccess("Two-factor authentication enabled!");
    setQr(null);
    setSecret(null);
  }

  // Disable 2FA form handler
  async function onDisable2FA() {
    setPending(true);
    setError(null);
    setSuccess(null);
    const data: TwoFAResponse = await disable2FAAction();
    setPending(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setStatus("disabled");
    setSuccess("Two-factor authentication disabled.");
  }

  return (
    <div className="bg-card text-card-foreground max-w-md rounded border p-4">
      <h2 className="mb-2 text-xl font-bold">Two-Factor Authentication (2FA)</h2>
      <p className="text-muted-foreground mb-4">
        Protect your account with an extra layer of security.
      </p>
      {status === "enabled" && (
        <form action={onDisable2FA}>
          <div className="mb-4 text-green-600">2FA is enabled on your account.</div>
          <Button type="submit" disabled={pending} variant="destructive">
            Disable 2FA
          </Button>
        </form>
      )}
      {status === "disabled" && (
        <form action={onEnable2FA}>
          <Button type="submit" disabled={pending}>
            Enable 2FA
          </Button>
        </form>
      )}
      {status === "pending" && (
        <form action={onVerify2FA} className="space-y-4">
          <div className="mb-2">
            <div className="mb-2">Scan this QR code with your authenticator app:</div>
            {qr && (
              <Image
                src={`data:image/svg+xml;utf8,${encodeURIComponent(qr.trim())}`}
                alt="2FA QR Code"
                className="mx-auto"
                width={200}
                height={200}
                unoptimized={true}
              />
            )}
            <div className="text-muted-foreground mt-2 text-xs">Secret: {secret}</div>
          </div>
          <div>
            <label htmlFor="code" className="text-foreground mb-1 block text-sm font-medium">
              Enter 6-digit code:
            </label>
            <input
              id="code"
              name="code"
              type="text"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded border px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              pattern="\d{6}"
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          </div>
          <Button type="submit" disabled={pending}>
            Verify & Enable
          </Button>
        </form>
      )}
      {error && <div className="text-destructive mt-4">{error}</div>}
      {success && <div className="text-success mt-4">{success}</div>}
    </div>
  );
}