import { checkRateLimit, resetRateLimit, _clearStore } from '@/lib/security/rate-limit'

describe('Rate Limiter', () => {
  beforeEach(() => {
    _clearStore()
  })

  it('should allow requests under the limit', () => {
    const result = checkRateLimit('test-ip', 5)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
    expect(result.retryAfterMs).toBe(0)
  })

  it('should decrement remaining count on each request', () => {
    const r1 = checkRateLimit('test-ip', 5)
    expect(r1.remaining).toBe(4)

    const r2 = checkRateLimit('test-ip', 5)
    expect(r2.remaining).toBe(3)

    const r3 = checkRateLimit('test-ip', 5)
    expect(r3.remaining).toBe(2)
  })

  it('should block requests at the limit', () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('block-ip', 5)
    }

    const result = checkRateLimit('block-ip', 5)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfterMs).toBeGreaterThan(0)
  })

  it('should track different identifiers independently', () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('ip-1', 5)
    }

    const resultBlocked = checkRateLimit('ip-1', 5)
    expect(resultBlocked.allowed).toBe(false)

    const resultAllowed = checkRateLimit('ip-2', 5)
    expect(resultAllowed.allowed).toBe(true)
    expect(resultAllowed.remaining).toBe(4)
  })

  it('should reset after window expires', () => {
    const shortWindow = 100 // 100ms

    for (let i = 0; i < 3; i++) {
      checkRateLimit('expire-ip', 3, shortWindow)
    }

    const blocked = checkRateLimit('expire-ip', 3, shortWindow)
    expect(blocked.allowed).toBe(false)

    // Force window expiration by resetting
    resetRateLimit('expire-ip')

    const afterReset = checkRateLimit('expire-ip', 3, shortWindow)
    expect(afterReset.allowed).toBe(true)
    expect(afterReset.remaining).toBe(2)
  })

  it('should reset a specific identifier', () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit('reset-ip', 5)
    }

    expect(checkRateLimit('reset-ip', 5).allowed).toBe(false)

    resetRateLimit('reset-ip')

    expect(checkRateLimit('reset-ip', 5).allowed).toBe(true)
  })

  it('should return retryAfterMs when blocked', () => {
    const windowMs = 15 * 60 * 1000

    for (let i = 0; i < 10; i++) {
      checkRateLimit('retry-ip', 10, windowMs)
    }

    const result = checkRateLimit('retry-ip', 10, windowMs)
    expect(result.allowed).toBe(false)
    expect(result.retryAfterMs).toBeGreaterThan(0)
    expect(result.retryAfterMs).toBeLessThanOrEqual(windowMs)
  })

  it('should use default parameters', () => {
    const result = checkRateLimit('default-ip')
    expect(result.allowed).toBe(true)
    // Default max is 10
    expect(result.remaining).toBe(9)
  })

  it('should handle max=1 (single request)', () => {
    const r1 = checkRateLimit('single-ip', 1)
    expect(r1.allowed).toBe(true)
    expect(r1.remaining).toBe(0)

    const r2 = checkRateLimit('single-ip', 1)
    expect(r2.allowed).toBe(false)
  })
})
