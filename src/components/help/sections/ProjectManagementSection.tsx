
import React from 'react';

const ProjectManagementSection = () => {
  return (
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>New Project:</strong> Creates a fresh project with empty URL and content fields, generating a unique project ID in the database.</li>
      <li><strong>Project Loading:</strong> Loads all project details including URL, text content, generated headlines, and settings when selected from recent projects.</li>
      <li><strong>Project Auto-saving:</strong> Automatically saves changes to URL, content, headlines, and settings to the current project.</li>
      <li><strong>Recent Projects:</strong> Displays the 10 most recent projects with their titles derived from content or URL.</li>
      <li><strong>Project History:</strong> View and manage your past projects, including timestamps and content sources.</li>
      <li><strong>Export/Import:</strong> Export your projects for backup or import existing projects to continue working on them.</li>
    </ul>
  );
};

export default ProjectManagementSection;
