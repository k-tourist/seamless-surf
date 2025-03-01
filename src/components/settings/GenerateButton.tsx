import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GenerateButtonProps {
  onGenerate?: () => void;
  isGenerating?: boolean;
}

const GenerateButton = ({ onGenerate, isGenerating }: GenerateButtonProps) => {
  if (!onGenerate) return null;

  return (
    <Button
      onClick={onGenerate}
      disabled={isGenerating}
      className="w-full"
      size="lg"
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
  );
};

export default GenerateButton;