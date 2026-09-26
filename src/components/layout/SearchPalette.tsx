'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ArrowRight, Close, ExternalLink, Search } from '@/components/ui/Icons'
import { copy, langAttr, localePath } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'

type Hit = { kind: string; title: string; href: string; meta?: string; external?: boolean }

const T = copy(
  {
    kinds: { post: 'সংবাদ', person: 'দায়িত্বশীল', album: 'গ্যালারি', video: 'ভিডিও', press: 'মিডিয়া', page: 'পাতা' } as Record<string, string>,
    quick: [
      { kind: 'page', title: 'সমর্থক ফরম', href: '/join/supporter' },
      { kind: 'page', title: 'শিক্ষাবৃত্তি ও চিকিৎসা সহায়তা', href: '/services/assistance' },
      { kind: 'page', title: 'ক্যাম্পাস গাইড', href: '/services/campus' },
      { kind: 'page', title: 'এহতেসাব ও পরামর্শ', href: '/join/feedback' },
    ] as Hit[],
    open: 'খুঁজুন (Ctrl+K)',
    dialog: 'ওয়েবসাইটে খুঁজুন',
    placeholder: 'কী খুঁজছেন? যেমন: আবাসন, শিক্ষাবৃত্তি',
    term: 'খোঁজার শব্দ',
    close: 'বন্ধ করুন',
    quickTitle: 'দ্রুত যান',
    none: 'কিছু পাওয়া যায়নি। অন্য শব্দে লিখে দেখুন।',
    results: 'ফলাফল',
    all: 'সব ফলাফল দেখুন',
  },
  {
    kinds: { post: 'News', person: 'Leader', album: 'Gallery', video: 'Video', press: 'Media', page: 'Page' },
    quick: [
      { kind: 'page', title: 'Supporter form', href: '/join/supporter' },
      { kind: 'page', title: 'Scholarships and medical aid', href: '/services/assistance' },
      { kind: 'page', title: 'Campus guide', href: '/services/campus' },
      { kind: 'page', title: 'Ehtesab and advice', href: '/join/feedback' },
    ],
    open: 'Search (Ctrl+K)',
    dialog: 'Search the website',
    placeholder: 'What are you looking for? e.g. housing, scholarship',
    term: 'Search words',
    close: 'Close',
    quickTitle: 'Go straight to',
    none: 'Nothing found. Try another word.',
    results: 'Results',
    all: 'See all results',
  },
)

/**
 * Header search: a button that opens a dialog with results as you type. ⌘K / Ctrl+K or "/"
 * open it from anywhere; arrow keys move through results; Enter opens one.
 */
export function SearchPalette() {
  const lang = useLang()
  const t = T[lang]
  const router = useRouter()
  const pathname = usePathname()
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Hit[]>([])
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(false)

  const open = () => {
    dialog.current?.showModal()
    requestAnimationFrame(() => input.current?.select())
  }
  const close = () => dialog.current?.close()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => close(), [pathname])

  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) return
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`${localePath(lang, '/search/suggest')}?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        const body = (await res.json()) as { hits: Hit[] }
        setResults(body.hits)
        setActive(0)
      } catch {
        // aborted or offline: keep the previous list
      } finally {
        setLoading(false)
      }
    }, 180)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [q, lang])

  const short = q.trim().length < 2
  const hits = short ? t.quick : results

  const go = (hit: Hit | undefined) => {
    if (!hit) {
      if (q.trim()) router.push(`${localePath(lang, '/search')}?q=${encodeURIComponent(q.trim())}`)
      return
    }
    if (hit.external) window.open(hit.href, '_blank', 'noopener,noreferrer')
    else router.push(localePath(lang, hit.href))
    close()
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="grid size-11 place-items-center rounded-xl text-ink transition-colors hover:bg-pale-2"
        aria-label={t.open}
        aria-haspopup="dialog"
      >
        <Search className="size-5" />
      </button>
      <dialog
        ref={dialog}
        aria-label={t.dialog}
        className="mx-auto mt-[10vh] w-[min(640px,calc(100vw-2rem))] max-w-none overflow-hidden rounded-3xl bg-white p-0 shadow-[0_30px_80px_rgb(0_14_29/0.35)] backdrop:bg-night/55 backdrop:backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="size-5 shrink-0 text-subtle" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setActive(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(a + 1, short ? hits.length - 1 : hits.length))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(a - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                go(hits[active])
              }
            }}
            type="search"
            placeholder={t.placeholder}
            aria-label={t.term}
            aria-controls="search-results"
            aria-activedescendant={hits[active] ? `sr-${active}` : undefined}
            className="h-16 min-w-0 flex-1 bg-transparent text-[1.1rem] text-ink placeholder:text-subtle focus:outline-none"
          />
          <button type="button" onClick={close} className="grid size-9 place-items-center rounded-lg text-subtle hover:bg-pale-2 hover:text-ink" aria-label={t.close}>
            <Close className="size-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {short && <p className="px-3 pb-1 pt-2 text-[0.85rem] font-semibold text-subtle">{t.quickTitle}</p>}
          {!short && !loading && hits.length === 0 && (
            <p className="px-4 py-6 text-center text-muted">{t.none}</p>
          )}
          <ul id="search-results" role="listbox" aria-label={t.results}>
            {hits.map((h, i) => (
              <li
                key={`${h.kind}:${h.href}:${h.title}`}
                id={`sr-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(h)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${i === active ? 'bg-pale-2' : ''}`}
              >
                <span className="w-20 shrink-0 text-[0.8rem] font-semibold text-primary">{t.kinds[h.kind] ?? ''}</span>
                <span className="min-w-0 flex-1">
                  <span lang={langAttr(lang, h.title)} className="line-clamp-1 font-semibold text-ink">
                    {h.title}
                  </span>
                  {h.meta && <span className="line-clamp-1 text-[0.85rem] text-subtle">{h.meta}</span>}
                </span>
                {h.external ? <ExternalLink className="size-4 shrink-0 text-subtle" /> : <ArrowRight className="size-4 shrink-0 text-subtle" />}
              </li>
            ))}
            {!short && (
              <li
                id={`sr-${hits.length}`}
                role="option"
                aria-selected={active === hits.length}
                onMouseEnter={() => setActive(hits.length)}
                onClick={() => go(undefined)}
                className={`mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 font-semibold text-primary ${active === hits.length ? 'bg-pale-2' : ''}`}
              >
                {t.all}
                <ArrowRight className="size-4" />
              </li>
            )}
          </ul>
        </div>
      </dialog>
    </>
  )
}
