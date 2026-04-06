/**
 * In-memory sliding window rate limiter.
 * Limits requests per IP + optional userId key within a rolling time window.
 * Works per-instance (Vercel Fluid Compute reuses instances across requests).
 */

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Clean up stale entries every 60s to prevent memory leaks
const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  const cutoff = now - windowMs
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff)
    if (entry.timestamps.length === 0) store.delete(key)
  }
}

interface RateLimitConfig {
  /** Max requests per window */
  limit: number
  /** Window size in milliseconds */
  windowMs: number
}

interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetMs: number
}

export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const cutoff = now - config.windowMs

  cleanup(config.windowMs)

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff)

  if (entry.timestamps.length >= config.limit) {
    const oldestInWindow = entry.timestamps[0]
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetMs: oldestInWindow + config.windowMs - now,
    }
  }

  entry.timestamps.push(now)
  return {
    allowed: true,
    limit: config.limit,
    remaining: config.limit - entry.timestamps.length,
    resetMs: config.windowMs,
  }
}

/** Pre-configured rate limit tiers */
export const RATE_LIMITS = {
  /** General API: 60 req/min per IP */
  api: { limit: 60, windowMs: 60_000 },
  /** AI endpoints (explain, tutor, generate): 20 req/min per user */
  ai: { limit: 20, windowMs: 60_000 },
  /** Auth endpoints (login, signup): 10 req/min per IP */
  auth: { limit: 10, windowMs: 60_000 },
  /** Mock exam creation: 5 req/min per user */
  exam: { limit: 5, windowMs: 60_000 },
} as const

/** Extract client IP from request headers */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/** Apply rate limit and return 429 response if exceeded */
export function checkRateLimit(
  request: Request,
  userId: string | null,
  tier: keyof typeof RATE_LIMITS = 'api'
): { allowed: true } | { allowed: false; response: Response } {
  const config = RATE_LIMITS[tier]
  const ip = getClientIp(request)
  const key = userId ? `${tier}:${userId}` : `${tier}:${ip}`

  const result = rateLimit(key, config)

  if (!result.allowed) {
    return {
      allowed: false,
      response: new Response(
        JSON.stringify({
          error: 'Too many requests. Please slow down.',
          retry_after_ms: result.resetMs,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(result.resetMs / 1000)),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      ),
    }
  }

  return { allowed: true }
}
