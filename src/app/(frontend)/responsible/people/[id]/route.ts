import { redirectLegacy } from '@/lib/legacy'

/** Legacy profile URL: /responsible/people/:id → /leadership/:slug */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return redirectLegacy('people', id, '/leadership', '/leadership')
}
