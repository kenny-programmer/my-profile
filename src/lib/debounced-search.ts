'use client'
/**
 * Debounced search input hook
 */
import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export function useDebouncedSearch(delay = 300): {
  query: string
  debouncedQuery: string
  setQuery: (q: string) => void
} {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, delay)
  return { query, debouncedQuery, setQuery }
}
