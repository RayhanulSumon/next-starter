"use client";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground w-full">
        {/* Sidebar sticky on the left */}
        <div className="sticky top-0 h-screen">
          <DashboardSidebar />
        </div>
        {/* Main area: topbar sticky, content below */}
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardTopbar />
          <main className="flex-1 w-full p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
