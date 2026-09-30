/**
 * Open Graph and Twitter card meta tag helpers.
 */

export interface OgMetaOptions {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image";
  twitterHandle?: string;
}

/** Generate Next.js \`openGraph\` metadata object. */
export function buildOpenGraph(opts: OgMetaOptions) {
  return {
    title: opts.title,
    description: opts.description,
    url: opts.url,
    type: opts.type ?? "website",
    ...(opts.image && {
      images: [{ url: opts.image, width: 1200, height: 630, alt: opts.title }],
    }),
  };
}

/** Generate Next.js \`twitter\` metadata object. */
export function buildTwitterMeta(opts: OgMetaOptions) {
  return {
    card: opts.twitterCard ?? "summary_large_image",
    title: opts.title,
    description: opts.description,
    ...(opts.twitterHandle && { creator: opts.twitterHandle }),
    ...(opts.image && { images: [opts.image] }),
  };
}

/** Build a canonical URL from a base URL and optional path. */
export function canonicalUrl(base: string, path = ""): string {
  const cleaned = path.startsWith("/") ? path : \`/\${path}\`;
  return \`\${base.replace(/\\/\$/, "")}\${cleaned}\`;
}
