import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";
import { useAuth } from "@/hook/useAuth";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { OnlineUserCountBadge } from "@/components/dashboard/OnlineUserCountBadge";

function TopbarLeft() {
  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger />
      <span className="text-foreground text-lg font-bold">User Dashboard</span>
    </div>
  );
}

function TopbarRight() {
  const { logout, user } = useAuth();
  const router = useRouter();

  // Helper to get initials from user name
  const getInitials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";
  return (
    <div className="flex items-center gap-4">
      <OnlineUserCountBadge />
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="border-border size-8 cursor-pointer border">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name || "User"} />
            ) : (
              <AvatarFallback>
                {user?.name ? (
                  getInitials(user.name)
                ) : (
                  <User2 className="text-muted-foreground h-4 w-4" />
                )}
              </AvatarFallback>
            )}
          </Avatar>
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