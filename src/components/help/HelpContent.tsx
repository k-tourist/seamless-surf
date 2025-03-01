import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  List,
  Settings as SettingsIcon,
  User,
  Lock,
  Brush,
  History,
  FileText,
  Info,
  LinkIcon
} from "lucide-react";

const sections = [
  {
    id: 'about',
    title: 'About',
    icon: Info,
    content: (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Super Headline Generator</h3>
          <p className="text-sm text-muted-foreground">Version 1.0.2 Stable</p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Overview</h4>
          <p>The Super Headline Generator is an AI-powered tool designed to create engaging, relevant, and effective headlines for your content. Whether you're writing email subjects, social media posts, or news articles, our tool analyzes your content and generates tailored headlines that capture attention and drive engagement.</p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Quick Start Guide</h4>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Input Your Content:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Paste a URL to analyze webpage content, or</li>
                <li>Enter your text directly in the content editor</li>
              </ul>
            </li>
            <li>
              <strong>Configure Settings:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Choose your preferred style (email, social, news)</li>
                <li>Set tone and word count preferences</li>
                <li>Add focus keywords if needed</li>
              </ul>
            </li>
            <li>
              <strong>Generate Headlines:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Click "Generate Headlines" button</li>
                <li>Review and rate generated headlines</li>
                <li>Save your favorites for later use</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Key Features</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI-powered headline generation</li>
            <li>URL content extraction</li>
            <li>Customizable generation settings</li>
            <li>Project management and history</li>
            <li>Headline rating and organization</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: LinkIcon,
    content: (
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
    )
  },
  {
    id: 'project-management',
    title: 'Project Management',
    icon: List,
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>New Project:</strong> Creates a fresh project with empty URL and content fields, generating a unique project ID in the database.</li>
        <li><strong>Project Loading:</strong> Loads all project details including URL, text content, generated headlines, and settings when selected from recent projects.</li>
        <li><strong>Project Auto-saving:</strong> Automatically saves changes to URL, content, headlines, and settings to the current project.</li>
        <li><strong>Recent Projects:</strong> Displays the 10 most recent projects with their titles derived from content or URL.</li>
        <li><strong>Project History:</strong> View and manage your past projects, including timestamps and content sources.</li>
        <li><strong>Export/Import:</strong> Export your projects for backup or import existing projects to continue working on them.</li>
      </ul>
    )
  },
  {
    id: 'content-input',
    title: 'Content Input',
    icon: FileText,
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>URL Input:</strong> 
          <ul className="list-disc pl-6 mt-2">
            <li>Accepts and validates URLs</li>
            <li>Automatically crawls webpage content</li>
            <li>Extracts relevant text and metadata</li>
            <li>Supports various webpage formats and structures</li>
          </ul>
        </li>
        <li><strong>Text Input:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Direct text entry for content analysis</li>
            <li>Rich text formatting support</li>
            <li>Paste functionality with automatic formatting</li>
            <li>Character and word count tracking</li>
          </ul>
        </li>
        <li><strong>Content Preview:</strong> Real-time preview of extracted or entered content before generation.</li>
        <li><strong>Content History:</strong> Access previously used content for quick reference or reuse.</li>
      </ul>
    )
  },
  {
    id: 'headline-generation',
    title: 'Headline Generation',
    icon: Brush,
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Generation Settings:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Model Selection: Choose between different AI models for generation</li>
            <li>Focus Words: Prioritize specific keywords in headlines</li>
            <li>Word Omissions: Exclude specific words from generated headlines</li>
            <li>Tone Selection: Control emotional impact (provocative, neutral, professional, etc.)</li>
            <li>Word Count: Set maximum length for headlines (short, medium, long)</li>
            <li>Randomness: Adjust variation in generated headlines</li>
            <li>Emoji Usage: Control emoji inclusion and placement</li>
            <li>Style Selection: Choose format type (email subject, news headline, social media, etc.)</li>
            <li>Custom Prompts: Create and save your own generation prompts</li>
            <li>Example Headlines: Add reference headlines to guide generation style</li>
            <li>Data-Driven Grading: Configure rubrics for objective headline scoring</li>
          </ul>
        </li>
        <li><strong>Headline Generation:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Batch generation of multiple unique headlines</li>
            <li>Real-time generation with progress tracking</li>
            <li>Smart duplicate detection and filtering</li>
            <li>Automatic content relevance scoring</li>
          </ul>
        </li>
        <li><strong>Template Support:</strong> Save and reuse successful headline patterns as templates.</li>
        <li><strong>Generation History:</strong> Track and analyze past headline generation results.</li>
      </ul>
    )
  },
  {
    id: 'headline-management',
    title: 'Headline Management',
    icon: History,
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Headline Organization:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Sort headlines by relevance, length, or engagement metrics</li>
            <li>Filter headlines based on custom criteria</li>
            <li>Group headlines by style or theme</li>
            <li>Tag headlines for easy categorization</li>
          </ul>
        </li>
        <li><strong>Headline Interactions:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Save: Mark headlines as favorites for future reference</li>
            <li>Thumbs Up: Indicate preferred headline styles</li>
            <li>Thumbs Down: Mark headlines for improvement</li>
            <li>Edit: Make manual adjustments to generated headlines</li>
            <li>Copy: Quick copy functionality for selected headlines</li>
          </ul>
        </li>
        <li><strong>Collections:</strong> Create and manage collections of related headlines.</li>
        <li><strong>Export Options:</strong> Export headlines in various formats (CSV, TXT, JSON).</li>
      </ul>
    )
  },
  {
    id: 'user-settings',
    title: 'User Settings',
    icon: SettingsIcon,
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Profile Management:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Update personal information and preferences</li>
            <li>Manage notification settings</li>
            <li>Configure default generation parameters</li>
            <li>Set preferred language and region</li>
          </ul>
        </li>
        <li><strong>API Integration:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Configure API keys for various services</li>
            <li>Monitor API usage and limits</li>
            <li>Access API documentation and guides</li>
          </ul>
        </li>
        <li><strong>Style Prompts:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Create and manage custom style prompts</li>
            <li>Access global prompt templates</li>
            <li>Share prompts with team members</li>
          </ul>
        </li>
      </ul>
    )
  },
  {
    id: 'admin-features',
    title: 'Admin Features',
    icon: Lock,
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>User Management:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>View and manage user accounts</li>
            <li>Assign user roles and permissions</li>
            <li>Monitor user activity and usage</li>
          </ul>
        </li>
        <li><strong>System Settings:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Configure global application settings</li>
            <li>Manage API keys and integrations</li>
            <li>Set up default templates and prompts</li>
          </ul>
        </li>
        <li><strong>Analytics:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Track system usage and performance</li>
            <li>Monitor API consumption</li>
            <li>Generate usage reports</li>
          </ul>
        </li>
      </ul>
    )
  },
  {
    id: 'user-interface',
    title: 'User Interface',
    icon: User,
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Theme Customization:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Toggle between light and dark modes</li>
            <li>Customize interface colors and layout</li>
            <li>Adjust text size and contrast</li>
          </ul>
        </li>
        <li><strong>Interactive Elements:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Loading indicators for async operations</li>
            <li>Toast notifications for user feedback</li>
            <li>Drag-and-drop functionality</li>
            <li>Keyboard shortcuts</li>
          </ul>
        </li>
        <li><strong>Responsive Design:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Adapts to different screen sizes</li>
            <li>Mobile-friendly interface</li>
            <li>Touch-optimized controls</li>
          </ul>
        </li>
        <li><strong>Accessibility:</strong>
          <ul className="list-disc pl-6 mt-2">
            <li>Screen reader support</li>
            <li>Keyboard navigation</li>
            <li>ARIA labels and roles</li>
            <li>High contrast options</li>
          </ul>
        </li>
      </ul>
    )
  },
  {
    id: 'changelog',
    title: 'Changelog',
    icon: List,
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Version 1.0.3 Stable (February 25, 2025)</h4>
          <ul className="list-disc pl-6 mt-2">
            <li>Enhanced grading rubric system with data-driven prompts</li>
            <li>Improved headline grading accuracy and consistency</li>
            <li>Streamlined edge function processing with better error handling</li>
            <li>Added configurable grading rubric in admin settings</li>
            <li>Updated system prompts for more accurate AI responses</li>
            <li>Removed legacy prompt elements for cleaner grading</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Version 1.0.2 Stable (February 20, 2025)</h4>
          <ul className="list-disc pl-6 mt-2">
            <li>Added example headlines feature to master prompts</li>
            <li>Enhanced prompt customization capabilities</li>
            <li>Improved admin settings interface</li>
            <li>Added example headlines integration with ${"{exampleHeadlines}"} placeholder</li>
            <li>Updated database schema to support example headlines</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Version 1.0.1 Stable (February 15, 2025)</h4>
          <ul className="list-disc pl-6 mt-2">
            <li>Improved project selection UI with subtle color themes</li>
            <li>Enhanced dark mode support for selected projects</li>
            <li>Refined border styling for better visual hierarchy</li>
            <li>Optimized color contrast for better accessibility</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Version 1.0.0 Beta (February 1, 2025)</h4>
          <ul className="list-disc pl-6 mt-2">
            <li>Initial release of Super Headline Generator</li>
            <li>AI-powered headline generation</li>
            <li>URL content extraction</li>
            <li>Project management system</li>
            <li>User authentication and profiles</li>
          </ul>
        </div>
      </div>
    )
  }
];

const HelpContent = () => {
  const [activeSection, setActiveSection] = useState('about');

  return (
    <div className="flex h-[calc(90vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r">
        <ScrollArea className="h-full py-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-accent ${
                  activeSection === section.id ? 'bg-accent' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{section.title}</span>
              </button>
            );
          })}
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <ScrollArea className="h-full">
          <div className="p-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`space-y-4 ${
                  activeSection === section.id ? 'block' : 'hidden'
                }`}
              >
                {section.id !== 'about' && (
                  <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                )}
                {section.content}
                {section.id === activeSection && section.id !== 'changelog' && section.id !== 'about' && (
                  <Separator className="my-6" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default HelpContent;
