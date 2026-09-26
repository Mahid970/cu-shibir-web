import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Purge Next.js cache tags after content changes so ISR pages update immediately.
 * `{ expire: 0 }` = hard expiry; Next 16's 'max' profile would serve one stale response first.
 * Scripts (e.g. the legacy import) run outside Next and pass `context.disableRevalidate`.
 */
export async function purge(tags: string[]) {
  try {
    const { revalidateTag } = await import('next/cache')
    for (const tag of tags) revalidateTag(tag, { expire: 0 })
  } catch {
    // Not running inside a Next.js request (CLI/scripts) — nothing to purge.
  }
}

export const revalidateAfterChange =
  (tag: string): CollectionAfterChangeHook =>
  async ({ doc, context }) => {
    if (!context.disableRevalidate) await purge([tag, `${tag}:${doc.slug ?? doc.id}`])
    return doc
  }

export const revalidateAfterDelete =
  (tag: string): CollectionAfterDeleteHook =>
  async ({ doc, context }) => {
    if (!context.disableRevalidate) await purge([tag, `${tag}:${doc.slug ?? doc.id}`])
    return doc
  }

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  async ({ doc, context }) => {
    if (!context.disableRevalidate) await purge([tag])
    return doc
  }
