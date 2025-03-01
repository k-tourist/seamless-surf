import { supabase } from "@/integrations/supabase/client";
import { Headline, Settings } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ProjectData {
  id: string;
  name: string;
  text: string | null;
  url: string | null;
  headlines: Headline[];
  settings: Settings | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useProjectLoader = (
  setArticle: (text: string) => void,
  setUrl: (url: string) => void,
  setHeadlines: (headlines: Headline[]) => void,  
  setSavedHeadlines: (headlines: Headline[]) => void,
  setActiveTab: (tab: string) => void,
  setIsNewProject: (isNew: boolean) => void,
  setCurrentProjectId: (id: string | null) => void,
  resetState: () => void
) => {
  const { toast } = useToast();

  const validateHeadline = (headline: any): Headline | null => {
    if (!headline || typeof headline !== 'object') {
      return null;
    }

    return {
      text: typeof headline.text === 'string' ? headline.text : '',
      interactions: {
        saved: Boolean(headline.interactions?.saved),
        thumbsUp: Boolean(headline.interactions?.thumbsUp),
        thumbsDown: Boolean(headline.interactions?.thumbsDown)
      }
    };
  };

  const validateSettings = (data: any): Settings | null => {
    if (!data) return null;
    
    return {
      model: data.model || "",
      style: data.style || "",
      tone: data.tone || "",
      wordCount: data.wordCount || "",
      focusWords: "", 
      wordOmissions: "", 
      randomness: data.randomness || "",
      useEmoji: data.useEmoji || ""
    };
  };

  const loadProject = async (projectId: string): Promise<ProjectData | null> => {
    if (!projectId) {
      console.error('No project ID provided to loadProject');
      return null;
    }

    console.log("Loading project with ID:", projectId);

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (error) {
      console.error('Error loading project:', error);
      throw error;
    }

    if (!data) return null;

    // Load only saved headlines when returning to the project
    const savedHeadlines = Array.isArray(data.headlines) 
      ? data.headlines
          .map(validateHeadline)
          .filter((h): h is Headline => h !== null)
          .filter(h => h.interactions.saved)
      : [];

    console.log('Loaded saved headlines from database:', savedHeadlines.length);

    return {
      ...data,
      headlines: savedHeadlines, // Only return saved headlines
      settings: validateSettings(data.settings)
    } as ProjectData;
  };

  const handleProjectSelect = async (projectId: string) => {
    if (!projectId) {
      console.error('No project ID provided to handleProjectSelect');
      return;
    }

    try {
      resetState();
      
      const project = await loadProject(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }

      setCurrentProjectId(project.id);
      setIsNewProject(false);

      if (project.text) {
        setArticle(project.text);
        setActiveTab("text");
      }

      if (project.url) {
        setUrl(project.url);
        if (!project.text) {
          setActiveTab("url");
        }
      }

      // Only load saved headlines when returning to project
      const savedHeadlines = project.headlines || [];
      
      console.log('Setting saved headlines:', savedHeadlines.length);
      
      setHeadlines(savedHeadlines);
      setSavedHeadlines(savedHeadlines);

      toast({
        title: "Project Loaded",
        description: `Project "${project.name}" loaded successfully`,
      });
    } catch (error) {
      console.error('Error in handleProjectSelect:', error);
      resetState();
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
    }
  };

  return { handleProjectSelect };
};
