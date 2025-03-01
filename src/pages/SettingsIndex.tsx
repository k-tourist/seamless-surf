
import { Link } from "react-router-dom";
import { UserCog, Link as LinkIcon, MessageSquare, User, FileText, Settings, ClipboardCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import SettingsContainer from "@/components/settings/SettingsContainer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackToDashboard from "@/components/settings/BackToDashboard";

const settingsCards = [
  {
    title: "Profile Settings",
    description: "Customize your account preferences and personal information",
    icon: User,
    path: "/settings/profile",
    adminOnly: false,
  },
  {
    title: "Style Prompts",
    description: "Create and manage custom headline generation templates",
    icon: MessageSquare,
    path: "/settings/prompts",
    adminOnly: false,
  },
  {
    title: "User Management",
    description: "Configure user roles and manage platform access settings",
    icon: UserCog,
    path: "/settings/users",
    adminOnly: true,
  },
  {
    title: "Master Prompts",
    description: "Define system-wide templates for headline generation",
    icon: Settings,
    path: "/settings/master-prompts",
    adminOnly: true,
  },
  {
    title: "Grading Rubric",
    description: "Configure the evaluation criteria for headline grading",
    icon: ClipboardCheck,
    path: "/settings/grading-rubric",
    adminOnly: true,
  },
  {
    title: "Connections",
    description: "Manage external API integrations and service connections",
    icon: LinkIcon,
    path: "/settings/connections",
    adminOnly: true,
  },
  {
    title: "Developer Notes",
    description: "Access platform documentation and technical updates",
    icon: FileText,
    path: "/settings/dev-notes",
    adminOnly: true,
  },
];

const SettingsIndex = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {settingsCards.map((card) => {
        if (card.adminOnly && !isAdmin) return null;
        
        return (
          <Link key={card.path} to={card.path}>
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <card.icon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default SettingsIndex;
