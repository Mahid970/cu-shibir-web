'use client'

import { useEffect, useRef, useState } from 'react'

import type { Stop } from '@/content/history'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'

const T = copy(
  { title: ['যে পথে', 'এসেছি'], lede: '১৯৭৭ থেকে আজ পর্যন্ত, শাটলের লাইন ধরে।' },
  { title: ['How we', 'got here'], lede: 'From 1977 to today, along the shuttle line.' },
)

const GAP = 440 // px between stations on the pinned rail

/** Side view of the CU shuttle: engine and two carriages, windows lit. */
function Train({ lit }: { lit: boolean }) {
  const win = lit ? '#c4ecfc' : '#cbd5e1'
  return (
    <svg viewBox="0 0 250 56" className="h-12 w-[214px] drop-shadow-[0_8px_18px_rgb(0_0_0/0.4)]" aria-hidden="true">
      {[0, 84].map((x) => (
        <g key={x} transform={`translate(${x} 6)`}>
          <rect width="78" height="34" rx="6" fill="#114575" />
          <rect y="22" width="78" height="5" fill="#5cc8f2" />
          {[8, 30, 52].map((w) => (
            <rect key={w} x={w} y="6" width="16" height="11" rx="2" fill={win} />
          ))}
          <circle cx="16" cy="40" r="6" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
          <circle cx="62" cy="40" r="6" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        </g>
      ))}
      <g transform="translate(168 6)">
        <path d="M0 6a6 6 0 0 1 6-6h52l20 20v14H0z" fill="#1f8fcf" />
        <rect y="22" width="78" height="5" fill="#5cc8f2" />
        <rect x="8" y="6" width="16" height="11" rx="2" fill={win} />
        <path d="M34 6h22l12 12H34z" fill={win} />
        <circle cx="16" cy="40" r="6" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        <circle cx="60" cy="40" r="6" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        <circle cx="76" cy="26" r="2.5" fill="#ffffff" />
      </g>
    </svg>
  )
}

/**
 * The branch's history as stations on the shuttle-train line. On large screens the section pins and
 * vertical scrolling drives the train along the rail; elsewhere (and with reduced motion) it is a
 * plain vertical list with the rail running down the side.
 */
