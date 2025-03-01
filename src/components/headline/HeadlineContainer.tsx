import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthProvider";
import { Settings } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

interface HeadlineContainerProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  session: any;
}

const HeadlineContainer = ({ settings, setSettings, session }: HeadlineContainerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('key, value')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        const loadedSettings = data.reduce((acc: Partial<Settings>, { key, value }) => {
          acc[key as keyof Settings] = String(value);
          return acc;
        }, {});

        if (Object.keys(loadedSettings).length > 0) {
          const newSettings: Settings = {
            ...settings,
            ...loadedSettings
          };
          setSettings(newSettings);
        }
      }
    };

    loadSettings();
  }, [session?.user]);

  useEffect(() => {
    const saveSettings = async () => {
      if (!session?.user) return;

      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        user_id: session.user.id,
        key,
        value: value as Json
      }));

      const { error } = await supabase
        .from('user_settings')
        .upsert(settingsArray, {
          onConflict: 'user_id,key'
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast({
          title: "Error saving settings",
          description: "Your settings could not be saved to the database.",
          variant: "destructive",
        });
      }
    };

    if (session?.user) {
      saveSettings();
    }
  }, [settings, session?.user]);

  return null;
};

export default HeadlineContainer;