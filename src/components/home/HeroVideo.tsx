'use client'

import { useEffect, useRef, useState } from 'react'

/** The loop's first frame at 32×18 (132 bytes), stretched and blurred until the video plays. */
const PREVIEW = 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAACwBACdASogABIAPuFSpE2opCOiN/qoARAcCWUAwzQh2B+olySpWmkc/fjZL1YAAP6RY69Foi0AxhhtojTFszy8HyQZGhd8GUl+wTKxlE4CGdejKUJ82nTl3niNK2N+Y3+EOnByCXScyXyH+s2qQAAA'

/** Two crops of the campus aerial loop: landscape for most screens, portrait for phones held upright. */
const PHONE = '(max-aspect-ratio: 2/3)'
const LOOPS = {
  landscape: { base: '/video/hero/campus-720', width: 1280, height: 720, bitrate: 400_000 },
  portrait: { base: '/video/hero/campus-540x960', width: 540, height: 960, bitrate: 280_000 },
}

/** AV1 only where the device decodes it smoothly (and, on phones, in hardware); H.264 everywhere else. */
async function pickCodec(loop: (typeof LOOPS)['landscape'], phone: boolean) {
  try {
    const info = await navigator.mediaCapabilities.decodingInfo({
      type: 'file',
      video: { contentType: 'video/mp4; codecs="av01.0.05M.08"', width: loop.width, height: loop.height, bitrate: loop.bitrate, framerate: 30 },
    })
    if (info.supported && info.smooth && (info.powerEfficient || !phone)) return 'av1'
  } catch {}
  return 'h264'
}

type Connection = { saveData?: boolean; effectiveType?: string }

/**
 * Silent aerial loop of the campus behind the home hero. A 132-byte blurred frame shows at once
 * and the loop's first frame (15–28 KB) over it; the video only loads once the page has finished
 * loading and the browser is idle, then fades in over that still. Data saver, 2G and reduced
 * motion keep the still. Plays only while the hero is on screen.
 *
 * The still has to be there from the start: it is the hero's largest paint. The video frame that
 * later replaces it is drawn 2 px smaller on each side (hidden under the tint), so it never
 * counts as a new, later largest paint.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    const hero = video?.closest('section')
    if (!video || !hero) return
    let io: IntersectionObserver | undefined
    let cancelled = false

    const start = async () => {
      const conn = (navigator as Navigator & { connection?: Connection }).connection
      const lite = !document.documentElement.classList.contains('motion') || conn?.saveData || /2g/.test(conn?.effectiveType ?? '')
      if (lite) return
      const phone = matchMedia(PHONE).matches
      const loop = phone ? LOOPS.portrait : LOOPS.landscape
      const codec = await pickCodec(loop, phone)
      if (cancelled) return
      video.src = `${loop.base}.${codec}.mp4`
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()))
      io.observe(hero)
    }
    const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 300))
    if (document.readyState === 'complete') idle()
    else addEventListener('load', idle, { once: true })

    return () => {
      cancelled = true
      removeEventListener('load', idle)
      io?.disconnect()
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <div className="hero-video__preview absolute inset-0" style={{ backgroundImage: `url(${PREVIEW})` }} />
      <picture>
        <source media={PHONE} srcSet={`${LOOPS.portrait.base}.webp`} width={LOOPS.portrait.width} height={LOOPS.portrait.height} />
        <img src={`${LOOPS.landscape.base}.webp`} width={LOOPS.landscape.width} height={LOOPS.landscape.height} alt="" fetchPriority="high" className="hero-video__media" />
      </picture>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        onPlaying={() => setPlaying(true)}
        className={`hero-video__media hero-video__clip ${playing ? 'is-playing' : ''}`}
      />
      <div className="hero-video__tint absolute inset-0" />
    </div>
  )
}
