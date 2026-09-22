/**
 * API response TypeScript types
 */

export interface ApiResponse<T = unknown> {
  success: boolean; data?: T; error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number; perPage: number; total: number
    totalPages: number; hasNext: boolean; hasPrev: boolean
  }
}

export interface GithubContribution {
  date: string; count: number; level: 0 | 1 | 2 | 3 | 4
}
