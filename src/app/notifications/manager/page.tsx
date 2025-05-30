'use client';

import React, { useState } from 'react';

const notificationsData = [
  {
    id: 1,
    type: 'Overdue Ticket',
    message: 'Ticket #12345 is overdue for resolution. Please address it ASAP.',
    timestamp: '2025-04-05 10:15 AM',
  },
  {
    id: 2,
    type: 'Escalation Alert',
    message: 'Ticket #12346 has been escalated. Please resolve it immediately.',
    timestamp: '2025-04-05 10:30 AM',
  },
  {
    id: 3,
    type: 'Overdue Ticket',
    message: 'Ticket #12347 is overdue for resolution. Please address it ASAP.',
    timestamp: '2025-04-05 11:00 AM',
  },
];

const ManagerNotificationsPage = () => {
  const [notifications] = useState(notificationsData);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manager Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500">{notification.type}</span>
              <span className="text-xs text-gray-400">{notification.timestamp}</span>
            </div>
            <p className="text-lg font-medium">{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerNotificationsPage;
