import React from 'react'

export default function DevIndicator() {
  // Use Vite's import.meta.env.PROD to detect production builds without referencing Node's `process`.
  // This avoids TypeScript errors in browser environments where `process` may not be defined.
  if (import.meta.env && (import.meta.env as any).PROD) return null
  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, background: '#0b74de', color: 'white', padding: '6px 8px', borderRadius: 6, zIndex: 9999, fontSize: 12 }}>
      DEV: App mounted
    </div>
  )
}
