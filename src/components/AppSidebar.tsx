import { LayoutDashboard, Image, Settings, Home, Map, FileText, Beaker, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Gallery", url: "/gallery", icon: Image },
  { title: "Map View", url: "/map", icon: Map },
  { title: "Settings", url: "/settings", icon: Settings },
];

const resourceItems = [
  { title: "Research", url: "/research", icon: Beaker },
  { title: "API Docs", url: "/docs", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const renderItems = (items: typeof mainItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
            activeClassName="bg-primary/10 text-primary font-medium"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r border-border/30 bg-[hsl(var(--surface-1))]">
      <SidebarContent>
        <div className="flex items-center gap-2.5 px-4 py-5">
          <div className="relative h-7 w-7 shrink-0">
            <div className="absolute inset-0 rounded-md bg-primary/20" />
            <div className="absolute inset-1.5 rounded-sm bg-primary" />
          </div>
          {!collapsed && (
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-foreground">
              SAR<span className="text-primary">Chroma</span>
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-[0.1em] text-muted-foreground/50 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-[0.1em] text-muted-foreground/50 font-medium">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(resourceItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign out */}
        {user && (
          <div className="mt-auto px-3 pb-4">
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 w-full"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
