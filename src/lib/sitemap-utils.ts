/**
 * Sitemap generation utilities for Next.js.
 */

export interface SitemapEntry {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/** Build a sitemap entry with sensible defaults. */
export function sitemapEntry(
  url: string,
  options: Omit<SitemapEntry, "url"> = {}
): SitemapEntry {
  return {
    url,
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency ?? "monthly",
    priority: options.priority ?? 0.5,
  };
}

/** Generate sitemap entries for a list of blog slugs. */
export function blogSitemapEntries(baseUrl: string, slugs: string[]): SitemapEntry[] {
  return slugs.map((slug) =>
    sitemapEntry(\`\${baseUrl}/blog/\${slug}\`, {
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );
}

/** Generate sitemap entries for static pages. */
export function staticSitemapEntries(baseUrl: string): SitemapEntry[] {
  return [
    sitemapEntry(baseUrl, { priority: 1.0, changeFrequency: "weekly" }),
    sitemapEntry(\`\${baseUrl}/blog\`, { priority: 0.8, changeFrequency: "weekly" }),
  ];
}
