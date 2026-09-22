# API Routes Guide

## Response Helpers
All API routes should use helpers from `src/lib/response.ts`:

```ts
import { ok, notFound, badRequest, tooManyRequests } from '@/lib/response'

export async function GET() {
  return ok({ message: 'Hello' })
}
```

## Rate Limiting
Protect public routes with `RateLimiter`:

```ts
const limiter = new RateLimiter(10, 60_000) // 10 req/min per IP
if (!limiter.allow(ip)) return tooManyRequests()
```

## Error Handling
Throw `AppError`, `NotFoundError`, or `ValidationError` from `src/lib/error.ts`.
