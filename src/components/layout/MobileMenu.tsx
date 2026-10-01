'use client'

import { useEffect, useState, type CSSProperties } from 'react'

import { Search } from '@/components/ui/Icons'
import { useBasePath, useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'
import { SITE } from '@/lib/site'

import { LangSwitch } from './LangSwitch'
import { ALL_NAV, CHROME, HOME_NAV, JOIN_HREF, isActive } from './nav'
import { openSearch } from './SearchPalette'

/** Phone and tablet menu: three bars that fold into a cross and drop a panel under the header; its rows slide in one after another. */
export function MobileMenu() {
  const lang = useLang()
  const t = CHROME[lang]
  const pathname = useBasePath()
  const [open, setOpen] = useState(false)

  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t.closeMenu : t.openMenu}
        data-open={open || undefined}
        className="burger grid size-10 place-items-center rounded-lg text-primary hover:bg-pale sm:size-11"
      >
        <span aria-hidden="true" className="relative block h-[18px] w-6">
          <span className="burger-bar top-0" />
          <span className="burger-bar top-1/2 -mt-px" />
          <span className="burger-bar bottom-0" />
        </span>
      </button>
      <div
        id="mobile-menu"
        data-open={open || undefined}
        className={`fixed inset-x-0 bottom-0 top-[72px] z-40 bg-ink/40 transition-opacity ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <nav
          aria-label={t.mobileMenu}
          className={`max-h-full overflow-y-auto rounded-b-3xl bg-white px-4 pb-6 pt-2 shadow-xl transition-transform duration-300 ${open ? 'translate-y-0' : '-translate-y-4'}`}
        >
          <ul>
            {[HOME_NAV, ...ALL_NAV].map((item, i) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href} className="menu-row" style={{ '--i': i } as CSSProperties}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center border-b border-border py-3.5 text-[1.1rem] font-semibold ${active ? 'text-primary' : 'text-ink'}`}
                  >
                    {active && <span aria-hidden="true" className="mr-2.5 size-2 rounded-full bg-primary" />}
                    {item.label[lang]}
                  </Link>
                </li>
              )
            })}
            <li className="menu-row" style={{ '--i': ALL_NAV.length + 1 } as CSSProperties}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openSearch()
                }}
                className="flex w-full items-center gap-2.5 border-b border-border py-3.5 text-left text-[1.1rem] font-semibold text-ink"
              >
                <Search className="size-5 text-primary" />
                {t.search}
              </button>
            </li>
          </ul>
          <div className="flex items-center justify-between gap-3 border-b border-border py-3">
            <span className="font-semibold text-ink">{t.language}</span>
            <LangSwitch long />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <a href={`mailto:${SITE.email}`} className="btn btn-outline">
              {t.contact}
            </a>
            <Link href={JOIN_HREF} className="btn btn-gradient">
              {t.join}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
