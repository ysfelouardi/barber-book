import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'es', 'ar', 'fr']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  // Skip middleware for API routes, static files, and specific paths
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') ||
    pathname.startsWith('/admin/swagger')
  ) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Redirect to default locale if no locale in pathname
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }

  // Add default locale to pathname
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*|admin/swagger).*)'],
}
