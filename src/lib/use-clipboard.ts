'use client'
import { useCallback, useState } from 'react'
import { copyToClipboard } from './clipboard'

export function useClipboard(timeout = 2000): {
  copy: (text: string) => Promise<void>
  copied: boolean
  error: boolean
} {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)
  const copy = useCallback(async (text: string): Promise<void> => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true); setError(false)
      setTimeout(() => setCopied(false), timeout)
    } else {
      setError(true)
      setTimeout(() => setError(false), timeout)
    }
  }, [timeout])
  return { copy, copied, error }
}
