'use client'
import { useEffect, useState } from 'react'

/** Detect when the page tab is active or hidden */
export function usePageVisibility(): boolean {
  const [visible, setVisible] = useState(
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true
  )
  useEffect(() => {
    const handler = (): void => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])
  return visible
}
