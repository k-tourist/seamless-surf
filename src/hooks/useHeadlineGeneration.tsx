
import { useState, useEffect } from "react";
import { useCrawlHandler } from "./useCrawlHandler";
import { useHeadlineCreation } from "./useHeadlineCreation";
import type { HeadlineSettings } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useHeadlineGeneration = (projectId?: string) => {
  const [sourceText, setSourceText] = useState("");
  const [aiEarnwareContent, setAiEarnwareContent] = useState<any>(null);
  const { toast } = useToast();
  const { isCrawling, performCrawl } = useCrawlHandler();
  const { isGenerating, generateHeadlines } = useHeadlineCreation();

  useEffect(() => {
    const fetchAiEarnwareContent = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'ai_earnware_settings')
          .single();
        
        if (error) {
          console.error('Error loading Ai.Earnware settings:', error);
          return;
        }

        const settings = data?.value as { url: string; key: string } | null;
        
        if (!settings?.url || !settings?.key) {
          console.log('Ai.Earnware settings not configured');
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const sourceId = urlParams.get('sourceId');

        if (!sourceId) {
          console.log('No sourceId provided');
          return;
        }

        const baseUrl = settings.url.replace(/\/$/, '');
        const apiUrl = `${baseUrl}/headlines/content/${sourceId}`;

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${settings.key}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const content = await response.json();
        console.log('Ai.Earnware content loaded:', content);
        setAiEarnwareContent(content);

        if (content?.text) {
          setSourceText(content.text);
        }
      } catch (error) {
        console.error('Error fetching Ai.Earnware content:', error);
        toast({
          description: "Failed to load content from Ai.Earnware",
          variant: "destructive"
        });
      }
    };

    fetchAiEarnwareContent();
  }, [toast]);

  const handleUrlSubmit = async (url: string) => {
    if (!url.trim()) return;
    
    console.log("Processing URL input:", url);
    const text = await performCrawl(url);
    if (text) {
      console.log("Setting source text from URL");
      setSourceText(text);
    }
  };

  const handleTextSubmit = (text: string) => {
    if (!text.trim()) return;
    
    console.log("Setting source text directly:", text.substring(0, 100) + "...");
    setSourceText(text);
  };

  const handleGenerateHeadlines = async (settings: HeadlineSettings) => {
    if (!sourceText.trim()) {
      return [];
    }
    return await generateHeadlines(sourceText, settings);
  };

  return {
    sourceText,
    aiEarnwareContent,
    isCrawling,
    isGenerating,
    handleUrlSubmit,
    handleTextSubmit,
    handleGenerateHeadlines,
  };
};
