
import { Headline } from "@/types";
import { Card } from "../ui/card";
import HeadlineResults from "../HeadlineResults";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface HeadlineResultsPanelProps {
  headlines: Headline[];
  onInteraction: (index: number, type: 'save' | 'thumbsUp' | 'thumbsDown') => void;
  onGenerate: () => void;
  isGenerating: boolean;
  currentProjectId: string;
}

const HeadlineResultsPanel = ({
  headlines,
  onInteraction,
  onGenerate,
  isGenerating,
  currentProjectId,
}: HeadlineResultsPanelProps) => {
  return (
    <Card className="lg:col-span-5 p-8">
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold leading-none tracking-tight">Generated Headlines</h2>
          <Button 
            className="generate-btn"
            size="lg"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Headlines"
            )}
          </Button>
        </div>
        <div className="flex-grow">
          {headlines.length > 0 ? (
            <HeadlineResults 
              headlines={headlines}
              onInteraction={onInteraction}
              currentProjectId={currentProjectId}
            />
          ) : (
            <div className="flex items-center justify-center h-[200px] rounded-lg bg-secondary/50" />
          )}
        </div>
      </div>
    </Card>
  );
};

export default HeadlineResultsPanel;
