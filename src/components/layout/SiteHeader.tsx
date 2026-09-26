import Image from 'next/image'
import Link from 'next/link'

import { SITE } from '@/lib/site'

import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'
import { SearchPalette } from './SearchPalette'
import { JOIN_HREF } from './nav'

export function Logo({ tone = 'dark', locale = 'bn' }: { tone?: 'dark' | 'light'; locale?: 'bn' | 'en' }) {
  const en = locale === 'en'
  return (
    <Link
      href={en ? '/en' : '/'}
      className="flex shrink-0 items-center gap-2.5 whitespace-nowrap"
      aria-label={en ? 'Home: Bangladesh Islami Chhatrashibir, University of Chittagong' : 'হোম — বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয়'}
    >
      <Image src="/brand/logo-legacy.png" alt="" width={42} height={42} priority className="size-[42px]" />
      <span className="leading-none">
        <span className={`block font-bold ${en ? 'font-[family-name:var(--font-en)] text-[1.05rem]' : 'text-[1.2rem]'} ${tone === 'light' ? 'text-white' : 'text-ink'}`}>
          {en ? 'CU Chhatrashibir' : 'চবি ছাত্রশিবির'}
        </span>
        <span className={`mt-1 block text-[0.72rem] font-medium ${tone === 'light' ? 'text-white/70' : 'text-subtle'}`}>
          {en ? 'University of Chittagong branch' : 'চট্টগ্রাম বিশ্ববিদ্যালয় শাখা'}
        </span>
      </span>
    </Link>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        মূল কনটেন্টে যান
      </a>
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-3">
          <NavLinks />
          <SearchPalette />
          <Link href="/en" hrefLang="en" lang="en" className="hidden h-9 items-center rounded-lg px-2.5 font-[family-name:var(--font-en)] text-[0.85rem] font-bold text-ink hover:bg-pale-2 md:inline-flex" aria-label="English">
            EN
          </Link>
          <a href={`mailto:${SITE.email}`} className="btn btn-outline btn-sm hidden xl:inline-flex">
            যোগাযোগ
          </a>
          <Link href={JOIN_HREF} className="btn btn-gradient btn-sm hidden sm:inline-flex">
            সমর্থক হোন
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
