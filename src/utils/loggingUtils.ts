export const logCrawlProcess = {
  start: (url: string) => {
    console.log('Starting crawl process for URL:', url);
    console.log('Checking localStorage for API key...');
    console.log('localStorage contents:', Object.keys(localStorage));
  },
  
  apiKeyStatus: (apiKey: string | null) => {
    console.log('API Key retrieved:', apiKey ? 'Present (length: ' + apiKey.length + ')' : 'Not found');
    if (!apiKey) {
      console.log('No API key found in localStorage');
    }
  },
  
  crawlRequest: () => {
    console.log('Making crawl request to FirecrawlService');
  },
  
  crawlResult: (result: any) => {
    console.log('Crawl result:', result);
    if (result.success && result.data?.[0]?.markdown) {
      console.log('Crawl successful, updating article content');
    } else {
      console.log('Crawl failed:', result.error);
    }
  },
  
  error: (error: any) => {
    console.error('Error during crawl:', error);
  },
  
  complete: () => {
    console.log('Crawl process complete, setting isCrawling to false');
  }
};