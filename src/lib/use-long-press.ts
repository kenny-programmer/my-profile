'use client'
import { useCallback, useRef } from 'react'

interface LongPressOptions { delay?: number; onStart?: () => void; onCancel?: () => void }

export function useLongPress(callback: () => void, { delay = 500, onStart, onCancel }: LongPressOptions = {}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const start = useCallback(() => {
    onStart?.()
    timer.current = setTimeout(callback, delay)
  }, [callback, delay, onStart])
  const stop = useCallback((cancel = false) => {
    if (timer.current) clearTimeout(timer.current)
    if (cancel) onCancel?.()
  }, [onCancel])
  return {
    onMouseDown: () => start(), onMouseUp: () => stop(),
    onMouseLeave: () => stop(true), onTouchStart: () => start(), onTouchEnd: () => stop(),
  }
}
