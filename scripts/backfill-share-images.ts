/**
 * Generate Bangla share cards for published posts that don't have one yet
 * (new posts get them automatically via the generateShareImage job).
 *
 *   npm run og:backfill            # only missing
 *   npm run og:backfill -- --all   # regenerate every post
 */
import 'dotenv/config'
import { createLocalReq, getPayload } from 'payload'

import { attachShareImage } from '../src/jobs/attachShareImage'
import { closeRenderer } from '../src/lib/og/render'
import config from '../src/payload.config'

const all = process.argv.includes('--all')
const payload = await getPayload({ config })
const req = await createLocalReq({}, payload)

const { docs } = await payload.find({
  collection: 'posts',
  limit: 1000,
  depth: 0,
  where: { and: [{ _status: { equals: 'published' } }, ...(all ? [] : [{ shareImage: { exists: false } }])] },
})
console.log(`Rendering ${docs.length} share card(s)…`)
for (const post of docs) {
  const id = await attachShareImage(req, post.id)
  console.log(`  ✓ ${post.slug} → media #${id}`)
}
await closeRenderer()
process.exit(0)
