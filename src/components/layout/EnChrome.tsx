import Link from 'next/link'

import { Mail, SOCIAL_ICONS } from '@/components/ui/Icons'
import { SITE } from '@/lib/site'
import type { SiteSetting } from '@/payload-types'

import { Logo } from './SiteHeader'

const LINKS = [
  { href: '/en#about', label: 'About' },
  { href: '/en#programme', label: 'Programme' },
  { href: '/en#leadership', label: 'Leadership' },
  { href: '/en#contact', label: 'Contact' },
]

/** Header of the English pages: in-page sections and the way back to Bangla. */
export function EnHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Logo locale="en" />
        <div className="flex items-center gap-2">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="rounded-lg px-3 py-2 text-[0.95rem] font-semibold text-ink hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/" hrefLang="bn" lang="bn" className="btn btn-outline-blue btn-sm">
            বাংলা
          </Link>
        </div>
      </div>
    </header>
  )
}

export function EnFooter({ settings }: { settings: SiteSetting }) {
  const socials = Object.entries(settings.socials ?? {}).filter(
    (e): e is [keyof typeof SOCIAL_ICONS, string] => e[0] in SOCIAL_ICONS && typeof e[1] === 'string' && e[1].startsWith('http'),
  )
  const email = settings.contact?.email || SITE.email
  return (
    <footer className="relative isolate overflow-hidden bg-night px-3 pb-8 pt-14 text-white md:pt-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40%_60%_at_10%_0%,rgb(53_100_255/0.28),transparent_70%)]" />
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo tone="light" locale="en" />
          <p className="mt-5 flex items-center gap-2 text-white/85">
            <Mail className="size-5 text-mint" />
            <a href={`mailto:${email}`} className="hover:underline">
              {email}
            </a>
          </p>
          <p className="mt-2 text-white/70">University of Chittagong, Hathazari, Chattogram, Bangladesh</p>
        </div>
        <ul className="flex flex-wrap gap-3">
          {socials.map(([key, url]) => {
            const Icon = SOCIAL_ICONS[key]
            return (
              <li key={key}>
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={key} className="grid size-11 place-items-center rounded-xl bg-white/10 hover:bg-white hover:text-ink">
                  <Icon className="size-5" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="wrap mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-[0.88rem] text-white/60 sm:flex-row sm:justify-between">
        <p>© Bangladesh Islami Chhatrashibir, University of Chittagong branch</p>
        <p>
          Central website:{' '}
          <a href="https://shibir.org.bd" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline">
            shibir.org.bd
          </a>
        </p>
      </div>
    </footer>
  )
}
