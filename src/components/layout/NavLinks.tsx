'use client'

import { useEffect, useRef, useState } from 'react'

import { ChevronDown, Search } from '@/components/ui/Icons'
import { useBasePath, useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'

import { CHROME, MAIN_NAV, MORE_NAV, isActive, type Fold, type NavItem } from './nav'
import { openSearch } from './SearchPalette'

/** Static class names per fold point, so Tailwind can see them. */
const IN_BAR: Record<Fold, string> = { lg: 'hidden xl:block', xl: 'hidden 2xl:block' }
const IN_MORE: Record<Fold, string> = { lg: 'xl:hidden', xl: '2xl:hidden' }

const PILL = 'inline-flex h-9 items-center whitespace-nowrap rounded-full border px-2.5 text-[0.98rem] xl:px-3.5 font-semibold transition-colors'
const ON = 'border-primary text-primary'
const OFF = 'border-transparent text-ink hover:text-primary'
/** "More" is circled only while the current page is folded into it (below that item's own place in the bar). */
const ON_WHILE_FOLDED: Record<Fold, string> = {
  lg: 'border-primary text-primary xl:border-transparent xl:text-ink xl:hover:text-primary',
  xl: 'border-primary text-primary 2xl:border-transparent 2xl:text-ink 2xl:hover:text-primary',
}

/** The page you are on is circled; the rest are plain links. */
const pill = (on: boolean) => `${PILL} ${on ? ON : OFF}`

const menuRow = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold text-ink hover:bg-pale hover:text-primary'

/** Laptop and desktop navigation: Home first, the main pages, then a "More" dropdown with the rest and search. */
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

  const active = (href: string) => isActive(pathname, href)
  const folded = MAIN_NAV.filter((item) => item.fold)
  // "More" is circled when the current page lives inside it.
  const foldedOn = folded.find((item) => active(item.href))
  const moreState = MORE_NAV.some((item) => !item.external && active(item.href)) ? ON : foldedOn ? ON_WHILE_FOLDED[foldedOn.fold![lang]] : OFF

  const moreLink = (item: NavItem, className = '') => (
    <li key={item.href} className={className}>
      {item.external ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className={menuRow}>
          {item.label[lang]}
        </a>
      ) : (
        <Link href={item.href} aria-current={active(item.href) ? 'page' : undefined} className={`${menuRow} ${active(item.href) ? 'text-primary' : ''}`}>
          {item.label[lang]}
        </Link>
      )}
    </li>
  )

  return (
    <nav aria-label={t.mainMenu} className="hidden lg:block">
      <ul className="flex items-center gap-0.5">
        {MAIN_NAV.map((item) => (
          <li key={item.href} className={item.fold ? IN_BAR[item.fold[lang]] : undefined}>
            <Link href={item.href} aria-current={active(item.href) ? 'page' : undefined} className={pill(active(item.href))}>
              {item.label[lang]}
            </Link>
          </li>
        ))}
        <li>
          <div ref={moreRef} className="relative">
            <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)} className={`${PILL} ${moreState} gap-1`}>
              {t.more}
              <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            <ul
              className={`absolute right-0 top-full z-10 mt-2 w-60 rounded-xl bg-white p-2 shadow-[0_16px_40px_rgb(11_15_46/0.12)] ring-1 ring-border transition ${
                open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
              }`}
            >
              {/* Main pages that have no room in the bar on this screen */}
              {folded.map((item) => moreLink(item, IN_MORE[item.fold![lang]]))}
              {MORE_NAV.map((item) => moreLink(item))}
              <li className="mt-1 border-t border-border pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    openSearch()
                  }}
                  className={menuRow}
                >
                  <Search className="size-4" />
                  {t.search}
                  <kbd className="ml-auto rounded border border-border px-1.5 font-[family-name:var(--font-en)] text-[0.72rem] font-medium text-subtle">Ctrl K</kbd>
                </button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  )
}
