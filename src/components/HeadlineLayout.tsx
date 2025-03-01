
import { Settings, Headline } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import QueryHistory from "./QueryHistory";
import HeaderSection from "./HeaderSection";
import { useTheme } from "next-themes";
import HeadlineControls from "./HeadlineControls";
import HeadlineSettings from "./HeadlineSettings";
import HeadlineResults from "./HeadlineResults";
import { HeadlineActions } from "./HeadlineActions";

interface HeadlineLayoutProps {
  url: string;
  article: string;
  activeTab: string;
  isCrawling: boolean;
  isGenerating: boolean;
  headlines: Headline[];
  settings: Settings;
  onUrlChange: (url: string) => void;
  onArticleChange: (article: string) => void;
  onTabChange: (tab: string) => void;
  onCrawl: () => Promise<void>;
  onNewProject: () => void;
  onSettingsChange: (settings: Settings) => void;
  onGenerate: () => void;
  onHeadlineInteraction: (index: number, type: 'save' | 'thumbsUp' | 'thumbsDown') => void;
  setIsGenerating: (value: boolean) => void;
  setHeadlines: (value: Headline[] | ((prev: Headline[]) => Headline[])) => void;
  setQueryHistory: (fn: (prev: any[]) => any[]) => void;
  queryHistory: Array<{
    id: string;
    name: string;
    text?: string;
    url?: string;
    timestamp: Date;
    headlines?: Headline[];
    settings?: Settings;
  }>;
  onProjectSelect: (projectId: string) => void;
  isNewProject: boolean;
  currentProjectId: string | null;
}

const HeadlineLayout = ({
  url,
  article,
  activeTab,
  isCrawling,
  isGenerating,
  headlines,
  settings,
  onUrlChange,
  onArticleChange,
  onTabChange,
  onCrawl,
  onNewProject,
  onSettingsChange,
  onGenerate,
  onHeadlineInteraction,
  setIsGenerating,
  setHeadlines,
  setQueryHistory,
  queryHistory,
  onProjectSelect,
  isNewProject,
  currentProjectId
}: HeadlineLayoutProps) => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const { toast } = useToast();

  const handleInactiveGenerate = () => {
    toast({
      description: "Please select a Recent Project or Create a New Project first",
      duration: 4000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <header className="w-full sticky top-0 z-50 bg-[#0EA5E9]">
        <div className="container py-6 lg:py-8">
          <HeaderSection 
            isDarkMode={isDarkMode} 
            onThemeToggle={() => setTheme(isDarkMode ? "light" : "dark")} 
          />
        </div>
      </header>

      <main className="container py-5">
        <div className="flex gap-5">
          <Card className="w-[300px] shrink-0">
            <div className="space-y-4 p-5">
              <h2 className="text-xl font-semibold leading-none tracking-tight">Recent Projects</h2>
              <QueryHistory 
                queries={queryHistory} 
                onProjectSelect={onProjectSelect}
                currentProjectId={currentProjectId}
              />
            </div>
          </Card>

          <div className="flex-1 space-y-8 min-w-0">
            <Card>
              <div className="p-5">
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
              </div>
            </Card>
            {currentProjectId && (
              <Card>
                <div className="space-y-8 p-5">
                  <h2 className="text-xl font-semibold leading-none tracking-tight">Generation Settings</h2>
                  <HeadlineSettings
                    settings={settings}
                    onSettingsChange={onSettingsChange}
                  />
                </div>
              </Card>
            )}
          </div>

          <Card className="w-full max-w-[500px] shrink-0">
            <div className="p-5">
              {currentProjectId ? (
                <div className="space-y-8">
                  <HeadlineActions
                    article={article}
                    settings={settings}
                    isGenerating={isGenerating}
                    setIsGenerating={setIsGenerating}
                    setArticle={onArticleChange}
                    setActiveTab={onTabChange}
                    setHeadlines={setHeadlines}
                    setQueryHistory={setQueryHistory}
                    headlines={headlines}
                  />
                  {headlines.length > 0 ? (
                    <HeadlineResults
                      headlines={headlines}
                      onInteraction={onHeadlineInteraction}
                      currentProjectId={currentProjectId}
                    />
                  ) : (
                    <div className="flex justify-center mt-4 rounded-lg p-4">
                      <img 
                        src="/lovable-uploads/970889c0-d032-4978-8ea2-dd0d62dbf139.png" 
                        alt="Logo" 
                        className={`w-[250px] ${isDarkMode ? 'opacity-50' : 'opacity-100 bg-gray-200/75 p-4 rounded-lg'}`}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-8">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div 
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-200/75 dark:bg-gray-800/50 text-[#999] dark:text-[#333] hover:bg-gray-300/75 dark:hover:bg-gray-700/50 cursor-pointer border border-input"
                          onClick={handleInactiveGenerate}
                        >
                          <Wand2 className="h-4 w-4" />
                          Generate Headlines
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create a new project or select an existing one from the history to get started</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex justify-center mt-4 rounded-lg p-4">
                    <img 
                      src="/lovable-uploads/970889c0-d032-4978-8ea2-dd0d62dbf139.png" 
                      alt="Logo" 
                      className={`w-[250px] ${isDarkMode ? 'opacity-50' : 'opacity-100 bg-gray-200/75 p-4 rounded-lg'}`}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HeadlineLayout;
