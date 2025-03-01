
import { Headline } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionMarkIcon from "../icons/QuestionMarkIcon";

interface HeadlineCardProps {
  headline: Headline;
  index: number;
  grade?: string;
  showGradeDetails: boolean;
  onToggleGradeDetails: () => void;
  children: React.ReactNode;
}

export const HeadlineCard = ({
  headline,
  index,
  grade,
  showGradeDetails,
  onToggleGradeDetails,
  children
}: HeadlineCardProps) => {
  const extractGradeScore = (gradeText: string) => {
    const match = gradeText.match(/(\d+)\/(\d+)/);
    return match ? match[0] : "";
  };

  const renderHeadlineText = (text: string) => {
    if (text.startsWith('❔')) {
      return (
        <div className="flex items-center gap-2">
          <QuestionMarkIcon size={20} />
          <span className="font-bold">{text.substring(2)}</span>
        </div>
      );
    }
    return <p className="flex-grow pr-4 font-bold">{text}</p>;
  };

  const gradeScore = grade ? extractGradeScore(grade) : "";

  return (
    <div
      className={`p-4 rounded-lg transition-all duration-200 ${
        headline.interactions.saved 
          ? 'bg-primary/5 border border-primary/20' 
          : 'bg-secondary hover:bg-secondary/80'
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          {renderHeadlineText(headline.text)}
        </div>
        <div className="flex gap-2 justify-end items-center">
          {headline.interactions.saved && gradeScore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleGradeDetails}
              className="mr-auto font-mono text-sm"
            >
              Grade: {gradeScore}
              {showGradeDetails ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
          )}
          {children}
        </div>
        {headline.interactions.saved && grade && showGradeDetails && (
          <div className="mt-2 p-3 bg-secondary/50 rounded-md text-sm">
            <pre className="whitespace-pre-wrap font-mono text-xs">{grade}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
