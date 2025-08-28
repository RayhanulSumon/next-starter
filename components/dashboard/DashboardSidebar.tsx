import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Home,
  Activity,
  User2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { SidebarMenuList, SidebarMenuItemType } from "./SidebarMenuList";

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

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className }) => {

  return (
    <Sidebar
      className={className}
      collapsible="icon"
      side="left"
      variant="sidebar"
    >
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2 py-4">
          <Avatar className="group-data-[collapsible=icon]:flex">
            <AvatarImage src="/file.svg" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium group-data-[collapsible=icon]:hidden">John Doe</div>
          <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">john@example.com</div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="my-2" />
      <SidebarContent>
        <SidebarMenuList items={navItems.filter((item) => !item.footer)} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenuList items={navItems.filter((item) => item.footer)} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;