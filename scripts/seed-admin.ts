/**
 * Creates the local development super-admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env.
 * Safe to re-run: does nothing if any user already exists. Never use in production.
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to seed an admin in production.')
  process.exit(1)
}

const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD
if (!email || !password) {
  console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env first.')
  process.exit(1)
}

const payload = await getPayload({ config })
const { totalDocs } = await payload.count({ collection: 'users' })

if (totalDocs > 0) {
  console.log(`Users already exist (${totalDocs}); skipping.`)
} else {
  const user = await payload.create({
    collection: 'users',
    data: { email, password, name: 'Local Admin', roles: ['super-admin'] },
  })
  console.log(`Created super-admin ${user.email} (password is in .env).`)
}
process.exit(0)
