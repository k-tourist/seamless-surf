
import React from 'react';

const ContentInputSection = () => {
  return (
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
  );
};

export default ContentInputSection;
