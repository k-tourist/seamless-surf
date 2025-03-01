
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

interface SourceTextSectionProps {
  article: string;
  onArticleChange: (text: string) => void;
  isCrawling?: boolean;
  isNewProject: boolean;
}

const SourceTextSection = ({ article, onArticleChange, isCrawling, isNewProject }: SourceTextSectionProps) => {
  const textareaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current && article) {
      const highlightedText = highlightKeyPoints(article);
      textareaRef.current.innerHTML = highlightedText;
    }
  }, [article]);

  const highlightKeyPoints = (text: string): string => {
    const sentences = text.split(/([.!?]+)/).filter(Boolean);
    
    const patterns = [
      /\b(?:most|best|worst|first|last|only|unique|crucial|critical|essential|key|major)\b/i,
      /\b(?:increase|decrease|grow|decline|rise|fall)\b/i,
      /\b(?:\d+(?:\.\d+)?%|\$\d+|\d+\s*(?:million|billion|trillion))\b/i,
      /\b(?:however|although|despite|yet|but|therefore|thus|hence|consequently)\b/i
    ];

    return sentences.map(sentence => {
      let shouldHighlight = patterns.some(pattern => pattern.test(sentence));
      if (shouldHighlight) {
        return `<span class="bg-yellow-100 dark:bg-yellow-900/50">${sentence}</span>`;
      }
      return sentence;
    }).join('');
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (!isNewProject) return;
    const text = e.currentTarget.textContent || '';
    onArticleChange(text);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="article">Source Text</Label>
      <div
        ref={textareaRef}
        contentEditable={isNewProject && !isCrawling}
        className={`min-h-[200px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 whitespace-pre-wrap ${!isNewProject ? 'cursor-not-allowed opacity-75' : ''}`}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ 
          __html: isCrawling 
            ? "Just a moment..." 
            : (article ? highlightKeyPoints(article) : isNewProject ? '' : 'Create a new project to enter new text') 
        }}
      />
    </div>
  );
};

export default SourceTextSection;
