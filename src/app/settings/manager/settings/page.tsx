'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  MoonIcon,
  GlobeIcon,
  FileTextIcon,
  LayoutGridIcon,
  UserCog,
} from 'lucide-react';

interface ManagerSettings {
  enableNotifications: boolean;
  enableDarkMode: boolean;
  language: string;
  autoGenerateReports: boolean;
  exportFormat: string;
  dashboardWidgets: string[];
  allowAgentEdit: boolean;
  allowEmployeeRequests: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const ManagerSettingsPage = () => {
  const [settings, setSettings] = useState<ManagerSettings>({
    enableNotifications: true,
    enableDarkMode: false,
    language: 'en',
    autoGenerateReports: true,
    exportFormat: 'pdf',
    dashboardWidgets: ['summary', 'tickets', 'agents'],
    allowAgentEdit: true,
    allowEmployeeRequests: true,
  });

  const handleToggle = (setting: keyof ManagerSettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log('Manager settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-5xl mx-auto space-y-6"
    >
      <motion.h1
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Manager Settings
      </motion.h1>

      {[
        {
          title: 'User Permissions',
          icon: <UserCog className="w-5 h-5 text-blue-500" />,
          content: (
            <>
              <label className="flex items-center gap-2" title="Allow agents to edit their own profiles">
                <input
                  type="checkbox"
                  checked={settings.allowAgentEdit}
                  onChange={() => handleToggle('allowAgentEdit')}
                  className="accent-blue-600"
                />
                Allow agent profile editing
              </label>
              <label className="flex items-center gap-2" title="Allow employees to raise requests for settings changes">
                <input
                  type="checkbox"
                  checked={settings.allowEmployeeRequests}
                  onChange={() => handleToggle('allowEmployeeRequests')}
                  className="accent-blue-600"
                />
                Allow employee setting requests
              </label>
            </>
          ),
        },
        {
          title: 'Report Settings',
          icon: <FileTextIcon className="w-5 h-5 text-green-500" />,
          content: (
            <>
              <label className="flex items-center gap-2" title="Enable weekly automated reports">
                <input
                  type="checkbox"
                  checked={settings.autoGenerateReports}
                  onChange={() => handleToggle('autoGenerateReports')}
                  className="accent-blue-600"
                />
                Enable automatic weekly reports
              </label>
              <div>
                <label className="block mb-1 text-sm font-medium">Export Format</label>
                <select
                  name="exportFormat"
                  value={settings.exportFormat}
                  onChange={handleSelectChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </>
          ),
        },
        {
          title: 'Dashboard Customization',
          icon: <LayoutGridIcon className="w-5 h-5 text-purple-500" />,
          content: (
            <div className="flex gap-3 flex-wrap">
              {['summary', 'tickets', 'agents', 'employees', 'stats'].map(widget => (
                <label key={widget} className="flex items-center gap-1" title={`Toggle ${widget} widget`}>
                  <input
                    type="checkbox"
                    checked={settings.dashboardWidgets.includes(widget)}
                    onChange={() =>
                      setSettings(prev => ({
                        ...prev,
                        dashboardWidgets: prev.dashboardWidgets.includes(widget)
                          ? prev.dashboardWidgets.filter(w => w !== widget)
                          : [...prev.dashboardWidgets, widget],
                      }))
                    }
                  />
                  <span className="capitalize">{widget}</span>
                </label>
              ))}
            </div>
          ),
        },
      ].map((section, index) => (
        <motion.div
          key={section.title}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, type: 'spring', stiffness: 100 }}
            >
              {section.icon}
            </motion.div>
            {section.title}
          </h2>
          {section.content}
        </motion.div>
      ))}

      <motion.div
        variants={fadeInUp}
        custom={4}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MoonIcon className="w-5 h-5 text-gray-700" />
            Theme
          </h2>
          <label className="flex items-center gap-2" title="Toggle dark mode">
            <input
              type="checkbox"
              checked={settings.enableDarkMode}
              onChange={() => handleToggle('enableDarkMode')}
              className="accent-blue-600"
            />
            Enable Dark Mode
          </label>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <GlobeIcon className="w-5 h-5 text-yellow-600" />
            Language
          </h2>
          <select
            name="language"
            value={settings.language}
            onChange={handleSelectChange}
            className="p-2 border border-gray-300 rounded w-full"
            title="Select system language"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        custom={5}
        initial="hidden"
        animate="visible"
        className="bg-white p-6 rounded-2xl shadow-md space-y-3"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BellIcon className="w-5 h-5 text-red-500" />
          Notifications
        </h2>
        <label className="flex items-center gap-2" title="Enable or disable system notifications">
          <input
            type="checkbox"
            checked={settings.enableNotifications}
            onChange={() => handleToggle('enableNotifications')}
            className="accent-blue-600"
          />
          Enable System Notifications
        </label>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        custom={6}
        initial="hidden"
        animate="visible"
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Settings
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ManagerSettingsPage;
