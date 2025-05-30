// src/components/WhatsAppChat.tsx

'use client';

import React from 'react';

const WhatsAppChat = () => {
  const handleWhatsAppClick = () => {
    const supportNumber = '7338265989'; // Replace with actual support number
    const message = 'Hello, I need assistance with my issue.';

    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-4 left-4">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 text-white p-4 rounded-full shadow-lg"
      >
        <i className="fab fa-whatsapp"></i> Chat with Support
      </button>
    </div>
  );
};

export default WhatsAppChat;
