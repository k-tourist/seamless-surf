
import { extractMainTopics, extractMainPoints } from "./contentAnalysis";

export const createProjectName = (text: string = "", url: string = ""): string => {
  if (text.trim()) {
    // Extract key information from the text
    const mainTopics = extractMainTopics(text);
    
    // Use first topic if available
    if (mainTopics.length > 0) {
      const topic = mainTopics[0].charAt(0).toUpperCase() + mainTopics[0].slice(1);
      return topic;
    }
  }
  
  // Default to timestamp-based name if no meaningful content is available
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  return `Project ${timestamp}`;
};
