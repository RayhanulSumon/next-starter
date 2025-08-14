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
  Settings,
  User2,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Calendar,
  Inbox,
  Search,
} from "lucide-react";

import { SidebarMenuList, SidebarMenuItemType } from "./SidebarMenuList";

const navItems: SidebarMenuItemType[] = [
  {
    name: "Activity",
    href: "/user/dashboard?tab=activity",
    icon: Activity,
    badge: 3,
  },
  {
    name: "Settings",
    href: "/user/dashboard?tab=settings",
    icon: Settings,
    collapsible: true,
    subMenu: [
      { name: "Inbox", href: "/user/dashboard/inbox", icon: Inbox },
      { name: "Calendar", href: "/user/dashboard/calendar", icon: Calendar },
      { name: "Search", href: "/user/dashboard/search", icon: Search },
    ],
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
              className={collapsedClasses}
            >
              <Link href="/user/dashboard">
                <Home className={`mr-2 ${collapsedIconClasses}`} />
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
              className={collapsedClasses}
            >
              <Link href="/user/profile">
                <User2 className={`mr-2 ${collapsedIconClasses}`} />
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
