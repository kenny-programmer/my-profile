/**
 * Shared TypeScript utility and domain types
 */

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
export type ArrayItem<T> = T extends (infer I)[] ? I : never
export type Nullable<T> = T | null | undefined

export interface Project {
  id: string; title: string; description: string
  tags: string[]; url: string; image?: string; stars?: number
}

export interface BlogPost {
  slug: string; title: string; description: string
  publishedAt: string; readingTime?: string; tags: string[]; featured?: boolean
}

export interface WorkExperience {
  company: string; role: string; start: string; end?: string; description: string[]
}
