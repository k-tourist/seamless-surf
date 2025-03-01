
import { Link, useLocation } from "react-router-dom";
import { UserCog, Link as LinkIcon, MessageSquare, User, FileText, Settings, ClipboardCheck, Book } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/AuthProvider";

const adminMenuItems = [
  {
    title: "User Management",
    path: "/settings/users",
    icon: UserCog,
    adminOnly: true,
  },
  {
    title: "Master Prompts",
    path: "/settings/master-prompts",
    icon: Settings,
    adminOnly: true,
  },
  {
    title: "Grading Rubric",
    path: "/settings/grading-rubric",
    icon: ClipboardCheck,
    adminOnly: true,
  },
  {
    title: "Connections",
    path: "/settings/connections",
    icon: LinkIcon,
    adminOnly: true,
  },
  {
    title: "Specifications",
    path: "/settings/specifications",
    icon: Book,
    adminOnly: true,
  },
];

const userMenuItems = [
  {
    title: "Profile Settings",
    path: "/settings/profile",
    icon: User,
    adminOnly: false,
  },
  {
    title: "Style Prompts",
    path: "/settings/prompts",
    icon: MessageSquare,
    adminOnly: false,
  },
];

export function SettingsSidebar() {
  const { isAdmin } = useAuth();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        {/* User Settings Group */}
        <SidebarGroup>
          <SidebarGroupLabel>User Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Settings Group - Only shown to admins */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={item.title}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
