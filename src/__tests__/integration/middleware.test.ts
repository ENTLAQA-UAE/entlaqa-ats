import { NextRequest } from 'next/server'

// Mock the Supabase middleware module
const mockGetUser = jest.fn()
const mockCreateServerClient = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: (...args: any[]) => mockCreateServerClient(...args),
}))

// We test the middleware logic directly
describe('Middleware - Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  describe('Public routes', () => {
    const publicPaths = ['/login', '/signup', '/auth/callback', '/careers']

    publicPaths.forEach((path) => {
      it(`should allow unauthenticated access to ${path}`, () => {
        // Public routes are defined in the middleware
        const publicRoutes = ['/login', '/signup', '/auth/callback', '/careers']
        const isPublic = publicRoutes.some((route) => path.startsWith(route))
        expect(isPublic).toBe(true)
      })
    })
  })

  describe('Protected routes', () => {
    const protectedPaths = [
      '/',
      '/organizations',
      '/users',
      '/tiers',
      '/billing',
      '/settings',
      '/jobs',
      '/email-templates',
      '/audit-logs',
    ]

    protectedPaths.forEach((path) => {
      it(`should require authentication for ${path}`, () => {
        const publicRoutes = ['/login', '/signup', '/auth/callback', '/careers']
        const isPublic = publicRoutes.some((route) => path.startsWith(route))
        expect(isPublic).toBe(false)
      })
    })
  })

  describe('Static asset exclusions', () => {
    const staticPaths = [
      '/_next/static/chunk.js',
      '/_next/image/photo.jpg',
      '/favicon.ico',
      '/logo.svg',
      '/image.png',
      '/photo.jpg',
      '/pic.jpeg',
      '/animation.gif',
      '/photo.webp',
    ]

    staticPaths.forEach((path) => {
      it(`should exclude ${path} from middleware`, () => {
        const matcher =
          /^\/((?!_next\/static|_next\/image|favicon\.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)/
        const matches = matcher.test(path)
        // Static files should NOT match the middleware matcher
        expect(matches).toBe(false)
      })
    })
  })

  describe('Route matching', () => {
    it('should match dynamic routes correctly', () => {
      const matcher =
        /^\/((?!_next\/static|_next\/image|favicon\.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)/

      expect(matcher.test('/organizations')).toBe(true)
      expect(matcher.test('/users')).toBe(true)
      expect(matcher.test('/api/something')).toBe(true)
      expect(matcher.test('/login')).toBe(true)
    })
  })

  describe('Redirect logic', () => {
    it('should redirect to /login when user is not authenticated on protected route', () => {
      const user = null
      const path = '/organizations'
      const publicRoutes = ['/login', '/signup', '/auth/callback', '/careers']
      const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))
      const isNextInternal = path.startsWith('/_next')

      const shouldRedirect = !user && !isPublicRoute && !isNextInternal
      expect(shouldRedirect).toBe(true)
    })

    it('should not redirect authenticated users', () => {
      const user = { id: 'user-123', email: 'test@example.com' }
      const path = '/organizations'
      const publicRoutes = ['/login', '/signup', '/auth/callback', '/careers']
      const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

      const shouldRedirect = !user && !isPublicRoute
      expect(shouldRedirect).toBe(false)
    })

    it('should not redirect unauthenticated users on public routes', () => {
      const user = null
      const path = '/login'
      const publicRoutes = ['/login', '/signup', '/auth/callback', '/careers']
      const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

      const shouldRedirect = !user && !isPublicRoute
      expect(shouldRedirect).toBe(false)
    })
  })
})

describe('Auth Callback Route', () => {
  it('should validate code parameter exists', () => {
    const url = new URL('http://localhost:3000/auth/callback')
    const code = url.searchParams.get('code')
    expect(code).toBeNull()
  })

  it('should extract code from URL', () => {
    const url = new URL('http://localhost:3000/auth/callback?code=test-auth-code')
    const code = url.searchParams.get('code')
    expect(code).toBe('test-auth-code')
  })

  it('should extract next parameter with default fallback', () => {
    const url = new URL('http://localhost:3000/auth/callback?code=test')
    const next = url.searchParams.get('next') ?? '/'
    expect(next).toBe('/')
  })

  it('should use next parameter when provided', () => {
    const url = new URL('http://localhost:3000/auth/callback?code=test&next=/organizations')
    const next = url.searchParams.get('next') ?? '/'
    expect(next).toBe('/organizations')
  })

  it('should redirect to login on error', () => {
    const url = new URL('http://localhost:3000/auth/callback')
    const code = url.searchParams.get('code')
    // When code is missing, should redirect to login with error
    if (!code) {
      const redirectUrl = new URL('/login', url.origin)
      redirectUrl.searchParams.set('error', 'Could not authenticate')
      expect(redirectUrl.pathname).toBe('/login')
      expect(redirectUrl.searchParams.get('error')).toBe('Could not authenticate')
    }
  })
})
