/**
 * JSON-LD structured data helpers for SEO.
 * @see https://schema.org
 */

export interface PersonSchema {
  name: string;
  url: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
  email?: string;
}

export interface WebSiteSchema {
  name: string;
  url: string;
  description?: string;
  author?: PersonSchema;
}

/** Generate a Person schema.org JSON-LD object. */
export function personJsonLd(person: PersonSchema): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: person.url,
    ...(person.image && { image: person.image }),
    ...(person.jobTitle && { jobTitle: person.jobTitle }),
    ...(person.description && { description: person.description }),
    ...(person.email && { email: person.email }),
    ...(person.sameAs && { sameAs: person.sameAs }),
  };
}

/** Generate a WebSite schema.org JSON-LD object. */
export function webSiteJsonLd(site: WebSiteSchema): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    ...(site.description && { description: site.description }),
    ...(site.author && { author: personJsonLd(site.author) }),
  };
}

/** Serialize a schema object to a JSON-LD script tag string. */
export function toJsonLdScript(schema: object): string {
  return JSON.stringify(schema, null, 2);
}
