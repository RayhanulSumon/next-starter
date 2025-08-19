"use client";
import { useState } from "react";
import { axiosClient } from "@/hook/axiosClient";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function TwoFactorAuth() {
  const { user } = useAuth();
  const [status, setStatus] = useState(user?.two_factor_enabled ? "enabled" : "disabled");
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Start 2FA setup: get QR and secret
  const handleEnable2FA = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axiosClient.post("/2fa/enable");
      setQr(res.data.qr);
      setSecret(res.data.secret);
      setStatus("pending");
    } catch (e) {
      let message = "Failed to start 2FA setup.";
      if (
        typeof e === 'object' &&
        e !== null &&
        'response' in e &&
        typeof (e as { response?: { data?: unknown } }).response === 'object' &&
        (e as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (e as { response: { data: { message: string } } }).response.data.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Verify 2FA code
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axiosClient.post("/2fa/verify", { code });
      setStatus("enabled");
      setSuccess("Two-factor authentication enabled!");
      setQr(null);
      setSecret(null);
    } catch (e) {
      let message = "Invalid or expired code.";
      if (
        typeof e === 'object' &&
        e !== null &&
        'response' in e &&
        typeof (e as { response?: { data?: unknown } }).response === 'object' &&
        (e as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (e as { response: { data: { message: string } } }).response.data.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axiosClient.post("/2fa/disable");
      setStatus("disabled");
      setSuccess("Two-factor authentication disabled.");
    } catch (e) {
      let message = "Failed to disable 2FA.";
      if (
        typeof e === 'object' &&
        e !== null &&
        'response' in e &&
        typeof (e as { response?: { data?: unknown } }).response === 'object' &&
        (e as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (e as { response: { data: { message: string } } }).response.data.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 max-w-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-2">Two-Factor Authentication (2FA)</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Protect your account with an extra layer of security.
      </p>
      {status === "enabled" && (
        <>
          <div className="mb-4 text-green-600">2FA is enabled on your account.</div>
          <Button onClick={handleDisable2FA} disabled={loading} variant="destructive">
            Disable 2FA
          </Button>
        </>
      )}
      {status === "disabled" && (
        <Button onClick={handleEnable2FA} disabled={loading}>
          Enable 2FA
        </Button>
      )}
      {status === "pending" && (
        <form onSubmit={handleVerify2FA} className="space-y-4">
          <div className="mb-2">
            <div className="mb-2">Scan this QR code with your authenticator app:</div>
            {qr && (
              <Image src={qr} alt="2FA QR Code" className="mx-auto" width={200} height={200} />
            )}
            <div className="mt-2 text-xs text-gray-500">Secret: {secret}</div>
          </div>
          <div>
            <label htmlFor="code" className="block mb-1">Enter 6-digit code:</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              pattern="\\d{6}"
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          </div>
          <Button type="submit" disabled={loading || code.length !== 6}>
            Verify & Enable
          </Button>
        </form>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {success && <div className="mt-4 text-green-600">{success}</div>}
    </div>
  );
}