/**
 * Lightweight analytics helper (privacy-first, no PII)
 */
type EventName =
  | 'page_view'
  | 'project_click'
  | 'resume_download'
  | 'blog_read'
  | 'contact_click'

export function trackEvent(event: EventName, meta?: Record<string, string>): void {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics]', event, meta)
    return
  }
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, meta, ts: Date.now() }),
  }).catch(() => { /* non-critical */ })
}
