
import { Settings } from "@/types";
import HeadlineControls from "../HeadlineControls";

interface HeadlineInputPanelProps {
  url: string;
  article: string;
  activeTab: string;
  isCrawling: boolean;
  onUrlChange: (url: string) => void;
  onArticleChange: (text: string) => void;
  onTabChange: (value: string) => void;
  onCrawl: () => Promise<void>;
  onNewProject: () => void;
  isNewProject: boolean;
  currentProjectId: string | null;
}

const HeadlineInputPanel = ({
  url,
  article,
  activeTab,
  isCrawling,
  onUrlChange,
  onArticleChange,
  onTabChange,
  onCrawl,
  onNewProject,
  isNewProject,
  currentProjectId,
}: HeadlineInputPanelProps) => {
  return (
    <div className="space-y-4">
      <HeadlineControls
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

      {!isNewProject && currentProjectId && (article || url) && (
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <h3 className="text-sm font-medium">Current Project Details</h3>
          {url && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">URL</p>
              <p className="text-sm break-all">{url}</p>
            </div>
          )}
          {article && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Content</p>
              <p className="text-sm break-words line-clamp-4">{article}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeadlineInputPanel;
