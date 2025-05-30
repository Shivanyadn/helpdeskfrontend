// src/agent/live-chat/LiveChat.tsx

'use client';

import React, { useState } from 'react';

const LiveChat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, `User: ${newMessage}`]);
      setNewMessage('');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Live Chat</h2>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Chat History</h3>
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="text-gray-700">
                {msg}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
