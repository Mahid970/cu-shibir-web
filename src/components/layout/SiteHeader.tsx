import Image from 'next/image'
import Link from 'next/link'

import { SITE } from '@/lib/site'

import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'
import { SearchPalette } from './SearchPalette'
import { JOIN_HREF } from './nav'

export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2.5 whitespace-nowrap"
      aria-label="হোম — বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয়"
    >
      <Image src="/brand/logo-legacy.png" alt="" width={42} height={42} priority className="size-[42px]" />
      <span className="leading-none">
        <span className={`block text-[1.2rem] font-bold ${tone === 'light' ? 'text-white' : 'text-ink'}`}>চবি ছাত্রশিবির</span>
        <span className={`mt-1 block text-[0.72rem] font-medium ${tone === 'light' ? 'text-white/70' : 'text-subtle'}`}>
          চট্টগ্রাম বিশ্ববিদ্যালয় শাখা
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
