"use client";
export const dynamic = "force-dynamic";

import { useAuth } from "@/hook/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import DashboardCard from "@/components/dashboard/DashboardCard";
import TwoFactorAuth from "@/components/dashboard/TwoFactorAuth";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import UserInfoCard from "@/components/dashboard/UserInfoCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import DashboardError from "@/components/dashboard/DashboardError";

const TABS = ["overview", "activity", "settings"];

export default function DashboardPage() {
  const { user, initialLoading, fetchCurrentUser, error, clearError } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!initialLoading && !user) {
      router.replace("/login");
    }
  }, [user, initialLoading, router]);

  useEffect(() => {
    (async () => {
      try {
        await fetchCurrentUser();
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    })();
  }, [fetchCurrentUser]);

  if (initialLoading || (!user && !initialLoading)) {
    return null;
  }

  if (error) {
    return (
      <DashboardError
        error={error}
        onRetry={async () => {
          clearError();
          try {
            await fetchCurrentUser();
          } catch (err) {
            console.error('Failed to fetch current user:', err);
          }
        }}
      />
    );
  }

  const stats = [
    { name: "Total Sessions", value: "24" },
    { name: "Active Time", value: "5.2 hrs" },
    { name: "Completion Rate", value: "68%" },
  ];

  return (
    <div className="flex flex-col flex-1 w-full max-w-none space-y-6">
      <DashboardTabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "overview" && (
        <div className="flex flex-col w-full max-w-none space-y-6">
          <DashboardCard title="User Information" className="w-full max-w-none">
            <UserInfoCard user={user!} />
          </DashboardCard>

          <StatsGrid stats={stats} />
        </div>
      )}

      {activeTab === "activity" && (
        <DashboardCard title="Recent Activity" className="w-full max-w-none">
          <p className="text-gray-500 dark:text-gray-400">
            No recent activity to display.
          </p>
        </DashboardCard>
      )}

      {activeTab === "settings" && (
        <DashboardCard title="Account Settings" className="w-full max-w-none">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Manage your account settings and preferences
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-6">
            Update Profile
          </button>
          <TwoFactorAuth />
        </DashboardCard>
      )}
    </div>
  );
}