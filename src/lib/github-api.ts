/**
 * GitHub REST API helpers for the portfolio
 */
import { httpGet } from './http'
import { TtlCache } from './cache'
import { optionalEnv } from './env'

const BASE = 'https://api.github.com'
const TOKEN = optionalEnv('GITHUB_TOKEN', '')
const cache = new TtlCache<unknown>(5 * 60_000) // 5 min TTL

function headers(): HeadersInit {
  return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
}

export interface GithubRepo {
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  html_url: string
  language: string | null
  topics: string[]
}

export async function fetchRepo(owner: string, repo: string): Promise<GithubRepo> {
  const key = `repo:${owner}/${repo}`
  const cached = cache.get(key) as GithubRepo | undefined
  if (cached) return cached

  const data = await httpGet<GithubRepo>(`${BASE}/repos/${owner}/${repo}`, {
    headers: headers(),
  })
  cache.set(key, data)
  return data
}

export async function fetchPinnedRepos(username: string): Promise<GithubRepo[]> {
  const key = `pinned:${username}`
  const cached = cache.get(key) as GithubRepo[] | undefined
  if (cached) return cached

  const data = await httpGet<GithubRepo[]>(
    `${BASE}/users/${username}/repos?sort=stars&per_page=6`,
    { headers: headers() }
  )
  cache.set(key, data)
  return data
}
