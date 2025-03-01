
import React from 'react';

const AdminFeaturesSection = () => {
  return (
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
  );
};

export default AdminFeaturesSection;
