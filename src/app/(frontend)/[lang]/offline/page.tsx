import type { Metadata } from 'next'

import { copy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { getLang } from '@/i18n/server'

import { RetryButton } from './RetryButton'

const T = copy(
  {
    title: 'ইন্টারনেট সংযোগ নেই',
    text: 'এই পাতাটি আগে খোলা হয়নি বলে ফোনে সংরক্ষিত নেই। আগে পড়া সংবাদগুলো অফলাইনেও খোলা যাবে।',
    home: 'হোম',
  },
  {
    title: 'No internet connection',
    text: 'This page has not been opened before, so it is not saved on your phone. News you have already read will still open offline.',
    home: 'Home',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  return { title: T[await getLang()].title, robots: { index: false, follow: false } }
}

/** Shown by the service worker when a page isn't saved on the phone and the network is down. */
export default async function OfflinePage() {
  const t = T[await getLang()]
  return (
    <div className="hero-wash relative isolate overflow-hidden">
      <div aria-hidden="true" className="lattice absolute inset-0 -z-10" />
      <div className="wrap flex min-h-[60vh] max-w-xl flex-col items-center justify-center py-20 text-center">
        <svg viewBox="0 0 64 64" className="size-20 text-primary" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true">
          <path d="M8 24a36 36 0 0 1 48 0M16 32a24 24 0 0 1 32 0M24 40a12 12 0 0 1 16 0" />
          <circle cx="32" cy="48" r="3" fill="currentColor" />
          <path d="M10 10l44 44" className="text-crimson" stroke="currentColor" />
        </svg>
        <h1 className="mt-6 text-[2rem] font-bold text-ink">{t.title}</h1>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-muted">{t.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <RetryButton />
          <Link href="/" className="btn btn-outline-blue">
            {t.home}
          </Link>
        </div>
      </div>
    </div>
  )
}
