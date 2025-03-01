
import { useToast } from "@/hooks/use-toast";
import { Settings, Headline } from "@/types";
import { useProjectOperations } from "../useProjectOperations";
import { Session } from "@supabase/supabase-js";
import { createProjectName } from "@/utils/projectUtils";

export const useProjectContent = (
  session: Session | null,
  setArticle: (text: string) => void,
  setActiveTab: (tab: string) => void,
  setIsNewProject: (isNew: boolean) => void,
  setHeadlines: (headlines: Headline[]) => void,
  currentProjectId: string | null,
  url: string
) => {
  const { toast } = useToast();
  const { updateProject } = useProjectOperations(session);

  const handleTextSubmit = async (text: string) => {
    setArticle(text);
    setIsNewProject(false);
    
    if (currentProjectId && text.trim()) {
      await updateProject(currentProjectId, { 
        text,
      });
    }
  };

  const handleUrlSubmit = async (performCrawl: (url: string) => Promise<string | null>) => {
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

  const handleGenerateHeadlines = async (
    article: string,
    settings: Settings,
    generateHeadlines: (text: string, settings: Settings) => Promise<Headline[]>
  ) => {
    if (!article.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content first",
        variant: "destructive",
      });
      return;
    }

    const newHeadlines = await generateHeadlines(article, settings);
    if (newHeadlines.length > 0) {
      const updatedHeadlines = [...newHeadlines];
      setHeadlines(updatedHeadlines);
      setIsNewProject(false);

      if (currentProjectId) {
        await updateProject(currentProjectId, {
          headlines: updatedHeadlines,
          settings
        });
      }
    }
  };

  return {
    handleTextSubmit,
    handleUrlSubmit,
    handleGenerateHeadlines
  };
};
