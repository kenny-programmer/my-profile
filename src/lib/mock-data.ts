/**
 * Factory functions for generating mock data in tests
 */

export interface MockProject {
  id: string
  title: string
  description: string
  tags: string[]
  url: string
  stars: number
}

export interface MockBlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  readingTime: string
  tags: string[]
}

export function mockProject(overrides: Partial<MockProject> = {}): MockProject {
  return {
    id: 'proj-1',
    title: 'Test Project',
    description: 'A test project for unit tests',
    tags: ['TypeScript', 'React'],
    url: 'https://github.com/kenny-programmer/test-project',
    stars: 42,
    ...overrides,
  }
}

export function mockBlogPost(overrides: Partial<MockBlogPost> = {}): MockBlogPost {
  return {
    slug: 'test-post',
    title: 'Test Blog Post',
    description: 'A test blog post for unit tests',
    publishedAt: '2026-01-15',
    readingTime: '3 min read',
    tags: ['TypeScript', 'Next.js'],
    ...overrides,
  }
}
