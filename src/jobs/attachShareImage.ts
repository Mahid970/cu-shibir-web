import type { PayloadRequest } from 'payload'

import { formatDate } from '@/lib/bn'
import { renderShareCard } from '@/lib/og/render'
import { POST_CATEGORIES } from '@/lib/taxonomy'

/** Render + attach the Bangla share card for one post. Shared by the job and the backfill script. */
export async function attachShareImage(req: PayloadRequest, postId: number): Promise<number | null> {
  const { payload } = req
  const post = await payload.findByID({ collection: 'posts', id: postId, depth: 0, locale: 'bn', req })
  if (!post || post._status !== 'published') return null

  const image = await renderShareCard({
    title: post.title,
    kicker: POST_CATEGORIES.find((c) => c.value === post.category)?.label.bn,
    category: post.category,
    meta: formatDate(post.publishedAt),
  })

  const media = await payload.create({
    collection: 'media',
    data: { alt: post.title.slice(0, 250), caption: 'স্বয়ংক্রিয় শেয়ার ছবি' },
    file: { data: image, mimetype: 'image/jpeg', name: `share-${post.slug ?? post.id}.jpg`, size: image.length },
    req,
  })

  const previous = typeof post.shareImage === 'number' ? post.shareImage : post.shareImage?.id
  await payload.update({
    collection: 'posts',
    id: post.id,
    data: { shareImage: media.id },
    context: { skipShareImage: true },
    req,
  })
  if (previous) await payload.delete({ collection: 'media', id: previous, req }).catch(() => undefined)
  return media.id
}
