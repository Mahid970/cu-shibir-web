import type { CollectionBeforeValidateHook, CollectionSlug } from 'payload'

import { slugify } from '@/lib/bn'

/**
 * Guarantees a unique Latin slug before validation. Payload's slugField only auto-generates
 * during draft saves, so direct publishes (API/imports) would otherwise fail "required".
 * Adds -2, -3… when a different document already uses the slug.
 */
export const ensureSlug =
  (source: string): CollectionBeforeValidateHook =>
  async ({ data, collection, originalDoc, req }) => {
    if (!data) return data
    const raw = data.slug || originalDoc?.slug || data[source] || originalDoc?.[source]
    if (typeof raw !== 'string' || !raw.trim()) return data

    const base = slugify(raw) || `item-${Date.now().toString(36)}`
    let candidate = base
    for (let n = 2; n < 50; n++) {
      const clash = await req.payload.find({
        collection: collection.slug as CollectionSlug,
        where: {
          and: [
            { slug: { equals: candidate } },
            ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
          ],
        },
        limit: 1,
        draft: true,
        depth: 0,
        req,
      })
      if (!clash.docs.length) break
      candidate = `${base}-${n}`
    }
    data.slug = candidate
    return data
  }
