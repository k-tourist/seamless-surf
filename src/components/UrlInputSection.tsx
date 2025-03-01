
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Link as LinkIcon } from "lucide-react";

interface UrlInputSectionProps {
  url: string;
  onUrlChange: (url: string) => void;
  onCrawl: () => Promise<void>;
  isCrawling: boolean;
  onTabChange?: (value: string) => void;
  isNewProject: boolean;
}

const UrlInputSection = ({ 
  url, 
  onUrlChange, 
  onCrawl, 
  isCrawling, 
  onTabChange,
  isNewProject 
}: UrlInputSectionProps) => {
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isNewProject) {
      e.preventDefault();
      await handleCrawl();
    }
  };

  const handleCrawl = async () => {
    if (onTabChange) {
      onTabChange("text");
    }
    await onCrawl();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="url">Article URL</Label>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="url"
            type="url"
            placeholder={isNewProject ? "https://example.com/article" : "Create a new project to enter a new URL"}
            className="pl-9"
            value={url}
            onChange={(e) => isNewProject && onUrlChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isNewProject}
          />
        </div>
        <Button 
          onClick={handleCrawl} 
          disabled={isCrawling || !url.trim() || !isNewProject}
          className="min-w-[120px]"
        >
          {isCrawling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Crawling...
            </>
          ) : (
            "Crawl"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UrlInputSection;
