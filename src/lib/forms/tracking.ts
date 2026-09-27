import 'server-only'

import { hashSecret, randomCode } from '@/lib/crypto'
import { SITE } from '@/lib/site'

/** Helpers for the form actions. Kept out of the 'use server' files so they can't be called from a browser. */

export const adminLink = (collection: string, id: number | string) => `${SITE.url}/admin/collections/${collection}/${id}`

/**
 * Save a submission under a fresh public tracking id (PREFIX-XXXXXX) and a 6-character secret code
 * that is stored only as a hash. Retries on the (unlikely) id collision.
 */
export async function withTracking<D extends { id: number | string }>(prefix: string, create: (trackingId: string, secretHash: string) => Promise<D>) {
  const code = randomCode(6)
  for (let attempt = 0; ; attempt++) {
    const trackingId = `${prefix}-${randomCode(6)}`
    try {
      return { doc: await create(trackingId, hashSecret(code)), trackingId, code }
    } catch (err) {
      if (attempt === 2 || !String(err).includes('unique')) throw err
    }
  }
}
