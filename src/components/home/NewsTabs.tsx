'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'

const T = copy(
  { filter: 'ধরন অনুযায়ী দেখুন', empty: 'এই ধরনে এখনো কিছু প্রকাশিত হয়নি।' },
  { filter: 'Show by type', empty: 'Nothing of this type has been published yet.' },
)

export type NewsTab = { key: string; label: string; categories?: string[] }

const MAX = 6

/**
 * Pill tabs with a sliding blue indicator. The cards are rendered on
 * the server; switching tabs only shows/hides them and replays their entrance.
 */
export function NewsTabs({ tabs, children }: { tabs: NewsTab[]; children: ReactNode }) {
  const t = T[useLang()]
  const [active, setActive] = useState(tabs[0].key)
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const list = listRef.current
    const btn = list?.querySelector<HTMLButtonElement>(`[data-key="${active}"]`)
    if (!list || !btn) return
    const measure = () => setPill({ x: btn.offsetLeft, w: btn.offsetWidth })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [active])

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const tab = tabs.find((t) => t.key === active)
    let shown = 0
    grid.querySelectorAll<HTMLElement>('[data-cat]').forEach((card) => {
      const match = !tab?.categories || tab.categories.includes(card.dataset.cat ?? '')
      const visible = match && shown < MAX
      card.hidden = !visible
      if (!visible) return
      const article = card.querySelector<HTMLElement>('[data-reveal]')
      if (article && document.documentElement.classList.contains('motion')) {
        article.style.setProperty('--d', `${(shown % 3) * 90}ms`)
        article.dataset.state = 'hidden'
        requestAnimationFrame(() => requestAnimationFrame(() => (article.dataset.state = 'visible')))
      }
      shown += 1
    })
    grid.dataset.empty = shown === 0 ? 'true' : 'false'
  }, [active, tabs])

  return (
    <>
      <div className="mt-10 flex justify-center">
        <div
          ref={listRef}
          role="group"
          aria-label={t.filter}
          className="relative flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_4px_24px_rgb(11_31_51/0.06)] [scrollbar-width:none]"
        >
          {pill && (
            <span
              aria-hidden="true"
              className="absolute bottom-1.5 left-0 top-1.5 rounded-full bg-primary shadow-[0_8px_18px_rgb(17_69_117/0.3)] transition-[transform,width] duration-500 ease-[cubic-bezier(0.3,1.3,0.5,1)]"
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
            />
          )}
          {tabs.map((t) => {
            const on = t.key === active
            return (
              <button
                key={t.key}
                type="button"
                data-key={t.key}
                aria-pressed={on}
                onClick={() => setActive(t.key)}
                className={`relative z-10 shrink-0 rounded-full px-5 py-2.5 text-[1rem] font-bold transition-colors duration-300 sm:px-6 ${
                  on ? (pill ? 'text-white' : 'bg-primary text-white') : 'bg-pale-2 text-ink hover:bg-pale-3'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>
      <div ref={gridRef} className="group/grid mt-10">
        {children}
        <p className="hidden py-10 text-center text-muted group-data-[empty=true]/grid:block">{t.empty}</p>
      </div>
    </>
  )
}
