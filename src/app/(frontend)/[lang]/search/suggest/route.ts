import { NextResponse } from 'next/server'

import { toLocale } from '@/i18n/config'
import { search } from '@/lib/search'

/** JSON results for the search palette in the header, in the page's language. */
export async function GET(req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const lang = toLocale((await params).lang)
  const q = new URL(req.url).searchParams.get('q') ?? ''
  const hits = await search(q, { limit: 8, lang })
  return NextResponse.json({ q, hits }, { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } })
}
