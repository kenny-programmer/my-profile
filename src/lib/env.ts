/**
 * Environment variable validation
 */
export function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required environment variable: ${key}`)
  return val
}

export function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback
}

export const env = {
  GITHUB_TOKEN: optionalEnv('GITHUB_TOKEN', ''),
  SITE_URL: optionalEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  IS_PROD: process.env.NODE_ENV === 'production',
} as const
