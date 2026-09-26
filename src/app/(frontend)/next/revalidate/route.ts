import { revalidateTag } from 'next/cache'
import { timingSafeEqual } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED = new Set(['posts', 'people', 'press', 'videos', 'albums', 'site-settings'])

/**
 * Cache purge for trusted scripts that write via the Local API outside Next.js
 * (e.g. `npm run import:legacy`). POST { tags: string[] } with header x-revalidate-secret.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  const given = req.headers.get('x-revalidate-secret') ?? ''
  if (!secret || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const body = (await req.json().catch(() => ({}))) as { tags?: unknown }
  const tags = (Array.isArray(body.tags) ? body.tags : [...ALLOWED]).filter(
    (t): t is string => typeof t === 'string' && ALLOWED.has(t),
  )
  for (const tag of tags) revalidateTag(tag, { expire: 0 })
  return NextResponse.json({ ok: true, revalidated: tags })
}
