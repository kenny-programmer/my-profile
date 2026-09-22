/**
 * Accessibility helper utilities
 */

let counter = 0
export function uniqueId(prefix = 'id'): string {
  return `${prefix}-${++counter}`
}

export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') return
  const el = document.createElement('div')
  el.setAttribute('aria-live', priority)
  el.setAttribute('aria-atomic', 'true')
  el.className = 'sr-only'
  document.body.appendChild(el)
  setTimeout(() => {
    el.textContent = message
    setTimeout(() => document.body.removeChild(el), 3000)
  }, 100)
}
