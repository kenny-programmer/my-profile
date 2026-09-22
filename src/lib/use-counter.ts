'use client'
/**
 * useCounter — numeric counter state with min/max bounds
 */
import { useCallback, useState } from 'react'

interface UseCounterOptions {
  initial?: number
  min?: number
  max?: number
  step?: number
}

export function useCounter(options: UseCounterOptions = {}): {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  set: (n: number) => void
} {
  const { initial = 0, min = -Infinity, max = Infinity, step = 1 } = options
  const [count, setCount] = useState(initial)

  const clamp = (n: number): number => Math.min(Math.max(n, min), max)

  const increment = useCallback(() => setCount((c) => clamp(c + step)), [min, max, step])
  const decrement = useCallback(() => setCount((c) => clamp(c - step)), [min, max, step])
  const reset = useCallback(() => setCount(initial), [initial])
  const set = useCallback((n: number) => setCount(clamp(n)), [min, max])

  return { count, increment, decrement, reset, set }
}
