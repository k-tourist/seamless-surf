import { useState } from "react";
import { Settings, Headline } from "@/types";
import { useCrawlHandler } from "../useCrawlHandler";
import { useHeadlineCreation } from "../useHeadlineCreation";
import { useProjectHistory } from "./useProjectHistory";
import { useProjectActions } from "./useProjectActions";
import { useProjectLoader } from "./useProjectLoader";
import { useProjectCreation } from "./useProjectCreation";
import { useAuth } from "@/components/AuthProvider";

export const useProjectState = () => {
  const [article, setArticle] = useState("");
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [savedHeadlines, setSavedHeadlines] = useState<Headline[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  const { session } = useAuth();
  const { isCrawling, performCrawl } = useCrawlHandler();
  const { isGenerating, setIsGenerating, generateHeadlines } = useHeadlineCreation();
  const { queryHistory, setQueryHistory, headlineCounts } = useProjectHistory(session?.user?.id);

  const resetState = () => {
    setArticle("");
    setUrl("");
    setHeadlines([]);
    setSavedHeadlines([]);
    setActiveTab("url");
  };

  const { handleProjectSelect: loaderProjectSelect } = useProjectLoader(
    setArticle,
    setUrl,
    setHeadlines,
    setSavedHeadlines,
    setActiveTab,
    setIsNewProject,
    setCurrentProjectId,
    resetState
  );

  const { handleNewProject } = useProjectCreation(
    session,
    setCurrentProjectId,
    setIsNewProject,
    resetState,
    setQueryHistory
  );

  const {
    handleTextSubmit: projectTextSubmit,
    handleUrlSubmit: projectUrlSubmit,
    handleGenerateHeadlines: projectGenerateHeadlines,
  } = useProjectActions(
    setArticle,
    setUrl,
    setHeadlines,
    setSavedHeadlines,
    setActiveTab,
    setIsNewProject,
    setCurrentProjectId,
    setQueryHistory,
    performCrawl,
    currentProjectId,
    url,
    article
  );

  const handleProjectSelect = async (projectId: string) => {
    if (!projectId) {
      console.error('No project ID provided to handleProjectSelect');
      return;
    }
    console.log("Project select called with ID:", projectId);
    await loaderProjectSelect(projectId);
  };

  const handleTextSubmit = async (text: string) => {
    await projectTextSubmit(text);
  };

  const handleUrlSubmit = async () => {
    await projectUrlSubmit();
  };

  const handleGenerateHeadlines = async (settings: Settings) => {
    await projectGenerateHeadlines(settings);
  };

  return {
    article,
    setArticle,
    url,
    setUrl,
    activeTab,
    setActiveTab,
    headlines,
    setHeadlines,
    savedHeadlines,
    setSavedHeadlines,
    isCrawling,
    isGenerating,
    setIsGenerating,
    handleUrlSubmit,
    handleTextSubmit,
    handleGenerateHeadlines,
    handleProjectSelect,
    handleNewProject,
    queryHistory,
    setQueryHistory,
    isNewProject,
    currentProjectId,
    resetState,
    headlineCounts
  };
};
