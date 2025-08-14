import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User2, LogOut, MoreHorizontal } from "lucide-react";
import { logoutUserAction } from "@/app/actions/auth/logOutAction";

function TopbarLeft() {
  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger />
      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
        User Dashboard
      </span>
    </div>
  );
}

function TopbarRight() {
  return (
    <div className="flex items-center gap-4">
      {/* User avatar or icon */}
      <User2 className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      {/* Dropdown menu for more actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem>
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              await logoutUserAction();
            }}
          >
            <LogOut className="mr-2" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const DashboardTopbar: React.FC = () => {
  return (
    <header className="sticky top-0 w-full h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-50">
      <TopbarLeft />
      <TopbarRight />
    </header>
  );
};

export default DashboardTopbar;
