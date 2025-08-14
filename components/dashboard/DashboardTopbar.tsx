import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

function TopbarLeft() {
  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger className="" />
      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
        User Dashboard
      </span>
    </div>
  );
}

function TopbarRight() {
  return (
    <div className="flex  items-center gap-4">
      {/* Add user avatar, notifications, theme toggle, etc. here */}
      <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
        Profile
      </button>
    </div>
  );
}

const DashboardTopbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-50">
      <TopbarLeft />
      <TopbarRight />
    </header>
  );
};

export default DashboardTopbar;
