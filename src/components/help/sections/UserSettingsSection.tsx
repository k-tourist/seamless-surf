
import React from 'react';

const UserSettingsSection = () => {
  return (
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
  );
};

export default UserSettingsSection;
