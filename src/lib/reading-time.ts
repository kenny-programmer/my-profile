/**
 * Estimate reading time for blog posts
 */
const WORDS_PER_MINUTE = 200

export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / WORDS_PER_MINUTE)
  return minutes === 1 ? '1 min read' : `${minutes} min read`
}
