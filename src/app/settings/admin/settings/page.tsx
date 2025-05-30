'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Bell,
  Moon,
  MessageCircle,
  Globe,
  Save,
  ShieldAlert,
  Eye,
  KeyRound,
  Users,
  Mail,
  Smartphone,
  ScanFace,
  Paintbrush2,
  Database,
  Timer,
  LockKeyhole,
  ArchiveRestore
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Settings {
  enableNotifications: boolean;
  enableDarkMode: boolean;
  enableLiveChat: boolean;
  language: string;
  role: 'admin' | 'super-admin';
  allowRoleSwitch: boolean;
  showActivityLog: boolean;
  enableAuditTrail: boolean;
  enableTwoFactorAuth: boolean;
  manageUserAccess: boolean;
  allowEmailAlerts: boolean;
  enableMobileAccess: boolean;
  enableFacialRecognition: boolean;
  theme: 'light' | 'dark' | 'system';
  enableBackup: boolean;
  passwordPolicy: string;
  sessionTimeout: number;
  logRetention: string;
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<Settings>({
    enableNotifications: true,
    enableDarkMode: false,
    enableLiveChat: true,
    language: 'en',
    role: 'admin',
    allowRoleSwitch: false,
    showActivityLog: true,
    enableAuditTrail: false,
    enableTwoFactorAuth: false,
    manageUserAccess: true,
    allowEmailAlerts: true,
    enableMobileAccess: true,
    enableFacialRecognition: false,
    theme: 'light',
    enableBackup: true,
    passwordPolicy: 'strong',
    sessionTimeout: 15,
    logRetention: '30_days',
  });

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key],
    }));
  };

  const handleChange = (
    key: keyof Settings,
    value: string | number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    console.log('Admin settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-7xl mx-auto space-y-12 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl"
    >
      <h1 className="text-4xl font-bold flex items-center gap-3 text-gray-800">
        <ShieldCheck className="text-blue-500" /> Admin Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Settings Sections */}
        {settingsSections.map((section, idx) => (
          <SettingCard key={idx} title={section.title} icon={section.icon}>
            {section.children(settings, handleToggle, handleChange)}
          </SettingCard>
        ))}
      </div>

      <motion.div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:bg-blue-700"
        >
          <Save className="w-5 h-5" /> Save Changes
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const SettingCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-2xl shadow-md space-y-4 transition-all duration-300"
  >
    <h3 className="text-xl font-semibold flex items-center gap-3 text-gray-700">
      {icon} {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </motion.div>
);

const Toggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-gray-600 font-medium">{label}</span>
    <input
      type="checkbox"
      checked={value}
      onChange={onChange}
      className="form-checkbox h-5 w-5 text-blue-600"
    />
  </label>
);

const settingsSections = [
  {
    title: 'Access Role',
    icon: <KeyRound />,
    children: (settings: Settings, toggle: any, change: any) => (
      <>
        <select
          value={settings.role}
          onChange={(e) => change('role', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-xl"
        >
          <option value="admin">Admin</option>
          <option value="super-admin">Super Admin</option>
        </select>
        <Toggle label="Allow Role Switching" value={settings.allowRoleSwitch} onChange={() => toggle('allowRoleSwitch')} />
      </>
    ),
  },
  {
    title: 'Notifications',
    icon: <Bell />,
    children: (settings: Settings, toggle: any) => (
      <Toggle label="Enable Notifications" value={settings.enableNotifications} onChange={() => toggle('enableNotifications')} />
    ),
  },
  {
    title: 'Theme & Display',
    icon: <Paintbrush2 />,
    children: (settings: Settings, toggle: any, change: any) => (
      <>
        <select
          value={settings.theme}
          onChange={(e) => change('theme', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-xl"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <Toggle label="Enable Dark Mode" value={settings.enableDarkMode} onChange={() => toggle('enableDarkMode')} />
      </>
    ),
  },
  {
    title: 'Live Chat',
    icon: <MessageCircle />,
    children: (settings: Settings, toggle: any) => (
      <Toggle label="Enable Live Chat" value={settings.enableLiveChat} onChange={() => toggle('enableLiveChat')} />
    ),
  },
  {
    title: 'Language',
    icon: <Globe />,
    children: (settings: Settings, _toggle: any, change: any) => (
      <select
        value={settings.language}
        onChange={(e) => change('language', e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-xl"
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="hi">Hindi</option>
      </select>
    ),
  },
  {
    title: 'Security & Audit',
    icon: <ShieldAlert />,
    children: (settings: Settings, toggle: any) => (
      <>
        <Toggle label="Enable Audit Trail" value={settings.enableAuditTrail} onChange={() => toggle('enableAuditTrail')} />
        <Toggle label="Two-Factor Authentication" value={settings.enableTwoFactorAuth} onChange={() => toggle('enableTwoFactorAuth')} />
      </>
    ),
  },
  {
    title: 'Activity Log',
    icon: <Eye />,
    children: (settings: Settings, toggle: any, change: any) => (
      <>
        <Toggle label="Show Activity Logs" value={settings.showActivityLog} onChange={() => toggle('showActivityLog')} />
        <select
          value={settings.logRetention}
          onChange={(e) => change('logRetention', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-xl"
        >
          <option value="7_days">7 Days</option>
          <option value="30_days">30 Days</option>
          <option value="90_days">90 Days</option>
        </select>
      </>
    ),
  },
  {
    title: 'User Access Control',
    icon: <Users />,
    children: (settings: Settings, toggle: any) => (
      <Toggle label="Enable Access Management" value={settings.manageUserAccess} onChange={() => toggle('manageUserAccess')} />
    ),
  },
  {
    title: 'Manager Alerts & Access',
    icon: <Mail />,
    children: (settings: Settings, toggle: any) => (
      <>
        <Toggle label="Allow Email Alerts" value={settings.allowEmailAlerts} onChange={() => toggle('allowEmailAlerts')} />
        <Toggle label="Mobile Access" value={settings.enableMobileAccess} onChange={() => toggle('enableMobileAccess')} />
      </>
    ),
  },
  {
    title: 'Biometrics',
    icon: <ScanFace />,
    children: (settings: Settings, toggle: any) => (
      <Toggle label="Facial Recognition Login" value={settings.enableFacialRecognition} onChange={() => toggle('enableFacialRecognition')} />
    ),
  },
  {
    title: 'Backup & Security Policy',
    icon: <Database />,
    children: (settings: Settings, toggle: any, change: any) => (
      <>
        <Toggle label="Enable Automatic Backups" value={settings.enableBackup} onChange={() => toggle('enableBackup')} />
        <select
          value={settings.passwordPolicy}
          onChange={(e) => change('passwordPolicy', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-xl"
        >
          <option value="medium">Medium</option>
          <option value="strong">Strong</option>
          <option value="very_strong">Very Strong</option>
        </select>
      </>
    ),
  },
  {
    title: 'Session Timeout',
    icon: <Timer />,
    children: (settings: Settings, _toggle: any, change: any) => (
      <label className="block text-gray-600">
        Auto Logout After:
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => change('sessionTimeout', Number(e.target.value))}
          min={5}
          max={60}
          className="w-full mt-1 p-2 border border-gray-300 rounded-xl"
        />
        <span className="text-sm text-gray-500">minutes of inactivity</span>
      </label>
    ),
  },
];

export default AdminSettingsPage;
