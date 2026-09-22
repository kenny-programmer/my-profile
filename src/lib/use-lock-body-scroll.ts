'use client'
import { useEffect } from 'react'

/** Prevent body scroll (for modals), compensates for scrollbar width */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const orig = document.body.style.overflow
    const origPad = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => { document.body.style.overflow = orig; document.body.style.paddingRight = origPad }
  }, [locked])
}
