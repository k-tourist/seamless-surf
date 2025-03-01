
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

interface HeadlineData {
  text: string;
  interactions: {
    saved: boolean;
    thumbsUp: boolean;
    thumbsDown: boolean;
  };
  grade?: string;
}

export const useHeadlineGrading = () => {
  const [grades, setGrades] = useState<{ [key: number]: string }>({});
  const [isGrading, setIsGrading] = useState<{ [key: number]: boolean }>({});
  const [showGradeDetails, setShowGradeDetails] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();

  const handleGrade = async (
    index: number, 
    headlineText: string, 
    savedHeadlineTexts: Set<string>,
    updateDatabase: (data: HeadlineData[], userId: string) => Promise<boolean>,
    isBackground = false
  ) => {
    if (isGrading[index]) return;
    if (!isBackground) {
      setIsGrading(prev => ({ ...prev, [index]: true }));
    }

    try {
      const { data: rubricData, error: rubricError } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'grading_rubric_settings')
        .single();

      if (rubricError) throw rubricError;

      const rubricPrompt = (rubricData?.value as { prompt: string })?.prompt;
      if (!rubricPrompt) throw new Error('No valid rubric prompt found');

      const { data, error } = await supabase.functions.invoke('grade-headline', {
        body: { headline: headlineText, rubricPrompt }
      });

      if (error) throw error;

      const newGrade = data.grade;
      setGrades(prev => ({ ...prev, [index]: newGrade }));

      if (savedHeadlineTexts.has(headlineText)) {
        const { data: currentData } = await supabase
          .from('projects')
          .select('headlines')
          .single();

        if (currentData?.headlines && Array.isArray(currentData.headlines)) {
          const savedHeadlines = currentData.headlines.map((headline: Json) => {
            if (typeof headline === 'object' && headline !== null) {
              return {
                ...headline,
                grade: (headline as any).text === headlineText ? newGrade : (headline as any).grade
              } as HeadlineData;
            }
            return null;
          }).filter((h): h is HeadlineData => h !== null);
          
          if (savedHeadlines.length > 0) {
            await updateDatabase(savedHeadlines, (await supabase.auth.getUser()).data.user?.id || '');
          }
        }
      }

      if (!isBackground) {
        toast({
          title: "Success",
          description: "Headline graded successfully",
        });
      }
    } catch (error) {
      console.error('Error grading headline:', error);
      if (!isBackground) {
        toast({
          title: "Error",
          description: "Failed to grade headline",
          variant: "destructive",
        });
      }
    } finally {
      if (!isBackground) {
        setIsGrading(prev => ({ ...prev, [index]: false }));
      }
    }
  };

  const toggleGradeDetails = (index: number) => {
    setShowGradeDetails(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return {
    grades,
    isGrading,
    showGradeDetails,
    handleGrade,
    toggleGradeDetails
  };
};
