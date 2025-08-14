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
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
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

const navItems = [
  { name: "Overview", href: "/user/dashboard", icon: Home },
  { name: "Activity", href: "/user/dashboard?tab=activity", icon: Activity },
  { name: "Settings", href: "/user/dashboard?tab=settings", icon: Settings },
];

const subMenuItems = [
  { name: "Inbox", href: "/user/dashboard/inbox", icon: Inbox },
  { name: "Calendar", href: "/user/dashboard/calendar", icon: Calendar },
  { name: "Search", href: "/user/dashboard/search", icon: Search },
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild variant="default" size="lg" isActive>
              <Link href="/user/dashboard">
                <Home className="mr-2" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuAction>
              <Plus />
              <span className="sr-only">Add</span>
            </SidebarMenuAction>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {/* Collapsible Navigation Group */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center group">
                Navigation
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <SidebarGroupAction title="Add Navigation">
              <Plus />
            </SidebarGroupAction>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild variant="default">
                        <Link href={item.href}>
                          <item.icon className="mr-2" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                      {/* Example badge for Activity */}
                      {item.name === "Activity" && (
                        <SidebarMenuBadge>3</SidebarMenuBadge>
                      )}
                      {/* Collapsible Submenu Example for Settings */}
                      {item.name === "Settings" && (
                        <Collapsible
                          defaultOpen={false}
                          className="group/collapsible"
                        >
                          <CollapsibleTrigger className="flex w-full items-center px-2 py-1 text-xs text-muted-foreground group">
                            More Settings
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {subMenuItems.map((sub) => (
                                <SidebarMenuSubItem key={sub.name}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={sub.href}>
                                      <sub.icon className="mr-2" />
                                      <span>{sub.name}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        {/* Remove old submenu group, now handled in collapsible above */}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild variant="default">
              <Link href="/user/profile">
                <User2 className="mr-2" />
                <span>Profile</span>
                <ChevronDown className="ml-auto" />
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
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
