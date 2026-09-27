import { NextResponse, type NextRequest } from 'next/server'

/**
 * Language routing. Every page lives under the [lang] segment; Bangla keeps the short URLs.
 *
 *   /news/…     → rendered as /bn/news/…  (rewrite, the address bar stays /news/…)
 *   /en/news/…  → served as it is
 *   /bn/news/…  → served as it is
 *
 * /bn/… must pass through untouched: in production Next runs the proxy again on the rewritten
 * address, so redirecting it back to /news/… would loop. Nothing links to /bn/…, and those pages
 * carry the short URL as their canonical.
 *
 * The CMS (/admin, /api), Next's own files, /next/* tools and anything with a file extension
 * (sw.js, sitemap.xml, icons…) are not touched.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next()
  if (/^\/(en|bn)(\/|$)/.test(pathname)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? '/bn' : `/bn${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api/|api$|admin|_next/|__next|next/).*)'],
}
