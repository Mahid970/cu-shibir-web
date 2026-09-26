import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { RetryButton } from './RetryButton'

export const metadata: Metadata = {
  title: 'ইন্টারনেট সংযোগ নেই',
  robots: { index: false, follow: false },
}

/** Shown by the service worker when a page isn't saved on the phone and the network is down. */
export default function OfflinePage() {
  return (
    <div className="hero-wash relative isolate overflow-hidden">
      <div aria-hidden="true" className="grid-paper absolute inset-0 -z-10" />
      <div className="wrap flex min-h-[60vh] max-w-xl flex-col items-center justify-center py-20 text-center">
        <svg viewBox="0 0 64 64" className="size-20 text-primary" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true">
          <path d="M8 24a36 36 0 0 1 48 0M16 32a24 24 0 0 1 32 0M24 40a12 12 0 0 1 16 0" />
          <circle cx="32" cy="48" r="3" fill="currentColor" />
          <path d="M10 10l44 44" className="text-crimson" stroke="currentColor" />
        </svg>
        <h1 className="mt-6 text-[2rem] font-bold text-ink">ইন্টারনেট সংযোগ নেই</h1>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-muted">
          এই পাতাটি আগে খোলা হয়নি বলে ফোনে সংরক্ষিত নেই। আগে পড়া সংবাদগুলো অফলাইনেও খোলা যাবে।
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <RetryButton />
          <Link href="/" className="btn btn-outline-blue">
            হোম
          </Link>
        </div>
      </div>
    </div>
  )
}
