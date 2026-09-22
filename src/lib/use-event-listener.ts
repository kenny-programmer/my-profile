'use client'
import { useEffect, useRef } from 'react'

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: EventTarget = window,
  options?: AddEventListenerOptions
): void {
  const saved = useRef(handler)
  useEffect(() => { saved.current = handler }, [handler])
  useEffect(() => {
    if (!element?.addEventListener) return
    const listener = (e: Event): void => saved.current(e as WindowEventMap[K])
    element.addEventListener(eventName, listener, options)
    return () => element.removeEventListener(eventName, listener)
  }, [eventName, element, options])
}
