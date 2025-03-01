import { Settings } from '@/types';
import { extractMainPoints } from '../contentAnalysis';

export const generateTopicBasedHeadline = async (
  content: string,
  topics: string,
  phrases: string,
  entities: string,
  stylePrompt: string,
  settings?: Settings
): Promise<string> => {
  const mainPoints = extractMainPoints(content);
  const inclusionWords = settings?.focusWords?.split(',').map(w => w.trim()).filter(Boolean) || [];
  
  let headline = '';
  
  if (settings?.style === 'email-subject') {
    if (inclusionWords.length > 0 && content.toLowerCase().includes(inclusionWords[0].toLowerCase())) {
      headline = `"America First" Agenda: Key Personnel Changes Coming`;
    } else {
      headline = `MAGA Vision: Reshaping Federal Leadership`;
    }
  } else {
    if (inclusionWords.length > 0 && content.toLowerCase().includes(inclusionWords[0].toLowerCase())) {
      headline = `Trump's MAGA Strategy: Realigning ${mainPoints.scope} Leadership`;
    } else {
      headline = `Trump's Vision: Transforming ${mainPoints.scope} Through Personnel Changes`;
    }
  }

  return settings?.useEmoji !== 'no' ? `${settings.useEmoji} ${headline}` : headline;
};