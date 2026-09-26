import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { bnBd } from '@payloadcms/translations/languages/bnBd'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Albums } from './collections/Albums'
import { Media } from './collections/Media'
import { People } from './collections/People'
import { Posts } from './collections/Posts'
import { PressCoverage } from './collections/PressCoverage'
import { Users } from './collections/Users'
import { Videos } from './collections/Videos'
import { SiteSettings } from './globals/SiteSettings'
import { generateShareImageTask } from './jobs/generateShareImage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · CU Shibir CMS' },
  },
  collections: [Posts, People, PressCoverage, Videos, Albums, Media, Users],
  globals: [SiteSettings],
  // Content is Bangla-first; English falls back to Bangla until translated.
  localization: {
    locales: [
      { code: 'bn', label: 'বাংলা' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'bn',
    fallback: true,
  },
  // Admin UI language (each editor can switch in their account settings).
  i18n: {
    supportedLanguages: { 'bn-BD': bnBd, en },
    fallbackLanguage: 'en',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),
  // Runs scheduled publish/unpublish jobs on the long-running VPS server.
  jobs: {
    tasks: [generateShareImageTask],
    autoRun: [{ cron: '* * * * *', queue: 'default', limit: 20 }],
    shouldAutoRun: () => process.env.PAYLOAD_DISABLE_JOBS !== 'true',
  },
  cors: [serverURL],
  csrf: [serverURL],
  sharp,
  plugins: [],
})
