
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Json } from "@/integrations/supabase/types";

type Settings = {
  key?: string | null;
  model?: string | null;
}

interface SystemSettingsRow {
  value: Settings;
}

export const AnthropicKeySection = () => {
  const { toast } = useToast();
  const [anthropicKey, setAnthropicKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");

  const models = [
    { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
    { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
    { id: "claude-3-haiku-20240229", name: "Claude 3 Haiku" }
  ];

  useEffect(() => {
    const loadKey = async () => {
      try {
        const { data: keyData, error: keyError } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'anthropic_api_key')
          .maybeSingle();
        
        if (!keyError && keyData?.value) {
          const settings = keyData.value as Settings;
          if (settings.key) {
            setSavedKey(settings.key);
            setAnthropicKey(settings.key);
          }
        }

        const { data: modelData, error: modelError } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'anthropic_model')
          .maybeSingle();

        console.log('Initial model data loaded:', modelData);

        if (modelError) {
          console.error('Error loading model:', modelError);
        }

        if (modelData?.value) {
          const settings = modelData.value as Settings;
          if (settings.model) {
            console.log('Setting initial selected model to:', settings.model);
            setSelectedModel(settings.model);
          }
        }
      } catch (error) {
        console.error('Error loading Anthropic settings:', error);
      }
    };
    loadKey();
  }, []);

  const handleSaveAnthropicKey = async () => {
    if (!anthropicKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an Anthropic API key",
        variant: "destructive",
      });
      return;
    }

    if (!selectedModel) {
      toast({
        title: "Error",
        description: "Please select a model",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting to save settings with model:', selectedModel);
    setIsSaving(true);
    
    try {
      const { error: keyError } = await supabase
        .from('system_settings')
        .upsert({
          key: 'anthropic_api_key',
          value: { key: anthropicKey } as Json
        }, {
          onConflict: 'key'
        });

      if (keyError) {
        throw keyError;
      }

      const modelValue = { model: selectedModel } as Json;
      console.log('Saving model value:', modelValue);

      const { error: modelError } = await supabase
        .from('system_settings')
        .upsert({
          key: 'anthropic_model',
          value: modelValue
        }, {
          onConflict: 'key'
        });

      if (modelError) {
        throw modelError;
      }

      console.log('Settings saved successfully. Model:', selectedModel);
      setSavedKey(anthropicKey);
      toast({
        title: "Success",
        description: "Anthropic settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving Anthropic settings:', error);
      toast({
        title: "Error",
        description: "Failed to save Anthropic settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Anthropic Configuration</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="anthropicKey">Anthropic API Key</Label>
          <div className="flex gap-2">
            <Input
              id="anthropicKey"
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder={savedKey ? "••••••••" : "Enter your Anthropic API key"}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {savedKey ? "API key is saved and active" : "Enter your Anthropic API key to enable Claude integration"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="anthropicModel">Default Model</Label>
          <Select 
            value={selectedModel} 
            onValueChange={(value) => {
              console.log('Model selected in UI:', value);
              setSelectedModel(value);
            }}
          >
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

        <Button onClick={handleSaveAnthropicKey} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};
