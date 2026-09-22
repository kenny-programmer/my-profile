/**
 * Resource preloading helpers for critical assets
 */
export function preloadImage(src: string): void {
  if (typeof window === 'undefined') return
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  document.head.appendChild(link)
}

export function preloadFont(href: string, type = 'font/woff2'): void {
  if (typeof document === 'undefined') return
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'font'
  link.type = type
  link.href = href
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}
