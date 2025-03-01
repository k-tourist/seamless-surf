
declare module '@mendable/firecrawl-js' {
  interface FirecrawlOptions {
    apiKey: string;
  }

  interface ScrapeOptions {
    formats?: string[];
  }

  interface CrawlOptions {
    limit?: number;
    scrapeOptions?: ScrapeOptions;
  }

  export default class FirecrawlApp {
    constructor(options: FirecrawlOptions);
    crawlUrl(url: string, options?: CrawlOptions): Promise<any>;
  }
}
