/**
 * Component render helpers for integration tests
 */

/** Serialize a DOM element to a clean HTML string for snapshot testing */
export function serializeElement(el: Element): string {
  return el.outerHTML
    .replace(/\s+/g, ' ')
    .replace(/> </g, '>\n<')
    .trim()
}

/** Get all text content from an element, trimmed and collapsed */
export function getTextContent(el: Element): string {
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** Find all elements matching a selector and return their text content */
export function queryAllText(root: Element, selector: string): string[] {
  return Array.from(root.querySelectorAll(selector)).map(getTextContent)
}
