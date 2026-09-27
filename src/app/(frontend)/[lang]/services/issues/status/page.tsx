import type { Metadata } from 'next'

import { TrackForm } from '@/components/forms/TrackForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { copy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    meta: { title: 'সমস্যার অবস্থা', description: 'ট্র্যাকিং আইডি ও গোপন কোড দিয়ে ছাত্র সমস্যা ডেস্কে জানানো সমস্যার অগ্রগতি দেখুন।' },
    title: ['সমস্যার', 'অবস্থা'],
    lede: 'সমস্যা জানানোর সময় পাওয়া ট্র্যাকিং আইডি ও গোপন কোড লিখুন।',
    lost: ['কোড হারিয়ে গেলে', 'আবার জানান', 'এবং বিবরণে আগের ট্র্যাকিং আইডিটি লিখে দিন।'],
  },
  {
    meta: { title: 'Report status', description: 'Follow a problem reported to the student issues desk with its tracking ID and secret code.' },
    title: ['Report', 'status'],
    lede: 'Enter the tracking ID and secret code you received when you reported the problem.',
    lost: ['Lost your code?', 'Report it again', 'and mention the old tracking ID in the details.'],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return { ...pageMeta(lang, '/services/issues/status', T[lang].meta), robots: { index: false, follow: true } }
}

export default async function IssueStatusPage() {
  const t = T[await getLang()]
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} />
      <div className="wrap max-w-3xl py-12 md:py-16">
        <div className="card p-5 sm:p-8 md:p-10">
          <TrackForm kind="issue" />
        </div>
        <p className="mt-6 text-center text-[0.95rem] text-muted">
          {t.lost[0]}{' '}
          <Link href="/services/issues/report" className="font-semibold text-primary underline">
            {t.lost[1]}
          </Link>{' '}
          {t.lost[2]}
        </p>
      </div>
    </>
  )
}
