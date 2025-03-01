
export interface Settings {
  model: string;
  style: string;
  tone: string;
  wordCount: string;
  focusWords: string;
  wordOmissions: string;
  randomness: string;
  useEmoji: string;
}

export interface Headline {
  text: string;
  interactions: {
    saved: boolean;
    thumbsUp: boolean;
    thumbsDown: boolean;
  };
}

export interface StylePrompt {
  id: string;
  name: string;
  prompt: string;
  created_at: string;
  updated_at: string;
  is_global: boolean;
  user_id: string | null;
  category: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  timezone: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type HeadlineSettings = Settings;

export interface CrawlResponse {
  success: boolean;
  text?: string;
  error?: string;
  data?: Array<{
    markdown: string;
    [key: string]: any;
  }>;
}

export interface CrawlHandlerParams {
  url: string;
  setIsCrawling: (value: boolean) => void;
  setArticle: (value: string) => void;
  setActiveTab: (value: string) => void;
  toast: any;
}
