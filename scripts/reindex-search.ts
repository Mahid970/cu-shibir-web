/**
 * Rebuild the search index (`searchText`) of every post, e.g. after an import or a change to
 * the normaliser. Safe to re-run.
 *
 *   npm run search:reindex
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const payload = await getPayload({ config })
const context = { disableRevalidate: true, skipShareImage: true }
let page = 1
let done = 0
for (;;) {
  const { docs, hasNextPage } = await payload.find({ collection: 'posts', limit: 50, page, depth: 0, locale: 'bn', draft: false, pagination: true })
  for (const doc of docs) {
    // An empty update runs the beforeChange hook, which recomputes searchText from the saved fields.
    await payload.update({ collection: 'posts', id: doc.id, locale: 'bn', data: {}, context })
    done++
  }
  if (!hasNextPage) break
  page++
}
payload.logger.info(`search index rebuilt for ${done} posts`)
process.exit(0)
