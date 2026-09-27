import Image from 'next/image'

import { Link } from '@/i18n/link'
import { getLang } from '@/i18n/server'
import { SITE } from '@/lib/site'

import { LangSwitch } from './LangSwitch'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'
import { SearchPalette } from './SearchPalette'
import { CHROME, JOIN_HREF } from './nav'

export async function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const lang = await getLang()
  const t = CHROME[lang]
  const en = lang === 'en'
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
      <span className="sr-only">{t.home}</span>
      <Image src="/brand/logo-legacy.png" alt="" width={42} height={42} priority className="size-[42px]" />
      <span className="leading-none">
        <span className={`block font-bold ${en ? 'text-[0.98rem] sm:text-[1.05rem]' : 'text-[1.2rem]'} ${tone === 'light' ? 'text-white' : 'text-ink'}`}>
          {t.brand}
        </span>
        {/* The English subtitle is too long for a phone header next to search, language and menu. */}
        <span className={`mt-1 text-[0.72rem] ${en && tone === 'dark' ? 'hidden sm:block' : 'block'} ${tone === 'light' ? 'text-white/70' : 'text-subtle'}`}>
          {t.branch}
        </span>
      </span>
    </Link>
  )
}

export async function SiteHeader() {
  const t = CHROME[await getLang()]
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        {t.skip}
      </a>
      <div className="wrap flex h-[72px] items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLinks />
          <SearchPalette />
          <LangSwitch className="hidden sm:flex" />
          <LangSwitch single className="sm:hidden" />
          <a href={`mailto:${SITE.email}`} className="btn btn-outline btn-sm hidden 2xl:inline-flex">
            {t.contact}
          </a>
          <Link href={JOIN_HREF} className="btn btn-gradient btn-sm hidden sm:inline-flex">
            {t.join}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
