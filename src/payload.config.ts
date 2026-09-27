import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { bnBd } from '@payloadcms/translations/languages/bnBd'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Albums } from './collections/Albums'
import { Assistance } from './collections/forms/Assistance'
import { Feedback } from './collections/forms/Feedback'
import { Issues } from './collections/forms/Issues'
import { Supporters } from './collections/forms/Supporters'
import { Martyrs } from './collections/Martyrs'
import { Media } from './collections/Media'
import { People } from './collections/People'
import { Posts } from './collections/Posts'
import { PressCoverage } from './collections/PressCoverage'
import { Users } from './collections/Users'
import { Videos } from './collections/Videos'
import { Shuttle } from './globals/Shuttle'
import { SiteSettings } from './globals/SiteSettings'
import { generateShareImageTask } from './jobs/generateShareImage'
import { purgeSubmissionsTask } from './jobs/purgeSubmissions'
import { migrations } from './migrations'

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
  collections: [Posts, People, Martyrs, PressCoverage, Videos, Albums, Media, Supporters, Feedback, Assistance, Issues, Users],
  globals: [SiteSettings, Shuttle],
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
  // Development pushes the schema directly; production applies the committed migrations on start
  // (set PAYLOAD_MIGRATE_ON_START=false for a local production build against the dev database).
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: process.env.PAYLOAD_MIGRATE_ON_START === 'false' ? undefined : migrations,
  }),
  // Runs share-image, scheduled-publish and retention jobs on the long-running VPS server.
  jobs: {
    tasks: [generateShareImageTask, purgeSubmissionsTask],
    autoRun: [{ cron: '* * * * *', queue: 'default', limit: 20 }],
    shouldAutoRun: () => process.env.PAYLOAD_DISABLE_JOBS !== 'true',
  },
  cors: [serverURL],
  csrf: [serverURL],
  sharp,
  plugins: [],
})
