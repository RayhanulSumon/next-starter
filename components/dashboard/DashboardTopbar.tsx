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
      <User2 className="text-muted-foreground h-6 w-6" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-muted hover:bg-accent rounded-full p-2 transition">
            <MoreHorizontal className="text-muted-foreground h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="min-w-[160px] py-2">
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm">
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm">
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="text-destructive focus:bg-destructive/10 flex cursor-pointer items-center gap-2 px-3 py-2 text-sm"
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="inline-block"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            <span>Logout</span>
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