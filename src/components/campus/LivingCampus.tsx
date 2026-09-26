'use client'

import { Link } from '@/i18n/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { ArrowRight, Clock } from '@/components/ui/Icons'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatTime } from '@/lib/bn'
import { PALETTES } from '@/lib/skyPalettes'

import { CampusPoster } from './CampusPoster'
import type { LabelId, SceneHandle } from './scene'
import { detectTier } from './tier'

// A clock that ticks once a minute (the sky changes slowly). null during server rendering.
let minute = 0
function subscribeClock(onTick: () => void) {
  const id = window.setInterval(onTick, 30_000)
  return () => window.clearInterval(id)
}
const clockSnapshot = () => {
  // QA override: ?campusHour=17.5 shows today at 17:30 Chattogram time.
  const hour = Number(new URLSearchParams(location.search).get('campusHour'))
  const at = hour ? Date.now() - (((Date.now() / 3_600_000 + 6) % 24) - hour) * 3_600_000 : Date.now()
  const m = Math.floor(at / 60_000)
  if (m !== minute) minute = m
  return minute
}
const serverClock = () => null

type SkyLib = typeof import('@/lib/sky')

const LABELS: { id: LabelId; text: string }[] = [
  { id: 'train', text: 'শাটল ট্রেন' },
  { id: 'station', text: 'বিশ্ববিদ্যালয় স্টেশন' },
  { id: 'halls', text: 'ক্যাম্পাস' },
  { id: 'cut', text: 'কাটা পাহাড়' },
]

/**
 * "আমাদের ক্যাম্পাস": the campus in its current light. The sky follows Chattogram time; the next
 * prayer is shown beside it. Capable devices get a live 3D scene (loaded only when the section
 * comes near); everyone else sees the same scene as an illustration.
 */
export function LivingCampus() {
  const tick = useSyncExternalStore(subscribeClock, clockSnapshot, serverClock)
  // Prayer-time maths (adhan) loads with the section, not with the page.
  const [skyLib, setSkyLib] = useState<SkyLib | null>(null)
  const now = tick === null ? null : new Date(tick * 60_000)
  const sky = now && skyLib ? skyLib.skyAt(now) : null
  const palette = sky?.palette ?? PALETTES.day
  const prayer = now && skyLib ? skyLib.nextPrayer(now) : null

  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const labelRefs = useRef<Partial<Record<LabelId, HTMLElement>>>({})
  const handle = useRef<SceneHandle | null>(null)
  const [live, setLive] = useState(false)

  // Load the scene when the section gets close, on devices that can take it.
  useEffect(() => {
    const el = stage.current
    if (!el) return
    let disposed = false
    const soon = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        soon.disconnect()
        import('@/lib/sky').then((lib) => !disposed && setSkyLib(lib))
      },
      { rootMargin: '800px 0px' },
    )
    soon.observe(el)
    const tier = detectTier()
    if (tier === 0) {
      return () => {
        disposed = true
        soon.disconnect()
      }
    }
    let visible = false
    const idle = (cb: () => void) => (typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 300))

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        near.disconnect()
        idle(async () => {
          const [{ createCampusScene }, { skyAt }] = await Promise.all([import('./scene'), import('@/lib/sky')])
          if (disposed || !canvas.current) return
          handle.current = createCampusScene(canvas.current, { tier, palette: skyAt(new Date()).palette, labels: labelRefs.current })
          handle.current.setRunning(visible && !document.hidden)
          setLive(true)
        })
      },
      { rootMargin: '400px 0px' },
    )
    near.observe(el)

    const onScreen = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      handle.current?.setRunning(visible && !document.hidden)
    })
    onScreen.observe(el)
    const onVisibility = () => handle.current?.setRunning(visible && !document.hidden)
    const onResize = () => handle.current?.resize()
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      handle.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1)
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)
    el.addEventListener('pointermove', onMove)
    return () => {
      disposed = true
      soon.disconnect()
      near.disconnect()
      onScreen.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      el.removeEventListener('pointermove', onMove)
      handle.current?.dispose()
      handle.current = null
    }
  }, [])

  // Keep the scene's light in step with the clock.
  useEffect(() => {
    if (sky) handle.current?.setPalette(sky.palette)
  }, [sky, live])

  const dark = palette.stars > 0.4

  return (
    <section className="cv-auto py-16 md:py-22" aria-labelledby="campus-title">
      <div className="wrap">
        <SectionTitle id="campus-title" parts={['আমাদের', { hl: 'ক্যাম্পাস' }]} />
        <p className="lede">পাহাড়ঘেরা ২,৩১২ একর, শহর থেকে শাটল ট্রেনে যাতায়াত। এখানে আকাশের রং মিলে যায় চট্টগ্রামের এই মুহূর্তের সময়ের সাথে।</p>

        <div
          ref={stage}
          data-reveal="scale"
          className="relative mx-auto mt-10 aspect-[4/5] max-w-6xl overflow-hidden rounded-[28px] shadow-[0_30px_60px_rgb(0_43_112/0.18)] sm:aspect-[16/10] lg:aspect-[21/9]"
        >
          <CampusPoster palette={palette} />
          <canvas
            ref={canvas}
            aria-hidden="true"
            className={`absolute inset-0 size-full transition-opacity duration-1000 ${live ? 'opacity-100' : 'opacity-0'}`}
          />
          {LABELS.map((l) => (
            <span
              key={l.id}
              ref={(node) => {
                if (node) labelRefs.current[l.id] = node
              }}
              aria-hidden="true"
              className={`pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full px-3 py-1 text-[0.8rem] font-semibold shadow-lg transition-opacity duration-500 ${
                dark ? 'bg-night/80 text-white ring-1 ring-white/15' : 'bg-white/90 text-ink'
              } ${live ? '' : 'hidden'}`}
              style={{ opacity: 0 }}
            >
              {l.text}
            </span>
          ))}

          {sky && prayer && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-5 sm:top-5">
              <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.9rem] font-semibold backdrop-blur ${dark ? 'bg-night/70 text-white' : 'bg-white/85 text-ink'}`}>
                <span aria-hidden="true" className="size-2 rounded-full bg-mint shadow-[0_0_10px_#00fb97]" />
                চট্টগ্রামে এখন {formatTime(now!)}
              </p>
              <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.9rem] font-semibold backdrop-blur ${dark ? 'bg-night/70 text-white' : 'bg-white/85 text-ink'}`}>
                <Clock className="size-4" />
                পরবর্তী নামাজ {prayer.name}, {formatTime(prayer.at)}
              </p>
            </div>
          )}
          <p className={`absolute bottom-3 right-4 text-[0.75rem] ${dark ? 'text-white/60' : 'text-ink/60'}`}>প্রতীকী দৃশ্য, মানচিত্র নয়</p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/services/campus" className="btn btn-outline-blue">
            ক্যাম্পাস গাইড দেখুন
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
