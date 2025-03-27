"use client"

import * as React from "react"
import { ChevronDown, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"


import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ActiveLink } from "./ui/active-link"

interface SubMenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
}

interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: SubMenuItem[]
}

interface NavGroup {
  groupName: string
  items: MenuItem[]
}

interface NavMainProps {
  items: NavGroup[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()

  return (
    <>
      {items.map((group, groupIndex) => (
        <SidebarGroup key={groupIndex}>
          <SidebarGroupLabel>{group.groupName}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item, itemIndex) => {
                const isItemActive = item.url === pathname || pathname.startsWith(`${item.url}/`)
                const hasActiveSubItem = item.items?.some(
                  (subItem) => subItem.url === pathname || pathname.startsWith(`${subItem.url}/`),
                )

                return (
                  <React.Fragment key={itemIndex}>
                    {item.items ? (
                      <Collapsible
                        defaultOpen={isItemActive || hasActiveSubItem}
                        className="w-full transition-all duration-300 ease-in-out"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger className="w-full" asChild>
                            <SidebarMenuButton isActive={isItemActive}>
                              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                              <span>{item.title}</span>
                              <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="transition-all duration-300 ease-in-out">
                            <SidebarMenuSub>
                              {item.items.map((subItem, subItemIndex) => {
                                const isSubItemActive =
                                  subItem.url === pathname || pathname.startsWith(`${subItem.url}/`)

                                return (
                                  <SidebarMenuSubItem key={subItemIndex}>
                                    <SidebarMenuSubButton asChild isActive={isSubItemActive}>
                                      <ActiveLink href={subItem.url}>
                                        {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                        <span>{subItem.title}</span>
                                      </ActiveLink>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isItemActive}>
                          <ActiveLink href={item.url}>
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                            <span>{item.title}</span>
                          </ActiveLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </React.Fragment>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}

