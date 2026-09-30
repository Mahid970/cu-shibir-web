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
    <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-2.5">
      <span className="sr-only">{t.home}</span>
      <Image src="/brand/logo-legacy.png" alt="" width={42} height={42} priority className="size-9 shrink-0 sm:size-[42px]" />
      <span className="min-w-0 leading-none">
        {/* The full organisation name in bold, the university under it. On phones the English name may wrap. */}
        <span
          className={`block font-bold ${
            en ? 'text-[0.8rem] leading-[1.15] sm:whitespace-nowrap sm:text-[0.95rem]' : 'whitespace-nowrap text-[0.92rem] sm:text-[1.1rem]'
          } ${tone === 'light' ? 'text-white' : 'text-ink'}`}
        >
          {t.brand}
        </span>
        <span className={`mt-1 block whitespace-nowrap text-[0.66rem] sm:text-[0.72rem] ${tone === 'light' ? 'text-white/70' : 'text-subtle'}`}>
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
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
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
