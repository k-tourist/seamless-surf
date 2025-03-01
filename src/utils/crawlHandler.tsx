import { FirecrawlService } from "./FirecrawlService";
import { logCrawlProcess } from "./loggingUtils";
import { Link } from "react-router-dom";
import { CrawlResponse } from "@/types";

interface CrawlHandlerParams {
  url: string;
  setIsCrawling: (value: boolean) => void;
  setArticle: (value: string) => void;
  setActiveTab: (value: string) => void;
  toast: any;
}

export const handleCrawl = async ({
  url,
  setIsCrawling,
  setArticle,
  setActiveTab,
  toast
}: CrawlHandlerParams): Promise<CrawlResponse> => {
  logCrawlProcess.start(url);
  
  if (!url.trim()) {
    toast({
      title: "Please enter a URL",
      description: "A valid URL is required to crawl content.",
      variant: "destructive",
    });
    return { success: false, error: "URL is required" };
  }

  const apiKey = await FirecrawlService.getApiKey();
  logCrawlProcess.apiKeyStatus(apiKey);

  if (!apiKey) {
    toast({
      title: "API Key Required",
      description: (
        <div>
          Please set your Firecrawl API key in the{" "}
          <Link to="/settings" className="underline">
            settings page
          </Link>
        </div>
      ),
      variant: "destructive",
    });
    return { success: false, error: "API key is required" };
  }

  setIsCrawling(true);
  logCrawlProcess.crawlRequest();

  try {
    const result = await FirecrawlService.crawlWebsite(url);
    logCrawlProcess.crawlResult(result);
    
    if (result.success && result.data?.[0]?.markdown) {
      const markdown = result.data[0].markdown;
      console.log("Markdown content from crawl:", markdown); // Debug log
      console.log("Crawl successful, updating article content");
      setArticle(markdown);
      setActiveTab("text");
      toast({
        title: "Success",
        description: "Content successfully crawled from URL",
      });
      return result;
    } else {
      toast({
        title: "Error",
        description: "Failed to crawl content from URL",
        variant: "destructive",
      });
      return { success: false, error: "Failed to crawl content" };
    }
  } catch (error) {
    logCrawlProcess.error(error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to crawl content",
      variant: "destructive",
    });
    return { success: false, error: error instanceof Error ? error.message : "Failed to crawl content" };
  } finally {
    logCrawlProcess.complete();
    setIsCrawling(false);
  }
};