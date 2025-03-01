
import { useCallback } from 'react';
import { Headline } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UseHeadlineInteractionsProps {
  headlines: Headline[];
  setHeadlines: (headlines: Headline[]) => void;
  onSave: (headlines: Headline[]) => Promise<void>;
  onRevert: () => Promise<void>;
  userId: string | null;
}

export const useHeadlineInteractions = ({
  headlines,
  setHeadlines,
  onSave,
  onRevert,
  userId
}: UseHeadlineInteractionsProps) => {
  const { toast } = useToast();

  const handleInteraction = async (index: number, type: 'save' | 'thumbsUp' | 'thumbsDown') => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to interact with headlines",
        variant: "destructive",
      });
      return;
    }

    try {
      const newHeadlines = headlines.map((headline, i) => {
        if (i !== index) return headline;

        const updatedInteractions = { ...headline.interactions };
        
        if (type === 'save') {
          updatedInteractions.saved = !updatedInteractions.saved;
          if (!updatedInteractions.saved) {
            updatedInteractions.thumbsUp = false;
            updatedInteractions.thumbsDown = false;
          }
        } else {
          updatedInteractions[type] = !updatedInteractions[type];
          if (type === 'thumbsUp') {
            updatedInteractions.thumbsDown = false;
          } else {
            updatedInteractions.thumbsUp = false;
          }
        }

        return {
          ...headline,
          interactions: updatedInteractions
        };
      });

      setHeadlines(newHeadlines);
      await onSave(newHeadlines);

      if (type === 'save') {
        toast({
          description: newHeadlines[index].interactions.saved 
            ? "Headline saved successfully"
            : "Headline removed from saved collection"
        });
      }
    } catch (error) {
      console.error('Error updating headline:', error);
      await onRevert();
      toast({
        title: "Error",
        description: "Failed to update headline. Changes have been reverted.",
        variant: "destructive",
      });
    }
  };

  return { handleInteraction };
};