export function RailTimeline({ stops }: { stops: Stop[] }) {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(0)
  const t = T[useLang()]

  useEffect(() => {
    const wide = matchMedia('(min-width: 1024px)')
    const calm = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPinned(wide.matches && !calm.matches)
    update()
    wide.addEventListener('change', update)
    calm.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      calm.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const sec = section.current
    const tr = track.current
    if (!pinned || !sec || !tr) return
    const distance = (stops.length - 1) * GAP
    let raf = 0
    const size = () => {
      sec.style.height = `${distance + window.innerHeight}px`
    }
    const frame = () => {
      const scrollable = sec.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / scrollable))
      tr.style.transform = `translate3d(${-p * distance}px,0,0)`
      sec.style.setProperty('--p', p.toFixed(4))
      setActive(Math.round(p * (stops.length - 1)))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(frame)
    }
    const onResize = () => {
      size()
      onScroll()
    }
    size()
    frame()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      sec.style.height = ''
    }
  }, [pinned, stops.length])

  const heading = (
    <div className="wrap">
      <h2 id="history-title" className="text-[2rem] font-bold text-white md:text-[2.6rem]">
        {t.title[0]} <span className="text-blue-soft">{t.title[1]}</span>
      </h2>
      <p className="mt-2 max-w-2xl text-[1.02rem] text-slate-400">{t.lede}</p>
    </div>
  )

  if (!pinned) {
    return (
      <section id="history" aria-labelledby="history-title" className="relative isolate scroll-mt-24 overflow-hidden bg-deep py-16 md:py-22">
        <div aria-hidden="true" className="grid-lines-night absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(180deg,#000,transparent)]" />
        {heading}
        <ol className="wrap relative mt-10 grid gap-8 pl-12 md:pl-14">
          <li aria-hidden="true" className="absolute bottom-0 left-4 top-0 w-3 md:left-5 [background:repeating-linear-gradient(180deg,rgb(148_163_184/0.35)_0_3px,transparent_3px_14px)]">
            <span className="absolute inset-y-0 left-0 w-px bg-slate-400/50" />
            <span className="absolute inset-y-0 right-0 w-px bg-slate-400/50" />
          </li>
          {stops.map((s, i) => (
            <li key={s.year + s.title} data-reveal="fade" className="relative" style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}>
              <span aria-hidden="true" className="absolute -left-[38px] top-2 size-5 rounded-full border-4 border-deep md:-left-[42px]" style={{ background: s.tone, boxShadow: `0 0 0 3px ${s.tone}55` }} />
              <p className="font-[family-name:var(--font-en)] text-[1.9rem] font-bold leading-none" style={{ color: s.tone }}>
                {s.year}
                {s.date && <span className="ml-2 align-middle font-[family-name:var(--font-hind)] text-[1rem] font-semibold text-slate-300">{s.date}</span>}
              </p>
              <h3 className="mt-2 text-[1.2rem] font-bold text-white">{s.title}</h3>
              <p className="mt-1 max-w-xl leading-relaxed text-slate-300">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    )
  }

  return (
    <section ref={section} id="history" aria-labelledby="history-title" className="relative bg-deep">
      <div className="sticky top-[72px] flex h-[calc(100dvh-72px)] flex-col justify-center overflow-hidden">
        <div aria-hidden="true" className="grid-lines-night absolute inset-0 opacity-60 [mask-image:linear-gradient(180deg,#000,transparent)]" />
        <div className="relative">{heading}</div>

        <div className="relative mt-10 h-[360px]">
          {/* The rail: two lines and sleepers, part of the moving track. */}
          <ol ref={track} className="absolute inset-y-0 left-0 flex will-change-transform" style={{ paddingLeft: '30vw', paddingRight: '70vw' }}>
            <li
              aria-hidden="true"
              className="absolute left-0 right-0 top-[92px] h-4 [background:repeating-linear-gradient(90deg,rgb(148_163_184/0.4)_0_4px,transparent_4px_22px)]"
            >
              <span className="absolute inset-x-0 top-0 h-[2px] bg-slate-400/60" />
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-slate-400/60" />
            </li>
            {stops.map((s, i) => {
              const state = i === active ? 'now' : i < active ? 'past' : 'next'
              return (
                <li key={s.year + s.title} className="relative shrink-0" style={{ width: i === stops.length - 1 ? 0 : GAP }}>
                  <div className="absolute left-0 top-0 w-[380px] -translate-x-6">
                    <p
                      className="font-[family-name:var(--font-en)] text-[3.2rem] font-bold leading-none transition-[opacity,transform] duration-500"
                      style={{ color: s.tone, opacity: state === 'next' ? 0.35 : 1, transform: state === 'now' ? 'translateY(-6px)' : undefined }}
                    >
                      {s.year}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[88px] size-6 -translate-x-1/2 rounded-full border-[5px] border-deep transition-transform duration-500"
                    style={{ background: s.tone, boxShadow: state === 'now' ? `0 0 0 6px ${s.tone}40, 0 0 30px ${s.tone}` : `0 0 0 3px ${s.tone}40`, transform: `translateX(-50%) scale(${state === 'now' ? 1.25 : 1})` }}
                  />
                  <div
                    className="absolute left-0 top-[136px] w-[360px] -translate-x-6 rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition-[opacity,background-color] duration-500"
                    style={{ opacity: state === 'next' ? 0.4 : 1, backgroundColor: state === 'now' ? 'rgb(255 255 255 / 0.09)' : undefined }}
                  >
                    {s.date && <p className="text-[0.92rem] font-semibold text-slate-300">{s.date}</p>}
                    <h3 className="text-[1.25rem] font-bold text-white">{s.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-slate-300">{s.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
          {/* The train stays put; the world moves under it. Its nose marks the current station. */}
          <div className="pointer-events-none absolute top-[48px]" style={{ left: 'calc(30vw - 214px + 10px)' }}>
            <Train lit />
          </div>
        </div>

        <div className="wrap relative mt-4">
          <div className="h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <div className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#c4ecfc,#8fdcff,#5cc8f2,#1fa3dc)]" style={{ transform: 'scaleX(var(--p, 0))' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
