'use client'
/**
 * React portal hook for rendering outside component tree
 */
import { useEffect, useRef } from 'react'

export function usePortal(id = 'portal-root'): HTMLElement | null {
  const portalRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let el = document.getElementById(id)
    let created = false
    if (!el) {
      el = document.createElement('div')
      el.id = id
      document.body.appendChild(el)
      created = true
    }
    portalRef.current = el

    return () => {
      if (created && el && document.body.contains(el)) {
        document.body.removeChild(el)
      }
    }
  }, [id])

  return portalRef.current
}
