"use client";
import { AuthProvider } from "@/context/auth-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import React from "react";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { state } = require("@/components/ui/sidebar").useSidebar();
  return (
    <div className="flex min-h-screen bg-background text-foreground w-full">
      <div className="sticky top-0 h-screen">
        <DashboardSidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardTopbar />
        <main className="flex-1 w-full p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function ProtectedLayoutClient({
  initialUser,
  children,
}: {
  initialUser: any;
  children: React.ReactNode;
}) {
  return (
    <AuthProvider initialUser={initialUser}>
      <SidebarProvider>
        <SidebarLayout>{children}</SidebarLayout>
      </SidebarProvider>
    </AuthProvider>
  );
}
