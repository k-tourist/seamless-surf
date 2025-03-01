
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Headline } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface HeadlineData {
  text: string;
  interactions: {
    saved: boolean;
    thumbsUp: boolean;
    thumbsDown: boolean;
  };
  grade?: string;
}

const convertJsonToHeadlineData = (json: Json): HeadlineData | null => {
  if (typeof json !== 'object' || !json) return null;
  
  const obj = json as any;
  if (
    typeof obj.text === 'string' &&
    typeof obj.interactions === 'object' &&
    typeof obj.interactions.saved === 'boolean' &&
    typeof obj.interactions.thumbsUp === 'boolean' &&
    typeof obj.interactions.thumbsDown === 'boolean'
  ) {
    return {
      text: obj.text,
      interactions: {
        saved: obj.interactions.saved,
        thumbsUp: obj.interactions.thumbsUp,
        thumbsDown: obj.interactions.thumbsDown
      },
      grade: typeof obj.grade === 'string' ? obj.grade : undefined
    };
  }
  return null;
};

const convertHeadlineDataToJson = (data: HeadlineData): Json => {
  return {
    text: data.text,
    interactions: {
      saved: data.interactions.saved,
      thumbsUp: data.interactions.thumbsUp,
      thumbsDown: data.interactions.thumbsDown
    },
    ...(data.grade ? { grade: data.grade } : {})
  };
};

export const useHeadlineStorage = (projectId: string, headlines: Headline[]) => {
  const [savedHeadlineTexts, setSavedHeadlineTexts] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadSavedData = async () => {
      if (!projectId) return;

      try {
        const { data: existingProject, error } = await supabase
          .from('projects')
          .select('headlines')
          .eq('id', projectId)
          .single();

        if (error) {
          console.error('Error loading project data:', error);
          return;
        }

        const headlinesArray = existingProject?.headlines;
        if (!Array.isArray(headlinesArray)) {
          console.error('Headlines data is not an array:', headlinesArray);
          return;
        }

        const savedHeadlines = headlinesArray
          .map(convertJsonToHeadlineData)
          .filter((h): h is HeadlineData => h !== null);

        const savedTexts = new Set(
          savedHeadlines
            .filter(h => h.interactions.saved)
            .map(h => h.text)
        );
        setSavedHeadlineTexts(savedTexts);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
  }, [projectId]);

  const updateDatabase = async (headlineData: HeadlineData[], userId: string): Promise<boolean> => {
    if (!projectId || !userId) return false;

    try {
      const jsonData = headlineData.map(convertHeadlineDataToJson) as Json[];

      const { error } = await supabase
        .from('projects')
        .update({ headlines: jsonData })
        .eq('id', projectId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating database:', error);
      return false;
    }
  };

  const handleSave = async (
    index: number, 
    userId: string | null, 
    onInteraction: (index: number, type: 'save' | 'thumbsUp' | 'thumbsDown') => void,
    getGrade: (index: number) => string | undefined,
    onGrade: (index: number, text: string, isBackground: boolean) => void
  ) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to save headlines",
        variant: "destructive",
      });
      return;
    }

    if (isSaving[index]) return;
    setIsSaving(prev => ({ ...prev, [index]: true }));

    try {
      const headlineText = headlines[index].text;
      const newSavedState = !headlines[index].interactions.saved;

      if (newSavedState) {
        setSavedHeadlineTexts(prev => new Set([...prev, headlineText]));
        onInteraction(index, 'save');

        const { data: currentData } = await supabase
          .from('projects')
          .select('headlines')
          .eq('id', projectId)
          .single();

        const headlinesArray = Array.isArray(currentData?.headlines) ? currentData.headlines : [];
        const savedHeadlines = headlinesArray
          .map(convertJsonToHeadlineData)
          .filter((h): h is HeadlineData => h !== null);

        const headlineData: HeadlineData = {
          text: headlineText,
          interactions: {
            saved: true,
            thumbsUp: headlines[index].interactions.thumbsUp,
            thumbsDown: headlines[index].interactions.thumbsDown
          },
          grade: getGrade(index)
        };

        const existingIndex = savedHeadlines.findIndex(h => h.text === headlineText);
        const updatedHeadlines = existingIndex !== -1
          ? [
              ...savedHeadlines.slice(0, existingIndex),
              headlineData,
              ...savedHeadlines.slice(existingIndex + 1)
            ]
          : [...savedHeadlines, headlineData];

        const success = await updateDatabase(updatedHeadlines, userId);
        
        if (success) {
          if (!getGrade(index)) {
            onGrade(index, headlineText, true);
          }
          toast({
            title: "Success",
            description: "Headline saved successfully",
          });
        }
      } else {
        const { data: currentData } = await supabase
          .from('projects')
          .select('headlines')
          .eq('id', projectId)
          .single();

        const headlinesArray = Array.isArray(currentData?.headlines) ? currentData.headlines : [];
        const savedHeadlines = headlinesArray
          .map(convertJsonToHeadlineData)
          .filter((h): h is HeadlineData => h !== null)
          .filter(h => h.text !== headlineText);

        const success = await updateDatabase(savedHeadlines, userId);
        
        if (success) {
          setSavedHeadlineTexts(prev => {
            const newSet = new Set(prev);
            newSet.delete(headlineText);
            return newSet;
          });
          onInteraction(index, 'save');
          
          toast({
            title: "Success",
            description: "Headline removed from saved collection",
          });
        }
      }
    } catch (error) {
      console.error('Error saving headline:', error);
      toast({
        title: "Error",
        description: "Failed to save headline",
        variant: "destructive",
      });
      
      onInteraction(index, 'save');
    } finally {
      setIsSaving(prev => ({ ...prev, [index]: false }));
    }
  };

  return {
    savedHeadlineTexts,
    handleSave,
    updateDatabase
  };
};
