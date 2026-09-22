/**
 * Clipboard utilities with legacy fallback
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      return true
    } catch { return false }
  }
}

export async function readFromClipboard(): Promise<string | null> {
  if (typeof navigator === 'undefined') return null
  try { return await navigator.clipboard.readText() } catch { return null }
}
