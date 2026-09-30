/**
 * Robots.txt configuration helper for Next.js.
 * Use with Next.js App Router's robots.ts file.
 */

export interface RobotsRule {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
}

export interface RobotsConfig {
  rules: RobotsRule[];
  sitemap?: string | string[];
  host?: string;
}

/** Build a permissive robots config (allow all, link to sitemap). */
export function publicRobotsConfig(siteUrl: string): RobotsConfig {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: \`\${siteUrl}/sitemap.xml\`,
    host: siteUrl,
  };
}

/** Build a restricted robots config (disallow all crawlers). */
export function privateRobotsConfig(): RobotsConfig {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
