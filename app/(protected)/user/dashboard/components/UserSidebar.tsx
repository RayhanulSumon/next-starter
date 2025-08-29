import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Home, Activity, User2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hook/useAuth";

import { SidebarMenuList, SidebarMenuItemType } from "@/components/dashboard/SidebarMenuList";

const navItems: SidebarMenuItemType[] = [
  {
    name: "Dashboard",
    href: "/user/dashboard",
    icon: Home,
    isActive: true, // You can set this dynamically based on route
  },
  {
    name: "Examples",
    href: "/user/dashboard/examples",
    icon: Activity,
  },
  {
    name: "Profile",
    href: "/user/profile",
    icon: User2,
    footer: true,
  },
];

type DashboardSidebarProps = {
  className?: string;
};

const UserSidebar: React.FC<DashboardSidebarProps> = ({ className }) => {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";
  return (
    <Sidebar className={className} collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader data-testid="sidebar-header">
        <div className="flex flex-col items-center gap-2 py-4">
          <Avatar className="group-data-[collapsible=icon]:flex">
            {user?.avatar ? <AvatarImage src={user.avatar} alt="User avatar" /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium group-data-[collapsible=icon]:hidden">
            {user?.name || "User"}
          </div>
          <div className="text-muted-foreground text-xs group-data-[collapsible=icon]:hidden">
            {user?.email || "No email"}
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="my-2" />
      <SidebarContent data-testid="sidebar-content">
        <SidebarMenuList items={navItems.filter((item) => !item.footer)} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter data-testid="sidebar-footer">
        <SidebarMenuList items={navItems.filter((item) => item.footer)} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserSidebar;
