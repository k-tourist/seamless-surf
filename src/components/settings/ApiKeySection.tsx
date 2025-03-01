
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FirecrawlService } from "@/utils/FirecrawlService";
import { supabase } from "@/integrations/supabase/client";
import { FirecrawlKeySection } from "./api-keys/FirecrawlKeySection";
import { OpenAIKeySection } from "./api-keys/OpenAIKeySection";
import { AiEarnwareKeySection } from "./api-keys/AiEarnwareKeySection";
import { AnthropicKeySection } from "./api-keys/AnthropicKeySection";

type OpenAISettings = {
  key: string;
}

function isOpenAISettings(value: unknown): value is OpenAISettings {
  return (
    typeof value === "object" &&
    value !== null &&
    "key" in value &&
    typeof (value as any).key === "string"
  );
}

export const ApiKeySection = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        // Load Firecrawl API key
        const savedFirecrawlKey = await FirecrawlService.getApiKey();
        if (savedFirecrawlKey) {
          // Key loaded successfully
        }

        // Load OpenAI API key
        const { data: openaiData, error: openaiError } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'openai_api_key')
          .maybeSingle();
        
        if (openaiError) {
          console.error('Error loading OpenAI API key:', openaiError);
          throw openaiError;
        }
        
        if (openaiData?.value && isOpenAISettings(openaiData.value)) {
          // Key loaded successfully
        }

        // Load Anthropic API key
        const { data: anthropicData, error: anthropicError } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'anthropic_api_key')
          .maybeSingle();

        if (anthropicError) {
          console.error('Error loading Anthropic API key:', anthropicError);
          throw anthropicError;
        }
      } catch (error) {
        console.error('Error loading API keys:', error);
        toast({
          title: "Error",
          description: "Failed to load API keys",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKeys();
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <FirecrawlKeySection />
      <OpenAIKeySection />
      <AnthropicKeySection />
      <AiEarnwareKeySection />
    </div>
  );
};
