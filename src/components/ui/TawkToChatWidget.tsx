import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

const TawkToChatWidget: React.FC = () => {
  const { user } = useAuth()

  // Don't show for admin, superadmin users
  if (user && (user.role === 'admin' || user.role === 'superadmin')) {
    return null
  }

  useEffect(() => {
    // Tawk.to Script
    const w = window as any;
    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();
    
    // Set company context for the chat widget
    w.Tawk_API.visitor = {
      name: 'eToro Trust Capital',
    };
    
    // Handle Tawk.to onLoad to customize the greeting
    w.Tawk_API.onLoad = function() {
      // Set custom greeting message
      w.Tawk_API.setAttributes({
        'email': '',
        'name': 'Guest'
      }, function(error: any) {});
    };

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6963eb0d7c8bd319796acfd9/1jen4sb9v';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
    
    // Optional: Cleanup function if the component unmounts
    // Typically chat widgets attach to window and don't support clean "unmount" well,
    // but we can try removing the script tag.
    return () => {
        // We usually don't remove the script as it might have modified the DOM extensively.
    };
  }, []);

  return null;
}

export default TawkToChatWidget;
