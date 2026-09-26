import { NextResponse } from 'next/server'

import { search } from '@/lib/search'

/** JSON results for the search palette in the header. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q') ?? ''
  const hits = await search(q, { limit: 8 })
  return NextResponse.json({ q, hits }, { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } })
}
