'use client'

import { ArrowRight } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'

const T = copy(
  {
    title: 'পাতাটি পাওয়া যায়নি',
    text: 'ঠিকানাটি ভুল হতে পারে, অথবা পাতাটি সরিয়ে নেওয়া হয়েছে। নিচের কোনো একটি দিয়ে আবার শুরু করুন।',
    home: 'হোম',
    news: 'সর্বশেষ সংবাদ',
    search: 'খুঁজুন',
  },
  {
    title: 'Page not found',
    text: 'The address may be wrong, or the page has moved. Start again from one of these.',
    home: 'Home',
    news: 'Latest news',
    search: 'Search',
  },
)

/**
 * A client component because not-found pages get no route params and next/root-params is not
 * available there; the language comes from the layout's LangProvider instead.
 */
export function NotFoundView() {
  const t = T[useLang()]
  return (
    <div className="hero-wash relative isolate overflow-hidden">
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10" />
      <div className="wrap flex min-h-[60vh] max-w-xl flex-col items-center justify-center py-20 text-center">
        <p className="font-[family-name:var(--font-en)] text-[4.5rem] font-bold leading-none text-primary">404</p>
        <h1 className="mt-4 text-[2rem] font-bold text-ink">{t.title}</h1>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-muted">{t.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gradient">
            {t.home}
            <ArrowRight />
          </Link>
          <Link href="/news" className="btn btn-outline-blue">
            {t.news}
          </Link>
          <Link href="/search" className="btn btn-outline">
            {t.search}
          </Link>
        </div>
      </div>
    </div>
  )
}
