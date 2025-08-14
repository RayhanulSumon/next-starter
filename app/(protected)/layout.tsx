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
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Topbar always full width */}
        <DashboardTopbar />
        {/* Sidebar and main content */}
        <div className="flex flex-1 w-full pt-16">
          <DashboardSidebar className="mt-16" />
          <main className="flex-1 w-full p-4 md:p-8">{children}</main>
        </div>
        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 py-4 mt-auto w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Your Application. All rights reserved.
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
}
