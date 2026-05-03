import React, { useEffect, useState } from 'react'

export default function SuppaChatLoader(): JSX.Element | null {
  const [Comp, setComp] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    let mounted = true
    // Dynamic import only on client
    import('./SuppaChat').then(mod => {
      if (mounted) setComp(() => mod.default)
    }).catch(() => {
      // ignore; keep silent fallback
    })
    return () => { mounted = false }
  }, [])

  if (!Comp) return null
  return <Comp />
}
