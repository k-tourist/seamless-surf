
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StylePrompt } from "@/types";

export const useStylePromptMutation = (operation: 'add' | 'update' | 'delete') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleError = (error: any) => {
    console.error(`Error ${operation}ing style prompt:`, error);
    if (error.code === '23505') { // Unique constraint violation
      const errorMessage = operation === 'add' 
        ? "You already have a prompt with this name"
        : "A prompt with this name already exists";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to ${operation} style prompt`,
        variant: "destructive",
      });
    }
    throw error;
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["stylePrompts"] });
    toast({
      title: "Success",
      description: `Style prompt ${operation}d successfully`,
    });
  };

  return useMutation({
    mutationFn: async (params: any) => {
      switch (operation) {
        case 'add': {
          console.log("Adding new style prompt:", params);
          const { data, error } = await supabase
            .from("style_prompts")
            .insert([params])
            .select()
            .maybeSingle();

          if (error) throw error;
          return data;
        }
        case 'update': {
          const { id, ...updateData } = params;
          console.log("Updating style prompt:", { id, ...updateData });
          
          const { data, error } = await supabase
            .from("style_prompts")
            .update(updateData)
            .eq("id", id)
            .select()
            .maybeSingle();

          if (error) throw error;
          return data;
        }
        case 'delete': {
          const id = params;
          console.log("Deleting style prompt:", id);
          
          const { error } = await supabase
            .from("style_prompts")
            .delete()
            .eq("id", id);

          if (error) throw error;
          return id;
        }
      }
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });
};
