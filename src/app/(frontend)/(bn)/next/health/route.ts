import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/cms'

export const dynamic = 'force-dynamic'

/** Liveness + database check for Docker/Coolify health checks and uptime monitors. */
export async function GET() {
  try {
    const payload = await getPayloadClient()
    await payload.count({ collection: 'posts', where: { _status: { equals: 'published' } } })
    return NextResponse.json({ ok: true }, { headers: { 'cache-control': 'no-store' } })
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers: { 'cache-control': 'no-store' } })
  }
}
