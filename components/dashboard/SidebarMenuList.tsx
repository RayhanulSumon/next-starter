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

export type SidebarMenuItemType = {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: React.ReactNode;
  subMenu?: Array<SidebarMenuItemType>;
  action?: React.ReactNode;
  collapsible?: boolean;
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
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                  <item.icon className="mr-2" />
                  <span className="flex-1">{item.name}</span>
                  <ChevronDown className="ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </Link>
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
                        <sub.icon className="mr-2" />
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
          <SidebarMenuButton asChild variant="default">
            <Link href={item.href}>
              <item.icon className="mr-2" />
              <span>{item.name}</span>
            </Link>
          </SidebarMenuButton>
          {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
          {item.action && <SidebarMenuAction>{item.action}</SidebarMenuAction>}
          {item.subMenu && (
            <SidebarMenuSub>
              {item.subMenu.map((sub) => (
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
          )}
        </SidebarMenuItem>
      )
    )}
  </SidebarMenu>
);
