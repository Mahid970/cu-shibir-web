import { NextResponse, type NextRequest } from 'next/server'

/**
 * Language routing. Every page lives under the [lang] segment; Bangla keeps the short URLs.
 *
 *   /news/…     → rendered as /bn/news/…  (rewrite, the address bar stays /news/…)
 *   /en/news/…  → served as it is
 *   /bn/news/…  → 308 to /news/…          (one address per page)
 *
 * The CMS (/admin, /api), Next's own files, /next/* tools and anything with a file extension
 * (sw.js, sitemap.xml, icons…) are not touched.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next()
  if (pathname === '/en' || pathname.startsWith('/en/')) return NextResponse.next()

  const url = request.nextUrl.clone()
  if (pathname === '/bn' || pathname.startsWith('/bn/')) {
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }
  url.pathname = pathname === '/' ? '/bn' : `/bn${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api/|api$|admin|_next/|__next|next/).*)'],
}
