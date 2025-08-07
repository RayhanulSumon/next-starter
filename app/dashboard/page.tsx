"use client";
import { useAuth } from "@/hook/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="max-w-md mx-auto mt-20 p-6 border rounded text-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded text-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.name || "User"}!</p>
      <p>Your email: {user.email}</p>
    </div>
  );
}