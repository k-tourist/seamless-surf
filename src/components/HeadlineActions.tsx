
import { Button } from "@/components/ui/button";
import { Settings, Headline } from "@/types";
import { GenerateHeadlinesButton } from "./headline/GenerateHeadlinesButton";
import { RotateCcw, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeadlineActionsProps {
  article: string;
  settings: Settings;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  setArticle: (value: string) => void;
  setActiveTab: (value: string) => void;
  setHeadlines: (value: Headline[] | ((prev: Headline[]) => Headline[])) => void;
  setQueryHistory: (fn: (prev: any[]) => any[]) => void;
  headlines: Headline[];
}

export const HeadlineActions = ({
  article,
  settings,
  isGenerating,
  setIsGenerating,
  setArticle,
  setActiveTab,
  setHeadlines,
  setQueryHistory,
  headlines,
}: HeadlineActionsProps) => {
  const { toast } = useToast();

  const handleReset = async () => {
    try {
      setArticle("");
      setHeadlines([]);
      setActiveTab("url");
      toast({
        description: "Content cleared",
      });
    } catch (error) {
      console.error('Error in handleReset:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset content. Please try again.",
      });
    }
  };

  const handleClearResults = async () => {
    try {
      if (headlines.length === 0) {
        return;
      }
      
      setHeadlines([]);
      toast({
        description: "Results cleared",
      });
    } catch (error) {
      console.error('Error in handleClearResults:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear results. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <GenerateHeadlinesButton
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        article={article}
        settings={settings}
        setHeadlines={setHeadlines}
      />
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleClearResults}
          disabled={headlines.length === 0 || isGenerating}
        >
          <X className="mr-2 h-4 w-4" />
          Clear Results
        </Button>
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleReset}
          disabled={isGenerating}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};
