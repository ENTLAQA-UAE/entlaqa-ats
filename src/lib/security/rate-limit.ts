/**
 * In-memory rate limiter for auth endpoints.
 *
 * Tracks attempts per IP address and blocks when limit is exceeded.
 * Uses a sliding window approach with automatic cleanup.
 *
 * Note: In a multi-instance deployment, replace this with
 * Redis-backed rate limiting (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number
  firstAttempt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 10           // max attempts per window
const CLEANUP_INTERVAL = 60_000   // clean stale entries every 60s

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function startCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore) {
      if (now - entry.firstAttempt > WINDOW_MS) {
        rateLimitStore.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)
  // Allow Node to exit even if timer is running
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref()
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterMs: number
}

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = MAX_ATTEMPTS,
  windowMs: number = WINDOW_MS,
): RateLimitResult {
  startCleanup()

  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now - entry.firstAttempt > windowMs) {
    rateLimitStore.set(identifier, { count: 1, firstAttempt: now })
    return { allowed: true, remaining: maxAttempts - 1, retryAfterMs: 0 }
  }

  if (entry.count >= maxAttempts) {
    const retryAfterMs = windowMs - (now - entry.firstAttempt)
    return { allowed: false, remaining: 0, retryAfterMs }
  }

  entry.count++
  return { allowed: true, remaining: maxAttempts - entry.count, retryAfterMs: 0 }
}

export function resetRateLimit(identifier: string) {
  rateLimitStore.delete(identifier)
}

/** Visible for testing */
export function _clearStore() {
  rateLimitStore.clear()
}
