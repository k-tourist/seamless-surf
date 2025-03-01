
import React from 'react';

const IntegrationsSection = () => {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Integration Methods</h4>
      <div className="space-y-2">
        <p>The Super Headline Generator supports URL query parameters and API key authentication for external integrations. You can automatically load content and authenticate by appending parameters to the URL:</p>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <h5 className="font-medium">API Key Authentication</h5>
            <p className="text-sm text-muted-foreground">Use the <code className="bg-muted px-1 py-0.5 rounded">key</code> parameter to authenticate your requests:</p>
            <pre className="bg-muted p-2 rounded-md text-sm">
              https://your-app.com/?key=your_api_key
            </pre>
            <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
              <li>API keys provide secure access to the application</li>
              <li>Each API key is unique and tied to a specific user account</li>
              <li>Keys can be managed in your profile settings</li>
              <li>Include the key parameter before other parameters</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-medium">URL Content Integration</h5>
            <p className="text-sm text-muted-foreground">Use the <code className="bg-muted px-1 py-0.5 rounded">url</code> parameter to automatically crawl and analyze a webpage:</p>
            <pre className="bg-muted p-2 rounded-md text-sm">
              https://your-app.com/?key=your_api_key&url=https://example.com/article
            </pre>
          </div>

          <div className="space-y-2">
            <h5 className="font-medium">Direct Text Integration</h5>
            <p className="text-sm text-muted-foreground">Use the <code className="bg-muted px-1 py-0.5 rounded">text</code> parameter to directly input content (URL encoded):</p>
            <pre className="bg-muted p-2 rounded-md text-sm">
              https://your-app.com/?key=your_api_key&text=Your%20article%20content
            </pre>
          </div>

          <div className="space-y-2">
            <h5 className="font-medium">Important Notes</h5>
            <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
              <li>Authentication is required for all API integrations</li>
              <li>Content provided via URL parameters must be URL encoded</li>
              <li>The <code className="bg-muted px-1 py-0.5 rounded">text</code> parameter has a size limit</li>
              <li>Only one content parameter (<code className="bg-muted px-1 py-0.5 rounded">url</code> or <code className="bg-muted px-1 py-0.5 rounded">text</code>) will be processed, with URL taking precedence</li>
              <li>Invalid or empty parameters will be ignored</li>
              <li>For security reasons, rate limiting may apply to API requests</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-medium">Example Usage</h5>
            <p className="text-sm text-muted-foreground">Complete example with authentication and URL analysis:</p>
            <pre className="bg-muted p-2 rounded-md text-sm whitespace-pre-wrap">
              https://your-app.com/?key=your_api_key&url=https://example.com/article
            </pre>
            <p className="text-sm text-muted-foreground">Complete example with authentication and direct text input:</p>
            <pre className="bg-muted p-2 rounded-md text-sm whitespace-pre-wrap">
              https://your-app.com/?key=your_api_key&text=Your%20article%20content%20here
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSection;
