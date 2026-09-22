'use client'
/**
 * Form persistence — save/restore form state from sessionStorage
 */
import { useEffect } from 'react'

export function useFormPersist<T extends Record<string, unknown>>(
  formKey: string,
  values: T,
  setValue: <K extends keyof T>(field: K, value: T[K]) => void
): { clear: () => void } {
  // Restore on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`form:${formKey}`)
      if (!saved) return
      const parsed = JSON.parse(saved) as T
      for (const [field, value] of Object.entries(parsed)) {
        setValue(field as keyof T, value as T[keyof T])
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formKey])

  // Persist on change
  useEffect(() => {
    try {
      sessionStorage.setItem(`form:${formKey}`, JSON.stringify(values))
    } catch {}
  }, [formKey, values])

  return {
    clear: () => {
      try { sessionStorage.removeItem(`form:${formKey}`) } catch {}
    },
  }
}
