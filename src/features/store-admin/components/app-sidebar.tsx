import * as React from "react";
import { LayoutDashboard, Package, FolderTree, Zap, Store } from "lucide-react";
import { useLocation } from "react-router-dom";
import { apiAuth } from "@/api/api-auth";

import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

// App Logo Component
function AppLogo() {
  return (
    <div className="flex items-center gap-2 px-2 py-2">
      <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <Zap className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">Catalyst</span>
        <span className="truncate text-xs text-muted-foreground">Management System</span>
      </div>
    </div>
  );
}

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "products",
      icon: Package,
    },
    {
      title: "Categories",
      url: "categories",
      icon: FolderTree,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || location.pathname.slice(1);

  // Get current merchant ID for store navigation
  const merchantId = apiAuth.getCurrentMerchantId();
  const isAdmin = apiAuth.isCurrentUserAdmin();

  const isMenuActive = (url: string) => {
    if (!currentPath || currentPath === "") {
      return url === "dashboard";
    }

    return currentPath === url || currentPath.includes(url);
  };

  // Function to handle store page navigation
  const handleStoreNavigation = () => {
    if (merchantId) {
      // Open in new tab/window
      window.open(`/merchant/${merchantId}/home`, "_blank");
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isMenuActive(item.url)} tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Store Page Button - Only show for non-admin users with merchantId */}
              {!isAdmin && merchantId && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleStoreNavigation}
                    tooltip="View Store"
                    className="cursor-pointer"
                  >
                    <Store />
                    <span>View Store</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
