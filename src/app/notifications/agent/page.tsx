// src/agent/notifications/Notifications.tsx

'use client';

import React, { useState } from 'react';

type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Overdue Ticket',
      message: 'Ticket #12345 has not been resolved and is now overdue.',
      date: '2025-04-01',
      read: false,
    },
    {
      id: 2,
      title: 'Escalation Alert',
      message: 'Ticket #67890 has been escalated to management.',
      date: '2025-04-02',
      read: false,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded shadow ${
              notification.read ? 'bg-gray-100' : 'bg-blue-50'
            }`}
          >
            <h3 className="font-semibold text-lg">{notification.title}</h3>
            <p className="text-gray-700">{notification.message}</p>
            <div className="text-sm text-gray-500 mt-2">
              <span>{notification.date}</span>
            </div>
            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
