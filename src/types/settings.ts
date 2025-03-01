export interface HeadlineSettingsProps {
  settings: {
    model: string;
    focusWords: string;
    wordOmissions: string;
    tone: string;
    wordCount: string;
    useEmoji: string;
    style: string;
  };
  onSettingsChange: (settings: any) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}