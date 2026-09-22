'use client'
import { useEffect, useState } from 'react'

interface NetworkStatus { online: boolean; effectiveType?: string; downlink?: number }

export function useNetwork(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  })
  useEffect(() => {
    const update = (): void => {
      const conn = (navigator as Navigator & { connection?: { effectiveType: string; downlink: number } }).connection
      setStatus({ online: navigator.onLine, effectiveType: conn?.effectiveType, downlink: conn?.downlink })
    }
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [])
  return status
}
