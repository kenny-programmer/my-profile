'use client'
/**
 * IntersectionObserver hook for scroll-triggered animations
 */
import { useEffect, useRef, useState } from 'react'

interface UseIntersectionOptions {
  threshold?: number | number[]
  rootMargin?: string
  once?: boolean
}

export function useIntersection<T extends Element = HTMLDivElement>(
  options: UseIntersectionOptions = {}
): [React.RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [threshold, rootMargin, once])

  return [ref, isVisible]
}
