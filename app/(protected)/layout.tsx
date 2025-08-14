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
      <SidebarLayout>{children}</SidebarLayout>
    </SidebarProvider>
  );
}

import { useSidebar } from "@/components/ui/sidebar";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  return (
    <div className="flex min-h-screen bg-background text-foreground w-full">
      {/* Sidebar: always rendered, handles its own collapse/animation */}
      <div className="sticky top-0 h-screen">
        <DashboardSidebar />
      </div>
      {/* Main area: topbar, content below */}
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardTopbar />
        <main className="flex-1 w-full p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
