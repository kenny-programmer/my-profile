/**
 * Blog API — reads from static data only (no filesystem).
 * All content lives in blog-posts.ts for reliable builds (e.g. on Vercel).
 */

import { BLOG_POSTS } from "./blog-posts";

export async function getBlogPosts() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
    metadata: post.metadata,
    source: post.source,
  }));
}

export async function getPost(slug: string) {
  const post = BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  return post;
}
