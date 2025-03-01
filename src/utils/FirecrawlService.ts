
import { supabase } from "@/integrations/supabase/client";

class FirecrawlService {
  private static apiKey: string | null = null;
  private static firecrawlInstance: any | null = null;

  private static async initializeFirecrawl(): Promise<any | null> {
    try {
      // Use cached API key if available
      if (this.apiKey && this.firecrawlInstance) {
        return this.firecrawlInstance;
      }

      // Otherwise fetch from database
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        return null;
      }

      // Dynamically import FirecrawlApp
      const { default: FirecrawlApp } = await import('@mendable/firecrawl-js');
      
      // Create and cache instance
      this.apiKey = apiKey;
      this.firecrawlInstance = new FirecrawlApp({ apiKey });
      return this.firecrawlInstance;
    } catch (error) {
      console.error('Error initializing Firecrawl:', error);
      return null;
    }
  }

  static async getApiKey(): Promise<string | null> {
    try {
      // Return cached key if available
      if (this.apiKey) {
        return this.apiKey;
      }

      const { data: keyData } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'firecrawl_api_key')
        .single();

      // Check if value is an object with a key property
      if (keyData && typeof keyData.value === 'object' && keyData.value !== null && 'key' in keyData.value) {
        const value = keyData.value as { key: string };
        this.apiKey = value.key; // Cache the key
        return value.key;
      }
      return null;
    } catch (error) {
      console.error('Error fetching Firecrawl API key:', error);
      return null;
    }
  }

  static async setApiKey(key: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          key: 'firecrawl_api_key',
          value: { key }
        });

      if (error) throw error;
      
      // Update cached values
      this.apiKey = key;
      this.firecrawlInstance = new FirecrawlApp({ apiKey: key });
      return true;
    } catch (error) {
      console.error('Error setting Firecrawl API key:', error);
      return false;
    }
  }

  static async testApiKey(key: string): Promise<boolean> {
    try {
      const firecrawl = new FirecrawlApp({ apiKey: key });
      const result = await firecrawl.crawlUrl('https://example.com', {
        limit: 1
      });
      return !!result;
    } catch (error) {
      console.error('Error testing Firecrawl API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<any> {
    console.log('Starting crawl for URL:', url);

    if (!url.trim()) {
      console.log('No URL provided to crawl');
      return {
        success: false,
        error: 'No URL provided'
      };
    }

    try {
      const firecrawl = await this.initializeFirecrawl();
      if (!firecrawl) {
        console.error('Failed to initialize Firecrawl');
        return {
          success: false,
          error: 'API key not configured'
        };
      }

      console.log('Making crawl request to Firecrawl');
      const result = await firecrawl.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown']
        }
      });

      if (!result || !Array.isArray(result.data)) {
        console.error('Invalid response from Firecrawl:', result);
        return {
          success: false,
          error: 'Invalid response from service'
        };
      }

      console.log('Crawl successful, received data:', result.data.length, 'items');
      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      console.error('Error crawling website:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to crawl website'
      };
    }
  }
}

export { FirecrawlService };
