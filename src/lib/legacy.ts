import 'server-only'

import { permanentRedirect } from 'next/navigation'

import { getPayloadClient } from './cms'

/**
 * Old cushibir.org URLs carry numeric ids (e.g. /blog_details/12/slug). Records imported from the
 * legacy API keep that id in `legacyId`, so old links shared on Facebook land on the new page.
 */
export async function redirectLegacy(collection: 'posts' | 'people', rawId: string, base: string, fallback: string): Promise<never> {
  const id = Number(rawId)
  if (Number.isInteger(id) && id > 0) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection,
      where: { and: [{ legacyId: { equals: id } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 0,
      select: { slug: true },
    })
    const slug = docs[0]?.slug
    if (slug) permanentRedirect(`${base}/${slug}`)
  }
  permanentRedirect(fallback)
}
