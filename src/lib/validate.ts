/**
 * Validation rule helpers (framework-agnostic)
 */
export type ValidationResult = { valid: true } | { valid: false; message: string }

export function required(value: unknown): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: 'This field is required' }
  }
  return { valid: true }
}

export function minLength(min: number) {
  return (value: string): ValidationResult =>
    value.length >= min
      ? { valid: true }
      : { valid: false, message: `Must be at least ${min} characters` }
}

export function maxLength(max: number) {
  return (value: string): ValidationResult =>
    value.length <= max
      ? { valid: true }
      : { valid: false, message: `Must be at most ${max} characters` }
}

export function isEmail(value: string): ValidationResult {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? { valid: true }
    : { valid: false, message: 'Enter a valid email address' }
}

export function isUrl(value: string): ValidationResult {
  try { new URL(value); return { valid: true } }
  catch { return { valid: false, message: 'Enter a valid URL' } }
}
