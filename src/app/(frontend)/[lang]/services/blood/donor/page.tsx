import type { Metadata } from 'next'

import { DonorManageForm } from '@/components/forms/BloodForms'
import { PageHeader } from '@/components/ui/PageHeader'
import { copy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    meta: { title: 'দাতার নিজের তথ্য', description: 'দাতা আইডি ও গোপন কোড দিয়ে রক্তদানের তারিখ লিখুন, বিরতি নিন বা তালিকা থেকে নাম সরান।' },
    title: ['দাতার', 'নিজের তথ্য'],
    lede: 'নিবন্ধনের সময় পাওয়া দাতা আইডি ও গোপন কোড লিখুন, তারপর কী করতে চান বেছে নিন।',
    lost: ['কোড হারিয়ে গেলে', 'আবার নিবন্ধন করুন', '; সমন্বয়কেরা পুরোনো নিবন্ধনটি সরিয়ে দেবেন।'],
  },
  {
    meta: { title: 'Your donor details', description: 'Use your donor ID and secret code to note a donation, take a break or leave the blood donor list.' },
    title: ['Your donor', 'details'],
    lede: 'Enter the donor ID and secret code you received when you registered, then choose what to do.',
    lost: ['Lost your code?', 'Register again', '; the coordinators will remove the old entry.'],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return { ...pageMeta(lang, '/services/blood/donor', T[lang].meta), robots: { index: false, follow: true } }
}

export default async function DonorPage() {
  const t = T[await getLang()]
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} />
      <div className="wrap max-w-3xl py-12 md:py-16">
        <div className="card p-5 sm:p-8 md:p-10">
          <DonorManageForm />
        </div>
        <p className="mt-6 text-center text-[0.95rem] text-muted">
          {t.lost[0]}{' '}
          <Link href="/services/blood/donate" className="font-semibold text-primary underline">
            {t.lost[1]}
          </Link>
          {t.lost[2]}
        </p>
      </div>
    </>
  )
}
