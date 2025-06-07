'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


const ManagerProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    role: 'Manager',
    department: 'Support',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile);
    router.push('/profile/manager'); // After saving, redirect back to the profile page
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Manager Profile</h1>
      <div className="bg-white p-4 rounded shadow">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <input
              id="role"
              name="role"
              value={profile.role}
              onChange={handleChange}
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium">
              Department
            </label>
            <input
              id="department"
              name="department"
              value={profile.department}
              onChange={handleChange}
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="p-2 bg-gray-300 text-black rounded"
              onClick={() => router.push('/profile/manager')} // Cancel button
            >
              Cancel
            </button>
            <button
              type="button"
              className="p-2 bg-blue-500 text-white rounded"
              onClick={() => handleSave(profile)} // Save changes
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerProfileSettings;
