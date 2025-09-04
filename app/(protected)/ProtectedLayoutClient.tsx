"use client";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import UserSidebar from "@/app/(protected)/user/dashboard/components/UserSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import React from "react";
import { useAuth } from "@/hook/useAuth";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  useSidebar();
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full">
      <div className="sticky top-0 h-screen">
        <UserSidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar />
        <main className="w-full flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function ProtectedLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, fetchCurrentUser } = useAuth();
  React.useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!user && token) {
      fetchCurrentUser();
    }
  }, [user, fetchCurrentUser]);
  return (
    <SidebarProvider>
      <SidebarLayout>{children}</SidebarLayout>
    </SidebarProvider>
  );
}