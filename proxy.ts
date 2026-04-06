import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = new Set([
  '/', '/login', '/signup', '/forgot-password', '/pricing',
  '/api/auth/callback', '/api/stripe/webhook',
  '/guarantee', '/teams', '/certifications', '/lifetime',
  '/affiliates', '/gift',
])

const PUBLIC_PREFIXES = ['/practice-questions']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths and static assets
  const isPublicPrefix = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  if (PUBLIC_PATHS.has(pathname) || isPublicPrefix || pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return (async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const protectedPrefixes = ['/study', '/practice', '/review', '/mock-exam', '/tutor', '/progress', '/domains', '/bookmarks', '/settings']
    const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))

    if (!user && isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (user && (pathname === '/login' || pathname === '/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = '/study'
      return NextResponse.redirect(url)
    }

    return response
  })()
}

export const proxyConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
