// src/components/ui/WhatsAppChatButton.tsx
import React from 'react'

const WHATSAPP_LINK = 'https://wa.me/17302416651'; // eToro Trust Capital WhatsApp support

// Define a uniquely named component for this file
const WhatsAppChatButton: React.FC = () => (
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      position: 'fixed',
      bottom: 96,
      left: 24,
      zIndex: 9999,
      background: '#25D366',
      color: '#fff',
      borderRadius: '50%',
      width: 56,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      textDecoration: 'none',
      fontSize: 28,
      transition: 'transform 0.15s ease',
    }}
    aria-label="Chat on WhatsApp"
    title="Chat on WhatsApp"
  >
    <svg width="32" height="32" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="448" height="512" fill="none" />
      <circle cx="224" cy="256" r="200" fill="#25D366" />
      <path fill="#fff" d="M380.9 97.1C339 55.3 285.9 32 231.9 32c-126 0-228 102-228 228 0 40.2 11 79.5 31.9 114L0 480l108.2-34.4C144.5 467.6 187 480 231.9 480c126 0 228-102 228-228 0-53.9-23.3-107.1-79-155.9zM231.9 419.5c-37.7 0-74.5-10.2-106.7-29.5l-7.6-4.6-64.9 20.7 21.8-63.2-5-8c-19.3-30.9-29.4-66.4-29.4-103.8 0-97 79-176 176-176 46.9 0 91 18.5 124.4 52.2 33.5 33.9 52 78.8 52 125.3 0 97-79 176-176 176zm88.8-137.4c-4.9-2.5-29-14.3-33.5-15.9-4.5-1.6-7.8-2.5-11.1 2.5-3.3 4.9-12.6 15.9-15.5 19.2-2.9 3.3-5.9 3.7-10.8 1.2-4.9-2.5-20.7-7.6-39.5-24.4-14.6-13-24.5-29-27.3-33.9-2.9-4.9-.3-7.6 2.2-10.1 2.2-2.2 4.9-5.9 7.4-8.9 2.5-3 3.3-5 4.9-8.3 1.6-3.3.8-6.2-.4-8.7-1.2-2.5-11.1-26.9-15.2-36.9-4-9.8-8.1-8.6-11.1-8.8l-9.5-.1c-3.3 0-8.5 1.2-13 6-4.5 4.9-17 16.6-17 40.5 0 24.1 17.4 47.3 19.8 50.5 2.5 3.3 34 51.9 82.5 71 48.5 19 48.5 12.6 57.4 11.8 8.9-.8 29-11.7 33.1-23.1 4.1-11.4 4.1-21.2 2.9-23.8-1.2-2.5-4.5-3.9-9.4-6.4z"/>
    </svg>
  </a>
)

export default WhatsAppChatButton
