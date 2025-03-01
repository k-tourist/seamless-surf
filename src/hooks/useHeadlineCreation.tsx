
import { useState } from "react";
import { Settings, Headline } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SettingsValue {
  key?: string;
  model?: string;
}

export const useHeadlineCreation = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateHeadlines = async (
    article: string, 
    settings: Settings
  ): Promise<Headline[]> => {
    try {
      setIsGenerating(true);
      
      if (!article || article.trim().length === 0) {
        throw new Error('No article content provided for headline generation');
      }

      console.log('Starting headline generation with:', {
        articleLength: article.length,
        articlePreview: article.substring(0, 100) + '...',
        settings
      });

      if (!settings.model) {
        throw new Error('No model selected. Please select a model in settings.');
      }

      // Get API key based on model type
      const settingsKey = settings.model.includes('claude') ? 'anthropic_api_key' : 'openai_api_key';

      const { data: keyData, error: keyError } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', settingsKey)
        .maybeSingle();
      
      if (keyError) {
        throw new Error(`Failed to get API key: ${keyError.message}`);
      }

      const keySettings = keyData?.value as SettingsValue | null;
      const apiKey = keySettings?.key;

      if (!apiKey) {
        throw new Error(`No API key found. Please configure the ${settings.model.includes('claude') ? 'Anthropic' : 'OpenAI'} API key in settings.`);
      }

      const { data: masterPromptData, error: masterPromptError } = await supabase
        .from('master_prompts')
        .select('*')
        .eq('is_active', true)
        .single();

      if (masterPromptError) {
        console.error('Error loading master prompt:', masterPromptError);
        throw new Error('Failed to load master prompt');
      }

      console.log('Loaded master prompt:', {
        promptName: masterPromptData.name,
        hasSystemPrompt: !!masterPromptData.system_prompt,
        hasUserPrompt: !!masterPromptData.user_prompt,
        hasExampleHeadlines: !!masterPromptData.example_headlines
      });

      const { data: stylePromptData, error: stylePromptError } = await supabase
        .from('style_prompts')
        .select('*')
        .eq('name', settings.style)
        .single();

      if (stylePromptError) {
        console.error('Error loading style prompt:', stylePromptError);
        throw new Error('Failed to load style prompt');
      }

      // Fill in example headlines placeholder if they exist
      let systemPrompt = masterPromptData.system_prompt;
      if (masterPromptData.example_headlines) {
        systemPrompt = systemPrompt.replace('${exampleHeadlines}', masterPromptData.example_headlines);
      }

      // Add settings to system prompt
      systemPrompt += `\n\nGeneration Settings:
- Word Count: ${settings.wordCount || "10"} words maximum
- Focus Words: ${settings.focusWords || 'None specified'}
- Word Omissions: ${settings.wordOmissions || 'None specified'}
- Style: ${settings.style || 'Standard'}
- Tone: ${settings.tone || 'Professional'}

Style Instructions:
${stylePromptData.prompt || 'Generate clear, engaging headlines'}`;

      // Replace any remaining placeholders with empty string
      systemPrompt = systemPrompt.replace(/\${.*?}/g, '');

      // Use the user prompt template from master prompts
      let userPrompt = masterPromptData.user_prompt;
      
      // Add the article to the user prompt
      userPrompt += `\n\nArticle to generate headlines for:\n${article}`;

      console.log('Sending generation request with:', {
        articleLength: article.length,
        systemPromptLength: systemPrompt.length,
        userPromptLength: userPrompt.length,
        hasArticle: true,
        model: settings.model,
        tone: settings.tone
      });

      const { data, error } = await supabase.functions.invoke(
        'generate-headlines',
        {
          body: { 
            text: article,
            settings: {
              ...settings,
              masterPrompt: {
                system: systemPrompt,
                user: userPrompt
              },
              stylePrompt: stylePromptData.prompt
            },
            apiKey
          }
        }
      );

      if (error) {
        console.error('Error from edge function:', error);
        throw new Error('Failed to generate headlines: ' + error.message);
      }

      if (!data?.headlines || !Array.isArray(data.headlines)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from headline generation');
      }

      // Filter out the "Here are X headlines..." line if present
      const filteredHeadlines = data.headlines.filter(text => 
        !text.toLowerCase().includes('here are') && 
        !text.toLowerCase().includes('headlines for')
      );

      const headlines = filteredHeadlines.map(text => ({
        text,
        interactions: {
          saved: false,
          thumbsUp: false,
          thumbsDown: false
        }
      }));

      toast({
        title: "Success",
        description: `Generated ${headlines.length} headlines using model: ${settings.model}`,
      });

      return headlines;
    } catch (error: any) {
      console.error('Error generating headlines:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate headlines",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    setIsGenerating,
    generateHeadlines
  };
};
