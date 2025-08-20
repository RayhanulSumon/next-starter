"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/useAuth";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton({
  children = null,
  className = "",
  redirectTo = "/login",
  icon = true,
}: {
  children?: React.ReactNode;
  className?: string;
  redirectTo?: string;
  icon?: boolean;
}) {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
      await logout(); // for local state cleanup if needed
      router.replace(redirectTo);
    } catch {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`flex items-center gap-2 ${className}`}
      onClick={handleLogout}
      disabled={loading}
      type="button"
    >
      {icon && <LogOut className="mr-2" />}
      {children || (loading ? "Logging out..." : "Logout")}
    </button>
  );
}