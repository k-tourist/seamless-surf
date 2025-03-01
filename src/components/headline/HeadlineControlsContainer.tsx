
import { Settings } from "@/types";
import HeadlineInputPanel from "./HeadlineInputPanel";
import HeadlineSettingsPanel from "./HeadlineSettingsPanel";

interface HeadlineControlsContainerProps {
  url: string;
  article: string;
  activeTab: string;
  isCrawling: boolean;
  settings: Settings;
  onUrlChange: (url: string) => void;
  onArticleChange: (text: string) => void;
  onTabChange: (value: string) => void;
  onCrawl: () => Promise<void>;
  onNewProject: () => void;
  onSettingsChange: (settings: Settings) => void;
  isNewProject: boolean;
  currentProjectId: string | null;
}

const HeadlineControlsContainer = ({
  url,
  article,
  activeTab,
  isCrawling,
  settings,
  onUrlChange,
  onArticleChange,
  onTabChange,
  onCrawl,
  onNewProject,
  onSettingsChange,
  isNewProject,
  currentProjectId,
}: HeadlineControlsContainerProps) => {
  return (
    <>
      <HeadlineInputPanel
        url={url}
        article={article}
        activeTab={activeTab}
        isCrawling={isCrawling}
        onUrlChange={onUrlChange}
        onArticleChange={onArticleChange}
        onTabChange={onTabChange}
        onCrawl={onCrawl}
        onNewProject={onNewProject}
        isNewProject={isNewProject}
        currentProjectId={currentProjectId}
      />
      <HeadlineSettingsPanel
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </>
  );
};

export default HeadlineControlsContainer;
