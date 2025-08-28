import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type SidebarMenuItemType = {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: React.ReactNode;
  subMenu?: Array<SidebarMenuItemType>;
  action?: React.ReactNode;
  collapsible?: boolean;
  isActive?: boolean;
  footer?: boolean;
};

export const SidebarMenuList: React.FC<{ items: SidebarMenuItemType[] }> = ({
  items,
}) => (
  <SidebarMenu>
    {items.map((item) =>
      item.collapsible && item.subMenu ? (
        <Collapsible
          key={item.name}
          defaultOpen={false}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <span className="w-5 flex justify-center items-center">
                  <item.icon />
                </span>
                <span className="flex-1">{item.name}</span>
                <ChevronDown className="ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            {item.action && (
              <SidebarMenuAction>{item.action}</SidebarMenuAction>
            )}
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.subMenu.map((sub) => (
                  <SidebarMenuSubItem key={sub.name}>
                    <SidebarMenuSubButton asChild>
                      <Link href={sub.href}>
                        <span className="w-5 flex justify-center items-center">
                          <sub.icon />
                        </span>
                        <span>{sub.name}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ) : (
        <SidebarMenuItem key={item.name}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <SidebarMenuButton
                asChild
                variant="default"
                className="flex items-center"
                aria-current={item.isActive ? "page" : undefined}
              >
                <Link href={item.href} tabIndex={0}>
                  <span className="w-5 flex justify-center items-center">
                    <item.icon />
                  </span>
                  <span className="flex-1 group-data-[collapsible=icon]:hidden">
                    {item.name}
                  </span>
                </Link>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right" className="group-data-[collapsible=icon]:block hidden">
              {item.name}
            </TooltipContent>
          </Tooltip>
          {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
          {item.action && <SidebarMenuAction>{item.action}</SidebarMenuAction>}
        </SidebarMenuItem>
      ),
    )}
  </SidebarMenu>
);