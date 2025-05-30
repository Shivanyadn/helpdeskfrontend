'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';

const managerData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  role: 'Manager',
  department: 'Support',
};

const ManagerProfilePage = () => {
  const [profile] = useState(managerData);
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/profile/manager/settings');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manager Profile</h1>
      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-xl font-semibold">Name:</span>
            <span>{profile.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xl font-semibold">Email:</span>
            <span>{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xl font-semibold">Role:</span>
            <span>{profile.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xl font-semibold">Department:</span>
            <span>{profile.department}</span>
          </div>
          <button
            onClick={handleEditProfile}
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfilePage;
