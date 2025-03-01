
import { useState, useEffect } from "react";
import { Settings } from "@/types";
import HeadlineLayout from "./HeadlineLayout";
import { useProjectState } from "@/hooks/project/useProjectState";
import { useHeadlineState } from "@/hooks/useHeadlineState";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

// Define type for system settings value
interface ModelSettings {
  model: string;
}

const HeadlineGenerator = () => {
  const [settings, setSettings] = useState<Settings>({
    model: "",
    style: "email-subject",
    tone: "professional",
    wordCount: "10",
    focusWords: "",
    wordOmissions: "",
    randomness: "medium",
    useEmoji: "no"
  });

  const { session } = useAuth();

  // Load saved settings including model on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // First try to get the model from localStorage
        const savedSettings = localStorage.getItem('headlineSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(prevSettings => ({
            ...prevSettings,
            ...parsedSettings
          }));
        }

        // Then check if there's a model set in the database
        const { data: modelData } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'default_ai_model')
          .maybeSingle();

        if (modelData?.value) {
          // Type guard to check if value is an object with a model property
          const rawValue = modelData.value as { [key: string]: unknown };
          if (typeof rawValue === 'object' && rawValue !== null && 'model' in rawValue) {
            const modelString = String(rawValue.model); // Convert to string explicitly
            console.log('Loading model from database:', modelString);
            setSettings(prevSettings => ({
              ...prevSettings,
              model: modelString
            }));
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  // When settings change, save them to localStorage
  useEffect(() => {
    localStorage.setItem('headlineSettings', JSON.stringify(settings));
  }, [settings]);

  const {
    article,
    url,
    setUrl,
    isCrawling,
    isGenerating,
    setIsGenerating,
    headlines: generatedHeadlines,
    setHeadlines: setGeneratedHeadlines,
    activeTab,
    setActiveTab,
    handleUrlSubmit,
    handleTextSubmit,
    handleGenerateHeadlines,
    setQueryHistory,
    queryHistory,
    handleNewProject,
    isNewProject,
    currentProjectId,
    handleProjectSelect
  } = useProjectState();

  const {
    headlines,
    isLoading,
    handleInteraction,
    updateHeadlines
  } = useHeadlineState({
    initialHeadlines: generatedHeadlines,
    projectId: currentProjectId,
    userId: session?.user?.id || null
  });

  const handleHeadlinesUpdate = (newHeadlines: typeof headlines) => {
    setGeneratedHeadlines(newHeadlines);
    updateHeadlines(newHeadlines);
  };

  const handleSettingsChange = (newSettings: Settings) => {
    console.log('Settings updated:', newSettings);
    setSettings(newSettings);
  };

  return (
    <HeadlineLayout
      url={url}
      article={article}
      activeTab={activeTab}
      isCrawling={isCrawling}
      isGenerating={isGenerating}
      headlines={headlines}
      settings={settings}
      onUrlChange={setUrl}
      onArticleChange={handleTextSubmit}
      onTabChange={setActiveTab}
      onCrawl={handleUrlSubmit}
      onNewProject={handleNewProject}
      onSettingsChange={handleSettingsChange}
      onGenerate={() => handleGenerateHeadlines(settings)}
      onHeadlineInteraction={handleInteraction}
      setIsGenerating={setIsGenerating}
      setHeadlines={handleHeadlinesUpdate}
      setQueryHistory={setQueryHistory}
      queryHistory={queryHistory}
      onProjectSelect={handleProjectSelect}
      isNewProject={isNewProject}
      currentProjectId={currentProjectId}
    />
  );
};

export default HeadlineGenerator;
