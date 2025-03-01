import { Settings } from '@/types';
import { extractMainPoints } from '../contentAnalysis';

export const generateStyleBasedHeadline = async (
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
      headline = `Breaking: Trump to Remove ${mainPoints.target} in Major Overhaul`;
    } else {
      headline = `EXCLUSIVE: Trump's Plan to Transform ${mainPoints.scope} Leadership`;
    }
  } else {
    if (inclusionWords.length > 0 && content.toLowerCase().includes(inclusionWords[0].toLowerCase())) {
      headline = `Trump Announces Sweeping Changes to ${mainPoints.target} Structure`;
    } else {
      headline = `Trump Unveils Major ${mainPoints.scope} Restructuring Plan`;
    }
  }

  return settings?.useEmoji !== 'no' ? `${settings.useEmoji} ${headline}` : headline;
};