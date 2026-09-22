'use client'
import { useEffect, useState } from 'react'

interface ScrollState { x: number; y: number; direction: 'up' | 'down' | null }

export function useScroll(): ScrollState {
  const [scroll, setScroll] = useState<ScrollState>({ x: 0, y: 0, direction: null })
  useEffect(() => {
    let last = window.scrollY
    const handler = (): void => {
      const y = window.scrollY
      setScroll({ x: window.scrollX, y, direction: y > last ? 'down' : 'up' })
      last = y
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return scroll
}
