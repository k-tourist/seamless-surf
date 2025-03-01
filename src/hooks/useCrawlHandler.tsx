import { useState } from "react";
import { handleCrawl } from "@/utils/crawlHandler";
import { CrawlResponse } from "@/types";

export const useCrawlHandler = () => {
  const [isCrawling, setIsCrawling] = useState(false);

  const performCrawl = async (url: string): Promise<string | null> => {
    setIsCrawling(true);
    try {
      console.log("Starting crawl for URL:", url);
      const response: CrawlResponse = await handleCrawl({
        url,
        setIsCrawling,
        setArticle: (text: string) => text,
        setActiveTab: () => {},
        toast: () => {},
      });

      console.log("Crawl response:", response); // Debug log

      if (response.success && response.data?.[0]?.markdown) {
        const markdown = response.data[0].markdown;
        console.log("Extracted markdown:", markdown); // Debug log
        return markdown;
      }
      
      console.log("No markdown found in response"); // Debug log
      return null;
    } catch (error) {
      console.error("Error crawling URL:", error);
      return null;
    } finally {
      setIsCrawling(false);
      console.log("Crawl process complete, setting isCrawling to false");
    }
  };

  return {
    isCrawling,
    performCrawl,
  };
};