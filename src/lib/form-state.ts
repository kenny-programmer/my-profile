'use client'
/**
 * Simple form state management hook
 */
import { useCallback, useState } from 'react'

export type FormErrors<T> = Partial<Record<keyof T, string>>

export interface UseFormReturn<T> {
  values: T
  errors: FormErrors<T>
  touched: Partial<Record<keyof T, boolean>>
  setValue: <K extends keyof T>(field: K, value: T[K]) => void
  setError: <K extends keyof T>(field: K, message: string) => void
  touch: <K extends keyof T>(field: K) => void
  reset: () => void
  hasErrors: boolean
}

export function useForm<T extends Record<string, unknown>>(
  initialValues: T
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const setError = useCallback(<K extends keyof T>(field: K, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }, [])

  const touch = useCallback(<K extends keyof T>(field: K) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values, errors, touched,
    setValue, setError, touch, reset,
    hasErrors: Object.keys(errors).length > 0,
  }
}
