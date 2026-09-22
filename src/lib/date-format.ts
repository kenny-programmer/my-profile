/**
 * Date formatting utilities for the portfolio
 */

const DATE_LOCALE = 'en-US'

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    year: 'numeric',
    month: 'short',
  }).format(new Date(date))
}

export function isoDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}
