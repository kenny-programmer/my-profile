'use client'
import { useEffect, useState } from 'react'

/** Returns true only after client-side hydration */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

/** Run a callback once on client mount */
export function useMount(callback: () => void): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { callback() }, [])
}
