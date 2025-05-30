'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Profile */}
        <div className="bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-2xl p-6 space-y-4 transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-700">Profile</h2>
          <div className="flex items-center space-x-5">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-800">John Doe</p>
              <p className="text-sm text-gray-500">johndoe@example.com</p>
              <button className="px-4 py-1 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition">
                Change Icon
              </button>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Personal Information</h2>
          <div className="space-y-3">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              defaultValue="John"
              placeholder="First Name"
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              defaultValue="Doe"
              placeholder="Last Name"
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              type="email"
              defaultValue="johndoe@example.com"
              placeholder="Email"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gradient-to-br from-white to-pink-50 shadow-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Preferences</h2>
          <div className="space-y-4">
            <Toggle label="Dark Mode" value={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <Toggle
              label="Email Updates"
              value={emailUpdates}
              onChange={() => setEmailUpdates(!emailUpdates)}
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gradient-to-br from-white to-yellow-50 shadow-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Notifications</h2>
          <div className="space-y-4">
            <Toggle
              label="Notify via Email"
              value={notifyEmail}
              onChange={() => setNotifyEmail(!notifyEmail)}
            />
            <Toggle
              label="Notify via SMS"
              value={notifySMS}
              onChange={() => setNotifySMS(!notifySMS)}
            />
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-gradient-to-br from-white to-teal-50 shadow-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Language</h2>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>

        {/* Password Change */}
        <div className="bg-gradient-to-br from-white to-red-50 shadow-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Change Password</h2>
          <div className="space-y-3">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg"
              type="password"
              placeholder="Current Password"
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-lg"
              type="password"
              placeholder="New Password"
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-lg"
              type="password"
              placeholder="Confirm New Password"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-12 space-x-4">
        <button className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-lg text-sm font-medium transition">
          Cancel
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Reusable Toggle Component
const Toggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          value ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default SettingsPage;
