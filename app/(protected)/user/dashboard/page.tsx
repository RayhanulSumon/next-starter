"use client";
import { useAuth } from "@/hook/useAuth";
import { UserRole } from "@/types/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import DashboardCard from "@/components/dashboard/DashboardCard";
import { useSidebar } from "@/components/ui/sidebar";
import TwoFactorAuth from "@/components/dashboard/TwoFactorAuth";

export default function DashboardPage() {
  const { toggleSidebar } = useSidebar();
  const { user, loading } = useAuth();
  console.log("DashboardPage useAuth user:", user);
  console.log("DashboardPage useAuth loading:", loading);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="mt-20 p-6 border rounded text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-20 p-6 border rounded text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  // Stats for the overview tab
  const stats = [
    { name: "Total Sessions", value: "24" },
    { name: "Active Time", value: "5.2 hrs" },
    { name: "Completion Rate", value: "68%" },
  ];

  return (
    <div className="flex flex-col flex-1 w-full max-w-none space-y-6">
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={toggleSidebar}
        >
          Toggle Sidebar
        </button>
      </div>
      <div className="border-b border-gray-200 dark:border-gray-800 w-full">
        <nav className="-mb-px flex space-x-8 w-full">
          {["overview", "activity", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "overview" && (
        <div className="flex flex-col w-full max-w-none space-y-6">
          <DashboardCard title="User Information" className="w-full max-w-none">
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {user.email || "Not provided"}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {user.phone || "Not provided"}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                {user.role || UserRole.USER}
              </p>
            </div>
          </DashboardCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-none">
            {stats.map((stat) => (
              <DashboardCard
                key={stat.name}
                title={stat.name}
                className="text-center w-full max-w-none"
              >
                <div className="text-3xl font-semibold text-blue-600">
                  {stat.value}
                </div>
              </DashboardCard>
            ))}
          </div>
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
