export const extractMainTopics = (text: string): string[] => {
  // Enhanced stopwords list focused on removing analysis-related terms
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he',
    'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
    'analysis', 'research', 'study', 'survey', 'report', 'assessment', 'analyze', 'examine', 'investigate',
    'project', 'data', 'information', 'results', 'findings', 'conclusion', 'summary', 'overview', 'review',
    'way', 'look', 'first', 'also', 'new', 'because', 'day', 'use', 'any', 'find', 'take', 'tell', 'many',
    'us', 'those', 'me', 'back', 'into', 'than', 'most', 'just', 'its', 'over', 'think', 'even', 'may',
    'after', 'down', 'should', 'year', 'before', 'good', 'well', 'where', 'between', 'following', 'which',
    'represents', 'background', 'might', 'come', 'from', 'says', 'view', 'make', 'best', 'thank', 'god',
    'manifested', 'this', 'styles', 'gratitude', 'style', 'come', 'about', 'what', 'how', 'why', 'when',
    'who', 'where', 'analysis', 'research', 'study', 'report', 'overview', 'summary', 'conclusion'
  ]);

  // Clean and tokenize the text
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !commonWords.has(word) &&
      isNaN(Number(word))
    );

  // Count word frequencies
  const wordFreq = words.reduce((acc: Record<string, number>, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  // Return the most frequent words as topics
  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([word]) => word);
};

export const extractMainPoints = (text: string) => {
  const textLower = text.toLowerCase();
  
  // Extract key components from the text
  const result = {
    action: '',
    subject: '',
    target: '',
    scope: '',
    quantity: '',
  };

  // Identify the main action verbs
  const actionVerbs = ['research', 'study', 'analyze', 'assess', 'examine', 'survey'];
  for (const verb of actionVerbs) {
    if (textLower.includes(verb)) {
      result.action = verb;
      break;
    }
  }

  // Identify subjects (common entities)
  const subjects = ['analysis', 'research', 'study', 'survey', 'assessment', 'report'];
  for (const subject of subjects) {
    if (textLower.includes(subject)) {
      result.subject = subject;
      break;
    }
  }

  // Extract the target of the action
  if (textLower.includes('religious')) {
    result.target = 'Religious';
  } else if (textLower.includes('meditation')) {
    result.target = 'Meditation';
  } else if (textLower.includes('spiritual')) {
    result.target = 'Spiritual';
  }

  return result;
};

export const extractKeyPhrases = (text: string): string[] => {
  const phrases = text.match(/\b\w+(?:\s+\w+){1,2}\b/g) || [];
  return Array.from(new Set(phrases))
    .filter(phrase => phrase.length > 10)
    .slice(0, 3)
    .map(phrase => phrase.toLowerCase());
};

export const extractStatistics = (text: string): string[] => {
  const statPattern = /\b\d+(?:\.\d+)?%|\b\d+\s+(?:million|billion|trillion|thousand)|(?:\$\s*)\d+(?:\.\d+)?(?:\s*(?:million|billion|trillion))?\b/gi;
  return Array.from(new Set(text.match(statPattern) || []));
};

export const extractNamedEntities = (text: string): string[] => {
  const capitalizedPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
  return Array.from(new Set(text.match(capitalizedPattern) || []));
};
