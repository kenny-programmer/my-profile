'use client'
import { useEffect } from 'react'

interface HotkeyOptions { ctrl?: boolean; shift?: boolean; alt?: boolean; enabled?: boolean }

export function useHotkey(key: string, handler: (e: KeyboardEvent) => void, options: HotkeyOptions = {}): void {
  const { ctrl = false, shift = false, alt = false, enabled = true } = options
  useEffect(() => {
    if (!enabled) return
    const listener = (e: KeyboardEvent): void => {
      if (e.key === key && (ctrl ? e.ctrlKey || e.metaKey : true) && (shift ? e.shiftKey : true) && (alt ? e.altKey : true)) {
        handler(e)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [key, handler, ctrl, shift, alt, enabled])
}
