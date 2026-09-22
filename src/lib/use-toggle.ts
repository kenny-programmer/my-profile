'use client'
/**
 * useToggle — boolean state toggle helper
 */
import { useCallback, useState } from 'react'

export function useToggle(
  initial = false
): [boolean, () => void, (v: boolean) => void] {
  const [state, setState] = useState(initial)
  const toggle = useCallback(() => setState((s) => !s), [])
  return [state, toggle, setState]
}
