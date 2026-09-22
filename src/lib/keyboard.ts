/**
 * Keyboard shortcut registration helper
 */
type Handler = (e: KeyboardEvent) => void

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: Handler
}

export function registerShortcut(shortcut: Shortcut): () => void {
  const listener = (e: KeyboardEvent): void => {
    const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : true
    const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey || !shortcut.shift
    const altMatch = shortcut.alt ? e.altKey : true
    if (e.key === shortcut.key && ctrlMatch && shiftMatch && altMatch) {
      shortcut.handler(e)
    }
  }
  window.addEventListener('keydown', listener)
  return () => window.removeEventListener('keydown', listener)
}
