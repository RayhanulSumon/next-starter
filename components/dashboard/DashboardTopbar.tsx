import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User2, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function TopbarLeft() {
  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger />
      <span className="text-foreground text-lg font-bold">User Dashboard</span>
    </div>
  );
}

function TopbarRight() {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      {/* User avatar or icon */}
      <User2 className="text-muted-foreground h-6 w-6" />
      {/* Dropdown menu for more actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-muted hover:bg-accent rounded-full p-2 transition">
            <MoreHorizontal className="text-muted-foreground h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem>
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild variant="destructive">
            <Button
              variant="destructive"
              className="flex w-full items-center gap-2 text-left"
              onClick={async () => {
                await logout();
                router.replace("/login");
              }}
              type="button"
            >
              <span className="mr-2">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
              </span>
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const DashboardTopbar: React.FC = () => {
  return (
    <header className="bg-card sticky top-0 z-50 flex h-16 w-full items-center justify-between border border-b px-4 shadow-sm md:px-6">
      <TopbarLeft />
      <TopbarRight />
    </header>
  );
};

export default DashboardTopbar;