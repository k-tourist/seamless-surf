
import { useToast } from "@/hooks/use-toast";

export const useFeedbackManagement = () => {
  const { toast } = useToast();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Headline copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy headline",
        variant: "destructive",
      });
    }
  };

  return { handleCopy };
};
