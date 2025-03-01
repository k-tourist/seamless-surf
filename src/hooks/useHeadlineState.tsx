
import { useCallback } from 'react';
import { Headline } from "@/types";
import { useHeadlinePersistence } from './headline/useHeadlinePersistence';
import { useHeadlineSync } from './headline/useHeadlineSync';
import { useHeadlineInteractions } from './headline/useHeadlineInteractions';
import { useToast } from "@/hooks/use-toast";

interface UseHeadlineStateProps {
  initialHeadlines: Headline[];
  projectId: string | null;
  userId: string | null;
}

export const useHeadlineState = ({ initialHeadlines, projectId, userId }: UseHeadlineStateProps) => {
  const { toast } = useToast();
  const { isLoading, isSaving, saveToDatabase, loadFromDatabase } = useHeadlinePersistence(projectId, userId);

  const { headlines, setHeadlines, debouncedSave, isMounted } = useHeadlineSync({
    initialHeadlines,
    projectId,
    onSave: saveToDatabase
  });

  const { handleInteraction } = useHeadlineInteractions({
    headlines,
    setHeadlines,
    onSave: debouncedSave,
    onRevert: loadFromDatabase,
    userId
  });

  const updateHeadlines = useCallback(async (newHeadlines: Headline[]) => {
    if (!isMounted.current || !projectId) return;

    try {
      setHeadlines(currentHeadlines => {
        return newHeadlines.map(newHeadline => {
          const existingHeadline = currentHeadlines.find(h => h.text === newHeadline.text);
          return existingHeadline ? {
            ...newHeadline,
            interactions: existingHeadline.interactions
          } : newHeadline;
        });
      });

      if (userId) {
        await debouncedSave(newHeadlines);
      }
    } catch (error) {
      console.error('Error updating headlines:', error);
      await loadFromDatabase();
      if (isMounted.current) {
        toast({
          title: "Error",
          description: "Failed to update headlines. Changes have been reverted.",
          variant: "destructive",
        });
      }
    }
  }, [projectId, userId, debouncedSave, loadFromDatabase, setHeadlines, toast, isMounted]);

  return {
    headlines,
    isLoading,
    isSaving,
    handleInteraction,
    updateHeadlines
  };
};
