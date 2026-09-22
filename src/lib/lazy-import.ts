/**
 * Dynamic import wrapper with loading state
 */
import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

export function lazyComponent<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  return dynamic(importFn, {
    loading: () => (fallback as React.ReactElement) ?? null,
    ssr: false,
  })
}
