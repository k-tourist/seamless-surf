import { Settings } from '@/types';
import { extractMainPoints } from '../contentAnalysis';

export const generateActionHeadline = async (
  content: string,
  topics: string,
  phrases: string,
  stylePrompt: string,
  settings?: Settings
): Promise<string> => {
  const mainPoints = extractMainPoints(content);
  const inclusionWords = settings?.focusWords?.split(',').map(w => w.trim()).filter(Boolean) || [];
  
  let headline = '';
  
  if (settings?.style === 'email-subject') {
    if (inclusionWords.length > 0 && content.toLowerCase().includes(inclusionWords[0].toLowerCase())) {
      headline = `Just In: Trump's Bold Move to Reshape Federal Leadership`;
    } else {
      headline = `Alert: Major Changes Coming to ${mainPoints.scope} Structure`;
    }
  } else {
    if (inclusionWords.length > 0 && content.toLowerCase().includes(inclusionWords[0].toLowerCase())) {
      headline = `Trump Takes Action: Sweeping Changes to ${mainPoints.scope}`;
    } else {
      headline = `Breaking: Trump Announces Major ${mainPoints.scope} Overhaul`;
    }
  }

  return settings?.useEmoji !== 'no' ? `${settings.useEmoji} ${headline}` : headline;
};