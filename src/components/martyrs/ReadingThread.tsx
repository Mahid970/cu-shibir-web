'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * A rail beside the story that fills as the reader goes down it; each part's star lights when its
 * heading reaches the middle of the screen. Without motion the rail is simply full.
 */
export function ReadingThread({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parts = [...el.querySelectorAll<HTMLElement>('[data-part]')]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) (e.target as HTMLElement).dataset.lit = 'true'
      },
      { rootMargin: '0px 0px -40% 0px' },
    )
    parts.forEach((p) => io.observe(p))
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height))
        el.style.setProperty('--rail', p.toFixed(3))
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

  return (
    <div ref={ref} className="story-thread relative">
      {children}
    </div>
  )
}
