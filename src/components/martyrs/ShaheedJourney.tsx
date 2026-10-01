'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { ArrowRight } from '@/components/ui/Icons'
import { StarGlyph } from '@/components/ui/SectionTitle'
import { Link } from '@/i18n/link'
import type { Station } from '@/lib/martyrs'
import { splitHonorific } from '@/lib/martyrs'

type Labels = {
  eyebrow: string
  title: string
  lede: string
  read: string
  /** counts[i]: "শহীদ ৩ / ১০" when the lamp has reached station i. */
  counts: string[]
  endTitle: string
  endText: string
  endLink?: string
}

// Geometry of the horizontal journey, in px along the road. Station i stands at FIRST + i·GAP,
// measured from where the lamp starts; the road waves so that neighbours sit high and low.
const GAP = 330
const FIRST = 90
const END = 420
const BAND = 180
const roadY = (s: number) => 90 + 38 * Math.sin(Math.PI / 2 + (Math.PI * (s - FIRST)) / GAP)

function roadPath(from: number, to: number) {
  let d = ''
  for (let x = from; x <= to; x += 10) d += `${d ? 'L' : 'M'}${x} ${roadY(x).toFixed(1)}`
  return d
}

/** Arch-topped portrait that comes from grey to colour when its light reaches it. */
function Arch({ station, sizes, className = '' }: { station: Station; sizes: string; className?: string }) {
  return (
    <span className={`journey-arch relative block overflow-hidden bg-navy ${className}`}>
      {station.portrait && <Image src={station.portrait.src} alt="" fill sizes={sizes} className="object-cover object-top" />}
    </span>
  )
}

function Name({ name }: { name: string }) {
  const { honorific, rest } = splitHonorific(name)
  return (
    <>
      {honorific && <span className="block text-[0.78rem] font-semibold text-blue-soft/90">{honorific}</span>}
      <span className="block">{rest}</span>
    </>
  )
}

/**
 * শহীদি কাফেলা: the branch's martyrs as a procession of light. On large screens the section pins
 * and scrolling carries a lamp along a road through the night hills; each martyr's card
 * lights as the lamp reaches it, the year turns over and the sky lifts towards light. On phones,
 * and for anyone who prefers less motion, the same road runs down the page. Every card opens
 * that martyr's own page.
 */
