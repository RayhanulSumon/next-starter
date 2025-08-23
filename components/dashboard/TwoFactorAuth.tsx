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

export default function TwoFactorAuth() {
  const { user } = useAuth();
  const [status, setStatus] = useState(
    user?.two_factor_enabled ? "enabled" : "disabled",
  );
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
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
    <div className="border rounded p-4 max-w-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-2">
        Two-Factor Authentication (2FA)
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Protect your account with an extra layer of security.
      </p>
      {status === "enabled" && (
        <form action={onDisable2FA}>
          <div className="mb-4 text-green-600">
            2FA is enabled on your account.
          </div>
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
            <div className="mb-2">
              Scan this QR code with your authenticator app:
            </div>
            {qr && (
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(qr.trim())}`}
                alt="2FA QR Code"
                className="mx-auto"
                width={200}
                height={200}
              />
            )}
            <div className="mt-2 text-xs text-gray-500">Secret: {secret}</div>
          </div>
          <div>
            <label htmlFor="code" className="block mb-1">
              Enter 6-digit code:
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              pattern="\\d{6}"
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          </div>
          <Button type="submit" disabled={pending || code.length !== 6}>
            Verify & Enable
          </Button>
        </form>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {success && <div className="mt-4 text-green-600">{success}</div>}
    </div>
  );
}