// src/components/ui/SmartsuppWidget.tsx
import React, { useEffect } from 'react'

const SMARTSUPP_KEY = '839836d7dbe80ca378391bb9be0798c59b8c2cd6'

const SmartsuppWidget: React.FC = () => {
  useEffect(() => {
    // set the key on the global object as the original snippet does
    ;(window as any)._smartsupp = (window as any)._smartsupp || {}
    ;(window as any)._smartsupp.key = SMARTSUPP_KEY

    // Avoid injecting the loader twice
    if ((window as any).smartsupp) return

    const d = document
    const s = d.getElementsByTagName('script')[0]
    const c = d.createElement('script')
    c.type = 'text/javascript'
    c.charset = 'utf-8'
    c.async = true
    c.src = 'https://www.smartsuppchat.com/loader.js?'
    s.parentNode?.insertBefore(c, s)

    // Add CSS to move Smartsupp launcher to the left side when it appears
    const style = document.createElement('style')
    style.id = 'smartsupp-left-style'
    style.innerHTML = `
      /* Move Smartsupp launcher to bottom-left */
      .smartsupp-launcher, .smartsupp-chat, [id^="smartsupp"], .smartsupp-widget {
        right: auto !important;
        left: 24px !important;
        bottom: 24px !important;
        z-index: 99999 !important;
      }

      /* Mobile adjustments */
      @media (max-width: 600px) {
        .smartsupp-launcher, .smartsupp-chat, [id^="smartsupp"], .smartsupp-widget {
          left: 16px !important;
          bottom: 16px !important;
        }
        .smartsupp-chat {
          max-width: calc(100vw - 32px) !important;
          width: calc(100vw - 32px) !important;
          left: 16px !important;
          right: 16px !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      // cleanup: remove injected script and injected style if present
      if (c.parentNode) c.parentNode.removeChild(c)
      const existing = document.getElementById('smartsupp-left-style')
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing)
    }
  }, [])

  return (
    <noscript>
      Powered by <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">Smartsupp</a>
    </noscript>
  )
}

export default SmartsuppWidget
