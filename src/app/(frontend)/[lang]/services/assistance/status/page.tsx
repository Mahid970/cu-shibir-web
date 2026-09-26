import type { Metadata } from 'next'

import { TrackForm } from '@/components/forms/TrackForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { copy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    meta: { title: 'আবেদনের অবস্থা', description: 'ট্র্যাকিং আইডি ও গোপন কোড দিয়ে শিক্ষাবৃত্তি বা সহায়তার আবেদনের অবস্থা দেখুন।' },
    title: ['আবেদনের', 'অবস্থা'],
    lede: 'আবেদন জমার সময় পাওয়া ট্র্যাকিং আইডি ও গোপন কোড লিখুন।',
    lost: ['কোড হারিয়ে গেলে নতুন করে', 'আবেদন করুন', 'অথবা ইমেইলে ট্র্যাকিং আইডি জানিয়ে যোগাযোগ করুন।'],
  },
  {
    meta: {
      title: 'Application status',
      description: 'Check the status of a scholarship or aid application with its tracking ID and secret code.',
    },
    title: ['Application', 'status'],
    lede: 'Enter the tracking ID and secret code you received when you applied.',
    lost: ['Lost your code?', 'Apply again', 'or email us your tracking ID.'],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return { ...pageMeta(lang, '/services/assistance/status', T[lang].meta), robots: { index: false, follow: true } }
}

export default async function StatusPage() {
  const t = T[await getLang()]
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} />
      <div className="wrap max-w-3xl py-12 md:py-16">
        <div className="card p-5 sm:p-8 md:p-10">
          <TrackForm />
        </div>
        <p className="mt-6 text-center text-[0.95rem] text-muted">
          {t.lost[0]}{' '}
          <Link href="/services/assistance" className="font-semibold text-primary underline">
            {t.lost[1]}
          </Link>{' '}
          {t.lost[2]}
        </p>
      </div>
    </>
  )
}
