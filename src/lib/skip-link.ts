/**
 * Skip-to-content link helper
 */
export function injectSkipLink(targetId = 'main-content'): void {
  if (typeof document === 'undefined') return
  if (document.getElementById('skip-link')) return

  const link = document.createElement('a')
  link.id = 'skip-link'
  link.href = `#${targetId}`
  link.textContent = 'Skip to main content'
  link.className = [
    'fixed top-0 left-0 z-[9999] -translate-y-full',
    'focus:translate-y-0 transition-transform',
    'bg-primary text-primary-foreground px-4 py-2 text-sm font-medium',
  ].join(' ')
  document.body.prepend(link)
}
