
import { useToast } from "@/hooks/use-toast";
import { Settings, Headline } from "@/types";
import { useHeadlineCreation } from "../useHeadlineCreation";
import { useProjectOperations } from "../useProjectOperations";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

const convertJsonToHeadline = (json: Json): Headline | null => {
  if (typeof json === 'object' && json !== null) {
    const obj = json as any;
    if (typeof obj.text === 'string' && typeof obj.interactions === 'object') {
      return {
        text: obj.text,
        interactions: {
          saved: !!obj.interactions.saved,
          thumbsUp: !!obj.interactions.thumbsUp,
          thumbsDown: !!obj.interactions.thumbsDown
        }
      };
    }
  }
  return null;
};

export const useProjectActions = (
  setArticle: (text: string) => void,
  setUrl: (url: string) => void,
  setHeadlines: (headlines: Headline[]) => void,
  setSavedHeadlines: (headlines: Headline[]) => void,
  setActiveTab: (tab: string) => void,
  setIsNewProject: (isNew: boolean) => void,
  setCurrentProjectId: (projectId: string | null) => void,
  setQueryHistory: (history: any) => void,
  performCrawl: (url: string) => Promise<string | null>,
  currentProjectId: string | null,
  url: string,
  article: string
) => {
  const { toast } = useToast();
  const { updateProject } = useProjectOperations(null);

  const handleTextSubmit = async (text: string) => {
    setArticle(text);
    setIsNewProject(false);

    if (currentProjectId && text.trim()) {
      await updateProject(currentProjectId, {
        text,
      });
    }
  };

  const handleUrlSubmit = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL first",
        variant: "destructive",
      });
      return;
    }

    const text = await performCrawl(url);
    if (text) {
      setArticle(text);
      setActiveTab("text");
      setIsNewProject(false);

      if (currentProjectId) {
        await updateProject(currentProjectId, {
          text,
          url,
        });
      }
    }
  };

  const handleGenerateHeadlines = async (settings: Settings) => {
    try {
      const { generateHeadlines } = useHeadlineCreation();
      
      // First, get currently saved headlines from the database
      const { data: projectData } = await supabase
        .from('projects')
        .select('headlines')
        .eq('id', currentProjectId)
        .maybeSingle();

      // Extract saved headlines and ensure they stay saved
      const savedHeadlines = (projectData?.headlines as Json[] || [])
        .map(convertJsonToHeadline)
        .filter((h): h is Headline => h !== null)
        .filter(h => h.interactions.saved);

      console.log('Currently saved headlines:', savedHeadlines.length);

      // Generate new headlines
      const newHeadlines = await generateHeadlines(article, settings);
      console.log('Generated new headlines:', newHeadlines.length);

      // Filter out any new headlines that match saved ones to prevent duplicates
      const uniqueNewHeadlines = newHeadlines
        .filter(newH => !savedHeadlines.some(savedH => savedH.text === newH.text))
        .map(h => ({
          text: h.text,
          interactions: { saved: false, thumbsUp: false, thumbsDown: false }
        }));

      // Combine saved headlines (at the top) with new unique headlines
      const mergedHeadlines = [
        ...savedHeadlines,  // Saved headlines first
        ...uniqueNewHeadlines  // New headlines after
      ];

      console.log('Total headlines after merge:', mergedHeadlines.length);
      console.log('Saved headlines preserved:', savedHeadlines.length);

      // Update state with all headlines and saved headlines
      setHeadlines(mergedHeadlines);
      setSavedHeadlines(savedHeadlines);

      // Update the database if we have a project
      if (currentProjectId) {
        await updateProject(currentProjectId, {
          headlines: mergedHeadlines,
          settings
        });
      }

      setIsNewProject(false);
    } catch (error) {
      console.error('Error generating headlines:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate headlines",
      });
    }
  };

  return {
    handleTextSubmit,
    handleUrlSubmit,
    handleGenerateHeadlines,
  };
};
