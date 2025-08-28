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
      <SidebarHeader />
      <SidebarSeparator />
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