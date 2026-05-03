// Cloudflare Turnstile Bot Protection Utility
// Get your site key at: https://dash.cloudflare.com/

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // Demo key

/**
 * Load Turnstile script dynamically
 */
export function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).turnstile) {
      resolve();
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src*="challenges.cloudflare.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ Turnstile loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Turnstile');
      reject(new Error('Failed to load Turnstile'));
    };

    document.head.appendChild(script);
  });
}

/**
 * Render Turnstile widget
 */
export function renderTurnstile(
  containerId: string,
  onSuccess: (token: string) => void,
  onError?: () => void
): string | null {
  const turnstile = (window as any).turnstile;
  
  if (!turnstile) {
    console.error('Turnstile not loaded');
    return null;
  }

  try {
    const widgetId = turnstile.render(`#${containerId}`, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: onSuccess,
      'error-callback': onError || (() => console.error('Turnstile error')),
      theme: 'dark',
      size: 'normal',
    });

    return widgetId;
  } catch (error) {
    console.error('Error rendering Turnstile:', error);
    return null;
  }
}

/**
 * Reset Turnstile widget
 */
export function resetTurnstile(widgetId?: string): void {
  const turnstile = (window as any).turnstile;
  
  if (!turnstile) {
    return;
  }

  try {
    if (widgetId) {
      turnstile.reset(widgetId);
    } else {
      turnstile.reset();
    }
  } catch (error) {
    console.error('Error resetting Turnstile:', error);
  }
}

/**
 * Remove Turnstile widget
 */
export function removeTurnstile(widgetId: string): void {
  const turnstile = (window as any).turnstile;
  
  if (!turnstile) {
    return;
  }

  try {
    turnstile.remove(widgetId);
  } catch (error) {
    console.error('Error removing Turnstile:', error);
  }
}

/**
 * Verify Turnstile token (server-side)
 * This should be called on your backend
 */
export async function verifyTurnstileToken(token: string, secretKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}
