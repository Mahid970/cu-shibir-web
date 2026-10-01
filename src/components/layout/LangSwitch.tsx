'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'

import { localePath, type Locale } from '@/i18n/config'
import { useBasePath, useLang } from '@/i18n/LangProvider'

const LABEL: Record<Locale, { short: string; long: string }> = {
  bn: { short: 'বাং', long: 'বাংলা' },
  en: { short: 'EN', long: 'English' },
}

type Place = { id: string | null; offset: number; ratio: number }

/**
 * Where the reader is: the last visible element with an id above the middle of the screen. Section
 * and heading ids are the same in both languages. Falls back to the proportion of the page read.
 */
function currentPlace(): Place {
  let id: string | null = null
  let offset = 0
  for (const el of document.querySelectorAll<HTMLElement>('main [id]')) {
    if (el.closest('svg')) continue
    const box = el.getBoundingClientRect()
    if (box.height === 0) continue
    if (box.top > innerHeight / 2) break
    id = el.id
    offset = box.top
  }
  const max = document.documentElement.scrollHeight - innerHeight
  return { id, offset, ratio: max > 0 ? scrollY / max : 0 }
}

/**
 * The other language's page streams in, so for a moment it is short and the browser clamps the
 * scroll. Keep putting the reader's section back at the same height on screen until it stays put
 * (or 3 s pass). Stops as soon as the reader scrolls themselves.
 */
function restorePlace(place: Place, lang: Locale, path: string) {
  let stop = false
  const cancel = () => (stop = true)
  const events = ['wheel', 'touchstart', 'keydown'] as const
  events.forEach((e) => addEventListener(e, cancel, { once: true, passive: true }))
  const deadline = performance.now() + 3000
  let steady = 0
  const done = () => events.forEach((e) => removeEventListener(e, cancel))
  const tick = () => {
    if (stop || performance.now() > deadline || steady >= 4) return done()
    const arrived = document.documentElement.lang === lang && location.pathname === path && document.querySelector('main h1')
    if (arrived) {
      const el = place.id ? document.getElementById(place.id) : null
      const max = document.documentElement.scrollHeight - innerHeight
      const y = Math.max(0, el ? scrollY + el.getBoundingClientRect().top - place.offset : place.ratio * max)
      if (Math.abs(scrollY - y) <= 2) steady++
      else if (y <= max + 1) {
        window.scrollTo(0, y)
        steady = 0
      }
    }
    setTimeout(() => requestAnimationFrame(tick), 100)
  }
  requestAnimationFrame(tick)
}

/**
 * বাংলা | English switch. Opens the same page in the other language and keeps the reader's place,
 * the query and the #section, so the text simply changes language where the reader is.
 * `single` shows only the other language as one small button (narrow phone headers).
 */
export function LangSwitch({ single = false, long = false, className = '' }: { single?: boolean; long?: boolean; className?: string }) {
  const lang = useLang()
  const path = useBasePath()
  const router = useRouter()

  const go = (target: Locale) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (target === lang || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    const href = localePath(target, path)
    const place = currentPlace()
    router.push(href + location.search + location.hash, { scroll: false })
    if (!location.hash) restorePlace(place, target, href.split('?')[0])
  }

  const item = (target: Locale) => {
    const on = target === lang
    const text = long ? LABEL[target].long : LABEL[target].short
    return (
      <NextLink
        key={target}
        href={localePath(target, path)}
        hrefLang={target === 'bn' ? 'bn' : 'en'}
        lang={target}
        onClick={go(target)}
        aria-current={on ? 'true' : undefined}
        aria-label={single ? (target === 'en' ? 'Read this page in English' : 'এই পাতাটি বাংলায় পড়ুন') : undefined}
        className={`inline-flex h-8 min-w-10 items-center justify-center rounded-full px-3 text-[0.85rem] font-bold transition-colors ${
          target === 'en' ? 'font-[family-name:var(--font-en)]' : ''
        } ${on ? 'bg-primary text-white shadow-[0_6px_14px_rgb(17_69_117/0.3)]' : 'text-ink hover:bg-pale-3'}`}
      >
        {text}
      </NextLink>
    )
  }

  if (single) {
    return <div className={`rounded-full bg-pale-2 p-1 ${className}`}>{item(lang === 'bn' ? 'en' : 'bn')}</div>
  }

  return (
    <div role="group" aria-label={lang === 'bn' ? 'ভাষা' : 'Language'} className={`flex items-center gap-0.5 rounded-full bg-pale-2 p-1 ${className}`}>
      {item('bn')}
      {item('en')}
    </div>
  )
}
