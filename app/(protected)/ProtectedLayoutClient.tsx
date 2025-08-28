"use client";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import UserSidebar from "@/app/(protected)/user/dashboard/components/UserSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import React from "react";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  useSidebar();
  return (
    <div className="flex min-h-screen bg-background text-foreground w-full">
      <div className="sticky top-0 h-screen">
        <UserSidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardTopbar />
        <main className="flex-1 w-full p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function ProtectedLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarLayout>{children}</SidebarLayout>
    </SidebarProvider>
  );
}