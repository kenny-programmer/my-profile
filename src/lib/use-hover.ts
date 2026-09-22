'use client'
import { useCallback, useRef, useState } from 'react'

export function useHover<T extends HTMLElement = HTMLDivElement>(): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [hovered, setHovered] = useState(false)
  const onMouseEnter = useCallback(() => setHovered(true), [])
  const onMouseLeave = useCallback(() => setHovered(false), [])
  return Object.assign([ref, hovered] as [React.RefObject<T>, boolean], {
    ref, hovered, onMouseEnter, onMouseLeave
  })
}
