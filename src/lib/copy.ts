'use client'
/**
 * Clipboard copy hook with feedback state
 */
import { useCallback, useState } from 'react'

export function useCopy(timeout = 2000): {
  copy: (text: string) => Promise<void>
  copied: boolean
} {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      el.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    }
  }, [timeout])

  return { copy, copied }
}
