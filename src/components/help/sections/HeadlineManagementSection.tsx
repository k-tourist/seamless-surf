
import React from 'react';

const HeadlineManagementSection = () => {
  return (
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
  );
};

export default HeadlineManagementSection;
