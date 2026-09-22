'use client'
import { useEffect, useRef, useState } from 'react'

const EVENTS: (keyof WindowEventMap)[] = ['mousemove','mousedown','touchstart','keydown','scroll']

/** Detect user inactivity after a timeout period */
export function useIdle(ms = 30_000): boolean {
  const [idle, setIdle] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const reset = (): void => {
      setIdle(false)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setIdle(true), ms)
    }
    reset()
    EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    return () => { if (timer.current) clearTimeout(timer.current); EVENTS.forEach((e) => window.removeEventListener(e, reset)) }
  }, [ms])
  return idle
}
