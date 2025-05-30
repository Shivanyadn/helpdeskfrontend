// src/components/LiveChat.tsx

'use client';

import React, { useState } from 'react';

// Example chat message structure
type Message = {
  sender: 'employee' | 'support';
  text: string;
};

const LiveChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        sender: 'employee',
        text: newMessage,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Simulating support reply after a short delay
      setTimeout(() => {
        const supportReply: Message = {
          sender: 'support',
          text: 'Thank you for reaching out! How can I assist you today?',
        };
        setMessages((prevMessages) => [...prevMessages, supportReply]);
      }, 1500);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Live Chat</h2>
      <div className="h-64 overflow-y-auto mb-4 p-2 border border-gray-300 rounded-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${message.sender === 'employee' ? 'text-blue-500' : 'text-green-500'}`}
          >
            <strong>{message.sender === 'employee' ? 'You' : 'Support'}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
