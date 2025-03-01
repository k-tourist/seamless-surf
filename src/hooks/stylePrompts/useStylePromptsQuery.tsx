
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StylePrompt } from "@/types";

export const useStylePromptsQuery = (userId: string | undefined) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["stylePrompts", userId],
    queryFn: async () => {
      if (!userId) {
        console.error("No user ID found");
        return [];
      }

      console.log("Fetching style prompts for user:", userId);
      const { data, error } = await supabase.functions.invoke('style-prompts', {
        method: 'GET'
      });

      if (error) {
        console.error("Error fetching style prompts:", error);
        toast({
          title: "Error",
          description: "Failed to load style prompts",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Fetched style prompts:", data);
      return data.prompts as StylePrompt[];
    },
    enabled: !!userId,
  });
};
