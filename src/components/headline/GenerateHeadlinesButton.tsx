
import { Button } from "@/components/ui/button";
import { Settings, Headline } from "@/types";
import { Wand2 } from "lucide-react";
import { useHeadlineCreation } from "@/hooks/useHeadlineCreation";
import { useToast } from "@/hooks/use-toast";

interface GenerateHeadlinesButtonProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  article: string;
  settings: Settings;
  setHeadlines: (value: Headline[] | ((prev: Headline[]) => Headline[])) => void;
}

export const GenerateHeadlinesButton = ({
  isGenerating,
  setIsGenerating,
  article,
  settings,
  setHeadlines,
}: GenerateHeadlinesButtonProps) => {
  const { toast } = useToast();
  const { generateHeadlines } = useHeadlineCreation();

  const handleGenerate = async () => {
    if (!article.trim()) {
      toast({
        variant: "destructive",
        description: "Please provide some content first",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const generatedHeadlines = await generateHeadlines(article, settings);
      
      if (!Array.isArray(generatedHeadlines)) {
        throw new Error('Invalid response format from headline generation');
      }

      const newHeadlines: Headline[] = generatedHeadlines.map(headline => ({
        text: headline.text,
        interactions: {
          saved: false,
          thumbsUp: false,
          thumbsDown: false
        }
      }));

      setHeadlines(newHeadlines);
      
      toast({
        description: `Generated ${newHeadlines.length} headlines successfully`,
      });
    } catch (error) {
      console.error('Error generating headlines:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate headlines. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 bg-[#0EA5E9] text-white hover:bg-[#0990D5]"
      onClick={handleGenerate}
      disabled={isGenerating}
    >
      <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
      {isGenerating ? 'Generating...' : 'Generate Headlines'}
    </Button>
  );
};
