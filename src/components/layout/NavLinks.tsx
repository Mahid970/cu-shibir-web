'use client'

import { useEffect, useRef, useState } from 'react'

import { ChevronDown } from '@/components/ui/Icons'
import { useBasePath, useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'

import { CHROME, FEATURED_NAV, MAIN_NAV, MORE_NAV } from './nav'

/** Desktop navigation: outlined featured pill, links, and an "এছাড়াও" (More) dropdown. */
export function NavLinks() {
  const lang = useLang()
  const t = CHROME[lang]
  const pathname = useBasePath()
  const [open, setOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const active = (href: string) => pathname.startsWith(href)

  return (
    <nav aria-label={t.mainMenu} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        <li className="mr-2">
          <Link
            href={FEATURED_NAV.href}
            aria-current={active(FEATURED_NAV.href) ? 'page' : undefined}
            className={`inline-flex h-9 items-center whitespace-nowrap rounded-full border border-primary px-4 text-[0.95rem] font-semibold transition-colors ${
              active(FEATURED_NAV.href) ? 'bg-primary text-white' : 'text-primary hover:bg-pale'
            }`}
          >
            {FEATURED_NAV.label[lang]}
          </Link>
        </li>
        {MAIN_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active(item.href) ? 'page' : undefined}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-[0.98rem] font-semibold transition-colors ${
                active(item.href) ? 'text-primary' : 'text-ink hover:text-primary'
              }`}
            >
              {item.label[lang]}
            </Link>
          </li>
        ))}
        <li>
          <div ref={moreRef} className="relative">
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-[0.98rem] font-semibold text-ink hover:text-primary"
            >
              {t.more}
              <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            <ul
              className={`absolute right-0 top-full z-10 mt-2 w-56 rounded-xl bg-white p-2 shadow-[0_16px_40px_rgb(11_15_46/0.12)] ring-1 ring-border transition ${
                open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
              }`}
            >
              {MORE_NAV.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg px-3 py-2 font-semibold text-ink hover:bg-pale hover:text-primary"
                    >
                      {item.label[lang]}
                    </a>
                  ) : (
                    <Link href={item.href} className="block rounded-lg px-3 py-2 font-semibold text-ink hover:bg-pale hover:text-primary">
                      {item.label[lang]}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  )
}
