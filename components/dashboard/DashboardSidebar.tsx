"use client";
import React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { name: "Overview", href: "/user/dashboard" },
  { name: "Activity", href: "/user/dashboard?tab=activity" },
  { name: "Settings", href: "/user/dashboard?tab=settings" },
];

type DashboardSidebarProps = {
  className?: string;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className }) => {
  return (
    <Sidebar className={className}>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton variant="default">
                {item.name}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </Sidebar>
  );
};

export default DashboardSidebar;
