
import { Button } from "@/components/ui/button";
import { Save, ThumbsUp, ThumbsDown, Copy, ClipboardCheck } from "lucide-react";

interface HeadlineActionsProps {
  isGrading: boolean;
  isSaved: boolean;
  isThumbsUp: boolean;
  isThumbsDown: boolean;
  onGrade: () => void;
  onSave: () => void;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  onCopy: () => void;
}

export const HeadlineActions = ({
  isGrading,
  isSaved,
  isThumbsUp,
  isThumbsDown,
  onGrade,
  onSave,
  onThumbsUp,
  onThumbsDown,
  onCopy
}: HeadlineActionsProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onGrade}
        disabled={isGrading}
        className={isGrading ? "opacity-50" : ""}
      >
        <ClipboardCheck className={`h-4 w-4 ${isGrading ? "animate-pulse" : ""}`} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onSave}
        className={isSaved ? "bg-primary/10 hover:bg-primary/20" : ""}
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onThumbsUp}
        className={isThumbsUp ? "text-[#1EAEDB] hover:text-[#1EAEDB]/80" : ""}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onThumbsDown}
        className={isThumbsDown ? "text-[#ea384c] hover:text-[#ea384c]/80" : ""}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-blue-500/10 transition-colors"
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </>
  );
};
