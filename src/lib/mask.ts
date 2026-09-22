/**
 * Input masking utilities
 */

/** Format a phone number as (xxx) xxx-xxxx */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

/** Format a credit card number as xxxx xxxx xxxx xxxx */
export function maskCard(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})/g, '$1 ')
    .trim()
}

/** Strip all non-digit characters */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}
