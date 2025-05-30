// src/agent/profile/AgentProfile.tsx

'use client';

import React from 'react';

const agentData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  jobTitle: 'Support Agent',
  phone: '+1234567890',
  avatar: 'https://www.gravatar.com/avatar/placeholder', // Example avatar URL
};

const AgentProfile = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Agent Profile</h2>
      <div className="flex items-center space-x-4">
        <img
          src={agentData.avatar}
          alt="Agent Avatar"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold">{agentData.name}</h3>
          <p className="text-gray-600">{agentData.jobTitle}</p>
          <p className="text-gray-600">{agentData.email}</p>
          <p className="text-gray-600">{agentData.phone}</p>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => window.location.href = '/agent/settings'}
          className="bg-blue-500 text-white p-3 rounded"
        >
          Edit Profile Settings
        </button>
      </div>
    </div>
  );
};

export default AgentProfile;
