/**
 * DOM utility helpers
 */

export function scrollToElement(id: string, options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }): void {
  document.getElementById(id)?.scrollIntoView(options)
}

export function getScrollPercent(): number {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  return scrollTop / (scrollHeight - clientHeight)
}

export function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top >= 0 && rect.left >= 0 &&
    rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
}

export function lockScroll(): void { document.body.style.overflow = 'hidden' }
export function unlockScroll(): void { document.body.style.overflow = '' }
