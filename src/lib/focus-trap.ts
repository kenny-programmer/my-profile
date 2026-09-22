/**
 * Focus trap for accessible modals and dialogs
 */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function trapFocus(container: HTMLElement): () => void {
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last?.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first?.focus() }
    }
  }

  container.addEventListener('keydown', handleKeydown)
  first?.focus()
  return () => container.removeEventListener('keydown', handleKeydown)
}