export function ShaheedJourney({ stations, labels, id = 'shaheed-journey' }: { stations: Station[]; labels: Labels; id?: string }) {
  const n = stations.length
  const D = FIRST + (n - 1) * GAP + END
  const section = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const lamp = useRef<HTMLDivElement>(null)
  const trail = useRef<SVGRectElement>(null)
  const vertical = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)
  const [lit, setLit] = useState(-1)

  // Horizontal: scroll position → progress → track offset, lamp height, lit stations, sky.
  useEffect(() => {
    const el = section.current
    if (!el || !stage.current) return
    const wide = matchMedia('(min-width: 1024px)')
    let raf = 0
    let shown = false
    let lastLit = -2
    const frame = () => {
      raf = 0
      if (!wide.matches || !document.documentElement.classList.contains('motion')) return
      const r = el.getBoundingClientRect()
      const run = el.offsetHeight - (stage.current?.offsetHeight ?? 0)
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, run)))
      const s = p * D
      track.current?.style.setProperty('transform', `translate3d(${-s}px,0,0)`)
      lamp.current?.style.setProperty('transform', `translate3d(-50%, ${roadY(s) - 90}px, 0)`)
      trail.current?.setAttribute('width', String(700 + s))
      stage.current?.style.setProperty('--p', p.toFixed(3))
      const reached = Math.min(n - 1, Math.floor((s - FIRST + 40) / GAP))
      if (reached !== lastLit) {
        lastLit = reached
        setLit(reached)
        setActive(Math.max(0, reached))
      }
    }
    const onScroll = () => {
      if (shown && !raf) raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(([e]) => {
      shown = e.isIntersecting
      if (shown) onScroll()
    })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [D, n])

  // Vertical: each station lights as it crosses the middle of the screen; the rail fills behind it.
  useEffect(() => {
    const list = vertical.current
    if (!list) return
    const items = [...list.querySelectorAll<HTMLElement>('[data-station]')]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) (e.target as HTMLElement).dataset.lit = 'true'
      },
      { rootMargin: '0px 0px -45% 0px' },
    )
    items.forEach((i) => io.observe(i))
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = list.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, (innerHeight * 0.55 - r.top) / r.height))
        list.style.setProperty('--rail', p.toFixed(3))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const current = stations[active]

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="journey relative isolate bg-night text-white">
      {/* ---------- Large screens: pinned, scroll-driven road ---------- */}
      <div ref={section} className="journey-h relative" style={{ height: `calc(100svh - 72px + ${D}px)` }}>
        <div ref={stage} className="journey-stage sticky top-[72px] h-[calc(100svh-72px)] overflow-hidden">
          <div aria-hidden="true" className="journey-sky absolute inset-0" />
          <div aria-hidden="true" className="journey-light absolute inset-0" />
          <div aria-hidden="true" className="journey-stars absolute inset-0" />
          <div aria-hidden="true" className="lattice-night absolute inset-0 opacity-40 [mask-image:linear-gradient(180deg,#000,transparent_70%)]" />
          <svg aria-hidden="true" viewBox="0 0 1440 220" preserveAspectRatio="none" className="journey-hills absolute inset-x-0 bottom-0 h-[26%] w-[112%]">
            <path d="M0 150C120 92 236 112 360 82S604 38 760 90s262-32 404-20 200 42 276 20v130H0Z" fill="#1f8fcf" fillOpacity=".32" />
            <path d="M0 172c160-50 300-22 460-58s296-12 440 22 280-34 400-14 104 22 140 12v86H0Z" fill="#5cc8f2" fillOpacity=".18" />
          </svg>

          <div className="wrap relative z-10 flex items-start justify-between gap-8 pt-8">
            <div className="max-w-md">
              <p className="eyebrow-tab !mx-0">
                <StarGlyph />
                <span>{labels.eyebrow}</span>
              </p>
              <h2 id={`${id}-title`} className="mt-4 text-[2.4rem] font-bold leading-tight text-white xl:text-[2.8rem]">
                {labels.title}
              </h2>
              <p className="mt-2 max-w-sm text-[0.98rem] leading-relaxed text-white/70">{labels.lede}</p>
            </div>
            <div className="text-right" aria-live="polite">
              <p key={current?.year} className="journey-year text-[4.5rem] font-bold leading-none text-blue-soft xl:text-[5.5rem]">
                {current?.year}
              </p>
              <p className="mt-1 text-[0.95rem] font-semibold text-white/70">{labels.counts[Math.max(0, lit)]}</p>
            </div>
          </div>

          <div ref={track} className="journey-track absolute inset-y-0 left-[38%] will-change-transform">
            <svg aria-hidden="true" className="absolute bottom-[12%] overflow-visible" style={{ left: -700, width: D + 1100, height: BAND }} viewBox={`-700 0 ${D + 1100} ${BAND}`}>
              <defs>
                <linearGradient id={`${id}-trail`} x1="0" x2="1">
                  <stop offset="0" stopColor="#a5e4fb" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#5cc8f2" />
                </linearGradient>
                <clipPath id={`${id}-lit`}>
                  <rect ref={trail} x={-700} y={0} width={700} height={BAND} />
                </clipPath>
              </defs>
              <path d={roadPath(-700, D + 400)} fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth={2} strokeDasharray="2 10" strokeLinecap="round" />
              <path d={roadPath(-700, D + 400)} fill="none" stroke={`url(#${id}-trail)`} strokeWidth={4} strokeLinecap="round" clipPath={`url(#${id}-lit)`} className="journey-trail" />
            </svg>

            {stations.map((st, i) => {
              const s = FIRST + i * GAP
              const node = `calc(12% + ${BAND - roadY(s)}px)`
              return (
                <div key={st.slug} data-lit={i <= lit || undefined} data-current={i === lit || undefined} className="journey-station absolute" style={{ left: s, bottom: node }}>
                  <span aria-hidden="true" className="journey-node absolute left-0 top-0 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
                    <StarGlyph className="size-4" />
                  </span>
                  <span aria-hidden="true" className="journey-post absolute bottom-0 left-0 h-9 w-px -translate-x-1/2" />
                  <span aria-hidden="true" className="journey-milestone absolute left-0 top-[calc(100%+22px)] -translate-x-1/2 whitespace-nowrap text-[0.85rem] font-bold">
                    {st.year}
                  </span>
                  <Link
                    href={`/martyrs/${st.slug}`}
                    className="journey-card group absolute bottom-9 left-0 block w-[236px] -translate-x-1/2 rounded-[1.4rem] p-2.5 pb-4 outline-none"
                  >
                    <Arch station={st} sizes="220px" className="h-[clamp(118px,19vh,172px)] w-full" />
                    <span className="mt-3 block px-1.5 text-center">
                      {st.ordinal && <span className="block text-[0.74rem] font-semibold text-white/55">{st.ordinal}</span>}
                      <span className="mt-0.5 block text-[1.08rem] font-bold leading-snug text-white">
                        <Name name={st.name} />
                      </span>
                      <span className="mt-1 block text-[0.84rem] font-semibold text-blue-soft">{st.date}</span>
                      <span className="mt-0.5 block text-[0.8rem] leading-snug text-white/60">{st.place}</span>
                      <span className="journey-read mt-2 inline-flex items-center gap-1 text-[0.82rem] font-semibold text-white">
                        {labels.read}
                        <ArrowRight className="size-3.5" />
                      </span>
                    </span>
                  </Link>
                </div>
              )
            })}

            <div className="journey-end absolute bottom-[calc(12%+60px)] w-[320px] -translate-x-1/2 text-center" style={{ left: D - 60 }}>
              <span aria-hidden="true" className="mx-auto block size-16 rounded-full bg-[radial-gradient(circle,#ffffff,#5cc8f2_55%,transparent_72%)] blur-[1px]" />
              <p className="mt-4 text-[1.4rem] font-bold text-white">{labels.endTitle}</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-white/70">{labels.endText}</p>
              {labels.endLink && (
                <Link href="/martyrs" className="btn btn-sky btn-sm mt-5">
                  {labels.endLink}
                  <ArrowRight />
                </Link>
              )}
            </div>
          </div>

          <div ref={lamp} aria-hidden="true" className="journey-lamp absolute left-[38%]" style={{ bottom: `calc(12% + ${BAND - 90}px - 14px)` }} />
        </div>
      </div>

      {/* ---------- Phones, tablets and reduced motion: the road runs down the page ---------- */}
      <div className="journey-v wrap py-16 md:py-20">
        <div className="text-center">
          <p className="eyebrow-tab">
            <StarGlyph />
            <span>{labels.eyebrow}</span>
          </p>
          <h2 className="mt-4 text-[2rem] font-bold text-white md:text-[2.4rem]">{labels.title}</h2>
          <p className="mx-auto mt-2 max-w-md leading-relaxed text-white/70">{labels.lede}</p>
        </div>
        <ol ref={vertical} className="journey-rail relative mx-auto mt-12 max-w-xl">
          {stations.map((st) => (
            <li key={st.slug} data-station className="journey-vstation relative pb-8 pl-12 last:pb-0">
              <span aria-hidden="true" className="journey-node absolute left-[18px] top-6 grid size-9 -translate-x-1/2 place-items-center rounded-full">
                <StarGlyph className="size-4" />
              </span>
              <Link href={`/martyrs/${st.slug}`} className="journey-card group flex gap-4 rounded-[1.25rem] p-3 outline-none">
                <Arch station={st} sizes="96px" className="h-[118px] w-[92px] shrink-0" />
                <span className="min-w-0 py-1">
                  <span className="block text-[0.85rem] font-bold text-blue-soft">
                    {st.year}
                    {st.ordinal && <span className="ml-2 font-semibold text-white/55">· {st.ordinal}</span>}
                  </span>
                  <span className="mt-0.5 block text-[1.08rem] font-bold leading-snug text-white">{st.name}</span>
                  <span className="mt-1 block text-[0.84rem] text-white/65">
                    {st.date} · {st.place}
                  </span>
                  <span className="journey-read mt-1.5 inline-flex items-center gap-1 text-[0.82rem] font-semibold text-white">
                    {labels.read}
                    <ArrowRight className="size-3.5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-12 max-w-md text-center">
          <span aria-hidden="true" className="mx-auto block size-14 rounded-full bg-[radial-gradient(circle,#ffffff,#5cc8f2_55%,transparent_72%)]" />
          <p className="mt-3 text-[1.25rem] font-bold text-white">{labels.endTitle}</p>
          <p className="mt-2 leading-relaxed text-white/70">{labels.endText}</p>
          {labels.endLink && (
            <Link href="/martyrs" className="btn btn-sky btn-sm mt-5">
              {labels.endLink}
              <ArrowRight />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
