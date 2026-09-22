# SEO Guide

## Meta Tags
Every page should call `buildMetaTags()` with a unique title and description.
Titles: 50–60 characters. Descriptions: 150–160 characters.

## Structured Data
- Home page: use `personSchema()` for rich results
- Blog posts: use `articleSchema()` + `breadcrumbSchema()`

## Canonical URLs
Always call `canonicalUrl()` to prevent duplicate content issues.
Trailing slashes are stripped automatically (except root `/`).

## Sitemap
Add new routes to `app/sitemap.ts` using `buildSitemapEntry()`.
