
import { Headline, Settings } from "@/types";
import { useState } from "react";

export const useHeadlineStorage = (
  headlines: Headline[],
  setHeadlines: (headlines: Headline[]) => void,
  savedHeadlines: Headline[],
  setSavedHeadlines: (headlines: Headline[]) => void
) => {
  const handleSaveInteraction = (targetHeadline: Headline) => {
    const isAlreadySaved = savedHeadlines.some(h => h.text === targetHeadline.text);
    
    if (!isAlreadySaved && !targetHeadline.interactions.saved) {
      // Add to saved headlines
      setSavedHeadlines([...savedHeadlines, { ...targetHeadline, interactions: { ...targetHeadline.interactions, saved: true } }]);
      
      // Remove from regular headlines if it exists there
      setHeadlines(headlines.filter(h => h.text !== targetHeadline.text));
    } else if (isAlreadySaved) {
      // Remove from saved headlines
      setSavedHeadlines(savedHeadlines.filter(h => h.text !== targetHeadline.text));
      
      // Add back to regular headlines if it was originally there
      const wasInHeadlines = headlines.some(h => h.text === targetHeadline.text);
      if (wasInHeadlines) {
        setHeadlines([...headlines, { ...targetHeadline, interactions: { ...targetHeadline.interactions, saved: false } }]);
      }
    }
  };

  return { handleSaveInteraction };
};
