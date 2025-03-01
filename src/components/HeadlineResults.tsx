
import { Headline } from "@/types";
import { useAuth } from "@/components/AuthProvider";
import { HeadlineCard } from "./headline/HeadlineCard";
import { HeadlineActions } from "./headline/HeadlineActions";
import { useHeadlineStorage } from "@/hooks/headline/useHeadlineStorage";
import { useHeadlineGrading } from "@/hooks/headline/useHeadlineGrading";
import { useFeedbackManagement } from "@/hooks/interactions/useFeedbackManagement";

interface HeadlineResultsProps {
  headlines: Headline[];
  onInteraction: (index: number, type: 'save' | 'thumbsUp' | 'thumbsDown') => void;
  currentProjectId: string;
}

const HeadlineResults = ({ headlines, onInteraction, currentProjectId }: HeadlineResultsProps) => {
  const { session } = useAuth();
  
  const {
    savedHeadlineTexts,
    handleSave,
    updateDatabase
  } = useHeadlineStorage(currentProjectId, headlines);

  const {
    grades,
    isGrading,
    showGradeDetails,
    handleGrade,
    toggleGradeDetails
  } = useHeadlineGrading();

  const { handleCopy } = useFeedbackManagement();

  return (
    <div className="space-y-3">
      {headlines.map((headline, index) => (
        <HeadlineCard
          key={index}
          headline={headline}
          index={index}
          grade={grades[index]}
          showGradeDetails={showGradeDetails[index]}
          onToggleGradeDetails={() => toggleGradeDetails(index)}
        >
          <HeadlineActions
            isGrading={isGrading[index]}
            isSaved={headline.interactions.saved}
            isThumbsUp={headline.interactions.thumbsUp}
            isThumbsDown={headline.interactions.thumbsDown}
            onGrade={() => handleGrade(index, headline.text, savedHeadlineTexts, updateDatabase)}
            onSave={() => handleSave(
              index, 
              session?.user?.id, 
              onInteraction,
              (idx) => grades[idx],
              (idx, text, isBackground) => handleGrade(idx, text, savedHeadlineTexts, updateDatabase, isBackground)
            )}
            onThumbsUp={() => onInteraction(index, 'thumbsUp')}
            onThumbsDown={() => onInteraction(index, 'thumbsDown')}
            onCopy={() => handleCopy(headline.text)}
          />
        </HeadlineCard>
      ))}
    </div>
  );
};

export default HeadlineResults;
