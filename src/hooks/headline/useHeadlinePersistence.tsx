
import { useCallback, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Headline } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { toHeadlineDTO, fromHeadlineDTO } from "@/utils/headlineUtils";
import { Json } from "@/integrations/supabase/types";

export const useHeadlinePersistence = (projectId: string | null, userId: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveToDatabase = useCallback(async (headlines: Headline[]) => {
    if (!projectId || !userId) return;

    try {
      setIsSaving(true);
      console.log('Saving headlines to database:', { projectId, headlines });
      
      const dtos = headlines.map(toHeadlineDTO);
      const { error } = await supabase
        .from('projects')
        .update({ headlines: dtos })
        .eq('id', projectId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving headlines:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [projectId, userId]);

  const loadFromDatabase = useCallback(async (): Promise<void> => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      console.log('Loading headlines for project:', projectId);
      
      const { data: project, error } = await supabase
        .from('projects')
        .select('headlines')
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;

      if (project?.headlines) {
        const loadedHeadlines = (project.headlines as Json[])
          .map(fromHeadlineDTO)
          .filter((h): h is Headline => h !== null);
        
        console.log('Loaded headlines from database:', loadedHeadlines);
      }
    } catch (error) {
      console.error('Error loading headlines:', error);
      toast({
        title: "Error",
        description: "Failed to load headlines",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, toast]);

  return {
    isLoading,
    isSaving,
    saveToDatabase,
    loadFromDatabase
  };
};
