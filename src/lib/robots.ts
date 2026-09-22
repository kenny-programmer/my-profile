/**
 * Robots.txt rule builder
 */
export interface RobotsRule {
  userAgent: string
  allow?: string[]
  disallow?: string[]
  crawlDelay?: number
}

export function buildRobots(rules: RobotsRule[], sitemap?: string): string {
  const lines: string[] = []
  for (const rule of rules) {
    lines.push(`User-agent: ${rule.userAgent}`)
    for (const path of rule.allow ?? []) lines.push(`Allow: ${path}`)
    for (const path of rule.disallow ?? []) lines.push(`Disallow: ${path}`)
    if (rule.crawlDelay !== undefined) lines.push(`Crawl-delay: ${rule.crawlDelay}`)
    lines.push('')
  }
  if (sitemap) lines.push(`Sitemap: ${sitemap}`)
  return lines.join('\n')
}
