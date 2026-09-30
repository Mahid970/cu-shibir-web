'use client'

import { useEffect, useState } from 'react'

import { Close, Menu } from '@/components/ui/Icons'
import { useBasePath, useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'
import { SITE } from '@/lib/site'

import { LangSwitch } from './LangSwitch'
import { ALL_NAV, CHROME, JOIN_HREF } from './nav'

/** Phone/tablet menu: a hamburger that drops a panel under the header. */
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
    <div className={lang === 'en' ? '2xl:hidden' : 'xl:hidden'}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t.closeMenu : t.openMenu}
        className="grid size-10 place-items-center rounded-lg text-primary hover:bg-pale sm:size-11"
      >
        {open ? <Close className="size-7" /> : <Menu className="size-7" />}
      </button>
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[72px] z-40 bg-ink/40 transition-opacity ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <nav
          aria-label={t.mobileMenu}
          className={`max-h-full overflow-y-auto rounded-b-3xl bg-white px-4 pb-6 pt-2 shadow-xl transition-transform duration-300 ${open ? 'translate-y-0' : '-translate-y-4'}`}
        >
          <ul>
            {ALL_NAV.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`block border-b border-border py-3.5 text-[1.1rem] font-semibold ${active ? 'text-primary' : 'text-ink'}`}
                  >
                    {item.label[lang]}
                  </Link>
                </li>
              )
            })}
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
