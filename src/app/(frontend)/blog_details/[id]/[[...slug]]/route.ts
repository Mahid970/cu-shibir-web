import { redirectLegacy } from '@/lib/legacy'

/** Legacy post URL: /blog_details/:id/:slug → /news/:slug */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return redirectLegacy('posts', id, '/news', '/news')
}
