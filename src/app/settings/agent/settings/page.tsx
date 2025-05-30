'use client';

import React, { useState, useEffect } from 'react';
import { User, Sun, Moon } from 'lucide-react';

const AgentSettingsPage = () => {
  const [agentName] = useState('John Agent');
  const [email] = useState('john.agent@example.com');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [availability, setAvailability] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (storedTheme) {
      setDarkMode(storedTheme === 'dark');
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const handleSave = () => {
    const settings = {
      name: agentName,
      email,
      language,
      notifications,
      darkMode,
      availability,
    };
    console.log('Saved Settings:', settings);
    alert('Agent settings saved!');
  };

  const sectionClasses =
    'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow rounded-2xl p-6 space-y-4 transition-colors duration-300';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold">Agent Settings</h1>
          <button
            onClick={handleThemeToggle}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className={sectionClasses}>
            <div className="text-lg font-semibold">Agent Profile</div>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-lg font-medium">{agentName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{email}</div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className={sectionClasses}>
            <div className="text-lg font-semibold">Availability</div>
            <div className="flex justify-between items-center">
              <span>Set yourself as available</span>
              <button
                onClick={() => setAvailability(!availability)}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition ${
                  availability ? 'bg-green-500' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    availability ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className={sectionClasses}>
            <div className="text-lg font-semibold">Notifications</div>
            <div className="flex justify-between items-center">
              <span>Enable notifications</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition ${
                  notifications ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Theme Toggle (duplicate of header for inline setting) */}
          <div className={sectionClasses}>
            <div className="text-lg font-semibold">Theme</div>
            <div className="flex justify-between items-center">
              <span>Enable Dark Mode</span>
              <button
                onClick={handleThemeToggle}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition ${
                  darkMode ? 'bg-black' : 'bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Language */}
          <div className={`${sectionClasses} md:col-span-2`}>
            <div className="text-lg font-semibold">Language Preference</div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end mt-10">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSettingsPage;
