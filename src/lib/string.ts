/**
 * String utility helpers
 */

/** Capitalise the first letter of a string */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Convert camelCase or snake_case to Title Case */
export function toTitleCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(capitalize)
    .join(' ')
}

/** Truncate a string to max length with ellipsis */
export function truncate(str: string, max: number, suffix = '…'): string {
  return str.length <= max ? str : str.slice(0, max - suffix.length) + suffix
}

/** Count words in a string */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length
}

/** Pluralise a word based on count */
export function pluralise(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`)
}
