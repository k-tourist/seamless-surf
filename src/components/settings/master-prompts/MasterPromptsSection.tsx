
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Json } from "@/integrations/supabase/types";

interface MasterPrompt {
  id: string;
  name: string;
  system_prompt: string;
  user_prompt: string;
  example_headlines: string;
  is_active: boolean;
}

interface ModelSettingValue {
  model: string;
}

interface SystemSetting {
  id: string;
  key: string;
  value: ModelSettingValue;
  created_at: string;
  updated_at: string;
}

export default function MasterPromptsSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editedPrompt, setEditedPrompt] = useState<MasterPrompt | null>(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [isSavingModel, setIsSavingModel] = useState(false);

  const models = [
    { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
    { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
    { id: "claude-3-haiku-20240229", name: "Claude 3 Haiku" },
    { id: "claude-3-7-sonnet", name: "Claude 3.7 Sonnet" },
    { id: "gpt-4o", name: "GPT-4" },
    { id: "gpt-4o-mini", name: "GPT-4 Mini" }
  ];

  const { data: masterPrompts, isLoading } = useQuery({
    queryKey: ['masterPrompts'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<{ prompts: MasterPrompt[] }>('master-prompts', {
        method: 'GET',
      });
      if (error) throw error;
      return data?.prompts || [];
    },
  });

  const { data: modelSetting } = useQuery({
    queryKey: ['aiModelSetting'],
    queryFn: async () => {
      console.log('Fetching model setting...');
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'default_ai_model')
        .single();
      
      console.log('Model setting response:', data);
      
      if (error) {
        console.error('Error fetching model setting:', error);
        throw error;
      }
      
      return data;
    },
    retry: 1,
  });

  // Update selected model whenever modelSetting changes
  useEffect(() => {
    if (modelSetting?.value && typeof modelSetting.value === 'object' && 'model' in modelSetting.value) {
      const modelValue = (modelSetting.value as { model: string }).model;
      console.log('Setting selected model from effect:', modelValue);
      setSelectedModel(modelValue);
    }
  }, [modelSetting]);

  const updateModelMutation = useMutation({
    mutationFn: async (model: string) => {
      console.log('Saving model:', model);
      setIsSavingModel(true);
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .upsert({
            key: 'default_ai_model',
            value: { model } as unknown as Json,
          }, {
            onConflict: 'key'
          });
        
        console.log('Save response:', { data, error });
        
        if (error) throw error;
        return data;
      } finally {
        setIsSavingModel(false);
      }
    },
    onSuccess: () => {
      console.log('Model saved successfully');
      queryClient.invalidateQueries({ queryKey: ['aiModelSetting'] });
      toast({
        title: "Success",
        description: "Default AI model updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error saving model:', error);
      toast({
        title: "Error",
        description: "Failed to update default AI model",
        variant: "destructive",
      });
      // Revert to the previous selection on error
      if (modelSetting?.value && typeof modelSetting.value === 'object' && 'model' in modelSetting.value) {
        setSelectedModel((modelSetting.value as { model: string }).model);
      }
    },
  });

  const updatePromptMutation = useMutation({
    mutationFn: async (updatedPrompt: MasterPrompt) => {
      console.log("Updating prompt:", updatedPrompt);
      const { data, error } = await supabase.functions.invoke('master-prompts', {
        method: 'PUT',
        body: { 
          id: updatedPrompt.id,
          system_prompt: updatedPrompt.system_prompt,
          user_prompt: updatedPrompt.user_prompt,
          name: updatedPrompt.name,
          example_headlines: updatedPrompt.example_headlines,
          is_active: updatedPrompt.is_active
        },
      });
      
      if (error) {
        console.error("Error updating prompt:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterPrompts'] });
      toast({
        title: "Success",
        description: "Master prompt updated successfully",
      });
      setEditedPrompt(null);
    },
    onError: (error) => {
      console.error('Detailed error updating master prompt:', error);
      toast({
        title: "Error",
        description: "Failed to update master prompt. Please check console for details.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Default AI Model</h2>
          <div className="w-full max-w-md space-y-4">
            <Select 
              key={selectedModel} // Add key to force re-render when model changes
              value={selectedModel} 
              onValueChange={(value) => {
                console.log('Model selected:', value);
                setSelectedModel(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default AI model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => {
                  console.log('Save button clicked, model:', selectedModel);
                  if (selectedModel) {
                    updateModelMutation.mutate(selectedModel);
                  }
                }}
                disabled={isSavingModel || !selectedModel}
              >
                {isSavingModel ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Model Selection'
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Select the default AI model to be used for all prompt processing
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Master Prompts</h2>
          <div className="grid gap-8">
            {masterPrompts?.map((prompt) => (
              <div key={prompt.id} className="w-full space-y-4 p-6 border rounded-lg bg-card">
                <h3 className="font-medium">{prompt.name}</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">System Prompt</label>
                  <Textarea
                    value={editedPrompt?.id === prompt.id ? editedPrompt.system_prompt : prompt.system_prompt}
                    onChange={(e) => 
                      setEditedPrompt({
                        ...prompt,
                        system_prompt: e.target.value,
                      })
                    }
                    className="min-h-[200px] font-mono text-sm w-full min-w-[500px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">User Prompt</label>
                  <Textarea
                    value={editedPrompt?.id === prompt.id ? editedPrompt.user_prompt : prompt.user_prompt}
                    onChange={(e) =>
                      setEditedPrompt({
                        ...prompt,
                        user_prompt: e.target.value,
                      })
                    }
                    className="min-h-[100px] font-mono text-sm w-full min-w-[500px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Example Headlines</label>
                  <p className="text-sm text-muted-foreground">
                    Use ${"{exampleHeadlines}"} in your prompts to include these examples
                  </p>
                  <Textarea
                    value={editedPrompt?.id === prompt.id ? editedPrompt.example_headlines : prompt.example_headlines}
                    onChange={(e) =>
                      setEditedPrompt({
                        ...prompt,
                        example_headlines: e.target.value,
                      })
                    }
                    placeholder="Enter example headlines, one per line"
                    className="min-h-[100px] font-mono text-sm w-full min-w-[500px]"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  {editedPrompt?.id === prompt.id ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setEditedPrompt(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (editedPrompt) {
                            updatePromptMutation.mutate(editedPrompt);
                          }
                        }}
                        disabled={updatePromptMutation.isPending}
                      >
                        {updatePromptMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setEditedPrompt(prompt)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
