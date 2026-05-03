// src/components/ui/ThirdPartyChatbotWidget.tsx
import React, { useEffect } from 'react'


// Tidio official widget script (replace 'your-public-key' with your Tidio public key)
const CHATBOT_SCRIPT_SRC = 'https://code.tidio.co/your-public-key.js';

const ThirdPartyChatbotWidget: React.FC = () => {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById('tidio-chatbot-script')) return;
    const script = document.createElement('script');
    script.id = 'tidio-chatbot-script';
    script.src = CHATBOT_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);
  return null;
};

export default ThirdPartyChatbotWidget;
