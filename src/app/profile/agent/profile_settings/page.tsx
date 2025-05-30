// src/agent/profile/AgentProfileSettings.tsx

'use client';

import React, { useState } from 'react';

const AgentProfileSettings = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1234567890');
  const [jobTitle, setJobTitle] = useState('Support Agent');

  const handleSave = () => {
    // Here you would normally send the updated data to the backend
    alert('Profile updated successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-semibold mb-1">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-3 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentProfileSettings;
