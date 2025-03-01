let FirecrawlApp: any = null;

export async function getFirecrawlApp() {
  if (!FirecrawlApp) {
    const module = await import('@mendable/firecrawl-js');
    FirecrawlApp = module.default;
  }
  return FirecrawlApp;
}