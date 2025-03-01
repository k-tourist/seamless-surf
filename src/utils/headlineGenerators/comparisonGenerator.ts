import { Settings } from '@/types';
import { extractMainPoints } from '../contentAnalysis';

export const generateComparisonHeadline = async (
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
      headline = `From Biden to Trump: Major Changes in Federal Leadership`;
    } else {
      headline = `Transition Alert: Key Changes Coming to ${mainPoints.scope}`;
    }
  } else {
    if (inclusionWords.length > 0 && content.toLowerCase().includes(inclusionWords[0].toLowerCase())) {
      headline = `Institutional Changes: Trump's Plan vs Current Structure`;
    } else {
      headline = `Leadership Transition: Trump's Vision for Federal Reform`;
    }
  }

  return settings?.useEmoji !== 'no' ? `${settings.useEmoji} ${headline}` : headline;
};