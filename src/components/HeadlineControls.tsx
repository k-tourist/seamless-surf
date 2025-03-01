
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import UrlInputSection from "./UrlInputSection";
import SourceTextSection from "./SourceTextSection";

interface HeadlineControlsProps {
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

const HeadlineControls = ({
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
}: HeadlineControlsProps) => {
  if (!currentProjectId && !isNewProject) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold leading-none tracking-tight">Welcome to Headline Studio</h2>
          <p className="text-sm text-muted-foreground">
            Create a new project or select an existing one from the history to get started
          </p>
          <Button onClick={onNewProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold leading-none tracking-tight">Source Input</h2>
          <p className="text-sm text-muted-foreground">
            {isNewProject 
              ? "Enter a URL to crawl content or paste your source text directly" 
              : "Working on existing project"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="mt-8">
          <UrlInputSection
            url={url}
            onUrlChange={onUrlChange}
            onCrawl={onCrawl}
            isCrawling={isCrawling}
            onTabChange={onTabChange}
            isNewProject={isNewProject}
          />
        </TabsContent>
        <TabsContent value="text" className="mt-8">
          <SourceTextSection 
            article={article} 
            onArticleChange={onArticleChange}
            isCrawling={isCrawling}
            isNewProject={isNewProject}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeadlineControls;
