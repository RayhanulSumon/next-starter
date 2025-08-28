import React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Home,
  Activity,
  User2,
  ChevronDown,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import { SidebarMenuList, SidebarMenuItemType } from "./SidebarMenuList";

const navItems: SidebarMenuItemType[] = [
  {
    name: "examples",
    href: "/user/dashboard/examples",
    icon: Activity, // You can change this icon if you want a different one
  },
];

type DashboardSidebarProps = {
  className?: string;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className }) => {
  const expandedOnly = "group-data-[collapsible=icon]:hidden";
  // Helper to add collapsed classes
  const collapsedClasses =
    "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2";
  const collapsedIconClasses =
    "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:block";
  const collapsedTextClasses = "group-data-[collapsible=icon]:hidden";

  return (
    <Sidebar
      className={className}
      collapsible="icon"
      side="left"
      variant="sidebar"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              variant="default"
              size="lg"
              isActive
              className={`flex items-center ${collapsedClasses}`}
            >
              <Link href="/user/dashboard">
                <span className="w-5 flex justify-center items-center">
                  <Home />
                </span>
                <span className={collapsedTextClasses}>Dashboard</span>
              </Link>
            </SidebarMenuButton>
            {/* Plus icon only in expanded mode */}
            <SidebarMenuAction className={expandedOnly}>
              <Plus />
              <span className="sr-only">Add</span>
            </SidebarMenuAction>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenuList items={navItems} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              variant="default"
              className={`flex items-center ${collapsedClasses}`}
            >
              <Link href="/user/profile">
                <span className="w-5 flex justify-center items-center">
                  <User2 />
                </span>
                <span className={collapsedTextClasses}>Profile</span>
                <ChevronDown className={`ml-auto ${collapsedIconClasses}`} />
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction className={collapsedIconClasses}>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;