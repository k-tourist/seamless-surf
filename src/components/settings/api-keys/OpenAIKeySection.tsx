
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const OpenAIKeySection = () => {
  const { toast } = useToast();
  const [openaiKey, setOpenaiKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");

  const models = [
    { id: "gpt-4o-mini", name: "GPT-4 Mini" },
    { id: "gpt-4o", name: "GPT-4" },
  ];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-api-key', {
          body: { key: 'openai_api_key' }
        });
        
        if (!error && data?.key) {
          setSavedKey(data.key);
          setOpenaiKey(data.key);
        }

        // Load model preference
        const { data: modelData } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'openai_model')
          .single();

        const modelValue = modelData?.value as { model?: string };
        if (modelValue?.model) {
          setSelectedModel(modelValue.model);
        }
      } catch (error) {
        console.error('Error loading OpenAI settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleSaveOpenAIKey = async () => {
    if (!openaiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error: keyError } = await supabase
        .from('system_settings')
        .upsert({
          key: 'openai_api_key',
          value: { key: openaiKey },
        }, {
          onConflict: 'key'
        });

      if (keyError) throw keyError;

      const { error: modelError } = await supabase
        .from('system_settings')
        .upsert({
          key: 'openai_model',
          value: { model: selectedModel },
        }, {
          onConflict: 'key'
        });

      if (modelError) throw modelError;

      setSavedKey(openaiKey);
      toast({
        title: "Success",
        description: "OpenAI settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving OpenAI settings:', error);
      toast({
        title: "Error",
        description: "Failed to save OpenAI settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">OpenAI Configuration</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="openaiKey">OpenAI API Key</Label>
          <div className="flex gap-2">
            <Input
              id="openaiKey"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder={savedKey ? "••••••••" : "Enter your OpenAI API key"}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {savedKey ? "API key is saved and active" : "Enter your OpenAI API key"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="openaiModel">Default Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSaveOpenAIKey} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};
