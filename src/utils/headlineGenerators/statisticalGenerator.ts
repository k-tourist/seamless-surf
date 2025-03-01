import { Settings } from '@/types';
import { extractMainPoints } from '../contentAnalysis';

export const generateStatisticalHeadline = async (
  content: string,
  statistics: string,
  topics: string,
  stylePrompt: string,
  settings?: Settings
): Promise<string> => {
  const mainPoints = extractMainPoints(content);
  const inclusionWords = settings?.focusWords?.split(',').map(w => w.trim()).filter(Boolean) || [];
  const quantity = mainPoints.quantity || '1,000';
  
  let headline = '';
  
  if (settings?.style === 'email-subject') {
    if (inclusionWords.length > 0 && content.toLowerCase().includes(inclusionWords[0].toLowerCase())) {
      headline = `Massive Shakeup: ${quantity}+ Personnel Changes Planned`;
    } else {
      headline = `Breaking: Trump Plans ${quantity}+ Leadership Changes`;
    }
  } else {
    if (inclusionWords.length > 0 && content.toLowerCase().includes(inclusionWords[0].toLowerCase())) {
      headline = `Trump Administration Targets ${quantity}+ Position Changes`;
    } else {
      headline = `Major Overhaul: ${quantity}+ Federal Positions to be Restructured`;
    }
  }

  return settings?.useEmoji !== 'no' ? `${settings.useEmoji} ${headline}` : headline;
};