
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AiEarnwareSettings = {
  key: string;
  url: string;
}

export const AiEarnwareKeySection = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'ai_earnware_settings')
          .single();
        
        if (error) {
          console.error('Error loading Ai.Earnware settings:', error);
          return;
        }
        
        if (data?.value) {
          const settings = data.value as AiEarnwareSettings;
          setApiKey(settings.key || '');
          setApiUrl(settings.url || '');
          setIsActive(true);
        }
      } catch (error) {
        console.error('Error loading Ai.Earnware settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (!apiKey.trim() || !apiUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter both API key and URL",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'ai_earnware_settings',
          value: {
            key: apiKey,
            url: apiUrl
          }
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      setIsActive(true);
      toast({
        title: "Success",
        description: "Ai.Earnware settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving Ai.Earnware settings:', error);
      toast({
        title: "Error",
        description: "Failed to save Ai.Earnware settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ai.Earnware Configuration</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="aiEarnwareKey">Ai.Earnware API Key</Label>
          <Input
            id="aiEarnwareKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Ai.Earnware API key"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aiEarnwareUrl">API URL</Label>
          <Input
            id="aiEarnwareUrl"
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://ai-earnware-api-c720080a0549"
          />
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
        {isActive && (
          <p className="text-sm text-muted-foreground">
            API settings are saved and active
          </p>
        )}
      </div>
    </div>
  );
};
