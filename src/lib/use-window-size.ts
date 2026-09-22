'use client'
import { useEffect, useState } from 'react'

interface WindowSize { width: number; height: number }

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 })
  useEffect(() => {
    const update = (): void => setSize({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}
