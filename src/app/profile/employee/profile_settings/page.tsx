// src/employee/profile/ProfileSettings.tsx

'use client';

import React, { useState } from 'react';

const ProfileSettings = () => {
  const [settings, setSettings] = useState({
    name: 'Shivanya Kumari',
    email: 'shivanya@company.com',
    department: 'IT Support',
    role: 'Employee',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSave = () => {
    console.log('Saved settings:', settings);
    // Logic to save the settings (could be an API call)
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <div className="space-y-4">
        <div>
          <strong>Name: </strong>
          <input
            type="text"
            name="name"
            value={settings.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <strong>Email: </strong>
          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <strong>Department: </strong>
          <input
            type="text"
            name="department"
            value={settings.department}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <strong>Role: </strong>
          <input
            type="text"
            name="role"
            value={settings.role}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleSave}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
