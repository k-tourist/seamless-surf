
import { Button } from "@/components/ui/button";
import { Moon, Settings, Sun, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthProvider";
import HelpDialog from "./help/HelpDialog";
import { useThemeManagement } from "@/hooks/useThemeManagement";

interface HeaderSectionProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const HeaderSection = ({ isDarkMode, onThemeToggle }: HeaderSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/lovable-uploads/dfb369e1-9663-40cb-aff5-a1cbc09fdb7e.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-xl font-semibold text-white">Headline Studio</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className="text-white/60 bg-white/10"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <HelpDialog />
        <Link to="/settings">
          <Button variant="ghost" className="text-white/60 hover:text-white/80 hover:bg-white/10">
            Settings
            <Settings className="h-4 w-4 ml-1" />
          </Button>
        </Link>
        <Button variant="ghost" onClick={handleLogout} className="text-white/60 hover:text-white/80 hover:bg-white/10">
          Logout
          <LogOut className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
