import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { TrackForm } from '@/components/forms/TrackForm'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'আবেদনের অবস্থা',
  description: 'ট্র্যাকিং আইডি ও গোপন কোড দিয়ে শিক্ষাবৃত্তি বা সহায়তার আবেদনের অবস্থা দেখুন।',
  alternates: { canonical: '/services/assistance/status' },
  robots: { index: false, follow: true },
}

export default function StatusPage() {
  return (
    <>
      <PageHeader title={['আবেদনের', { hl: 'অবস্থা' }]} lede="আবেদন জমার সময় পাওয়া ট্র্যাকিং আইডি ও গোপন কোড লিখুন।" />
      <div className="wrap max-w-3xl py-12 md:py-16">
        <div className="card p-5 sm:p-8 md:p-10">
          <TrackForm />
        </div>
        <p className="mt-6 text-center text-[0.95rem] text-muted">
          কোড হারিয়ে গেলে নতুন করে{' '}
          <Link href="/services/assistance" className="font-semibold text-primary underline">
            আবেদন করুন
          </Link>{' '}
          অথবা ইমেইলে ট্র্যাকিং আইডি জানিয়ে যোগাযোগ করুন।
        </p>
      </div>
    </>
  )
}
