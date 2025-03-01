
import { supabase } from "@/integrations/supabase/client";

export const getPromptByCategory = async (name: string, category: string): Promise<string> => {
  const { data, error } = await supabase
    .from("style_prompts")
    .select("prompt")
    .eq("name", name)
    .eq("category", category)
    .single();

  if (error) {
    console.error(`Error fetching ${category} prompt:`, error);
    return "";
  }

  return data.prompt;
};

export const getStylePrompt = async (style: string): Promise<string> => {
  return getPromptByCategory(style, 'style');
};

export const getTonePrompt = async (tone: string): Promise<string> => {
  return getPromptByCategory(tone, 'tone');
};

export const getWordCountPrompt = async (wordCount: string): Promise<string> => {
  return `Keep the headline at or under ${wordCount} words maximum.`;
};

export const getWordRulesPrompt = async (type: 'focus' | 'omission'): Promise<string> => {
  return getPromptByCategory(type, 'word_rules');
};
