'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * Pinned folder stack (phitron's syllabus section). On wide screens with motion allowed it sets
 * `data-pin`: the stage grows by 70vh per card, `.five-panel` sticks under the header, and every
 * card after the first waits below the panel with only its tab showing, then slides straight up
 * over the one before as the page scrolls. Otherwise the cards stay a plain list.
 */
export function FolderStack({ children, steps, className = '' }: { children: ReactNode; steps: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = ref.current
    const panel = stage?.querySelector<HTMLElement>('.five-panel')
    const area = stage?.querySelector<HTMLElement>('.five-area')
    if (!stage || !panel || !area) return
    const layers = [...area.children] as HTMLElement[]
    const wide = matchMedia('(min-width: 1024px)')
    let raf = 0
    let shown = false
    let pinned = false
    let parked = 0

    const frame = () => {
      raf = 0
      if (!pinned) return
      const range = stage.offsetHeight - panel.offsetHeight
      const scrolled = parseFloat(getComputedStyle(panel).top) - stage.getBoundingClientRect().top
      const p = Math.min(1, Math.max(0, scrolled / Math.max(1, range))) * (layers.length - 1)
      layers.forEach((layer, k) => {
        if (k === 0) return
        const t = Math.min(1, Math.max(0, p - (k - 1)))
        layer.style.transform = t >= 1 ? 'none' : `translateY(${((1 - t) * parked).toFixed(2)}px)`
      })
    }
    const onScroll = () => {
      if (shown && !raf) raf = requestAnimationFrame(frame)
    }
    const setup = () => {
      pinned = wide.matches && document.documentElement.classList.contains('motion')
      stage.toggleAttribute('data-pin', pinned)
      if (!pinned) {
        layers.forEach((layer) => (layer.style.transform = ''))
        return
      }
      // Park waiting cards so their tabs sit on the panel's bottom edge.
      parked = panel.clientHeight - area.offsetTop + 2
      frame()
    }

    setup()
    const io = new IntersectionObserver(([e]) => {
      shown = e.isIntersecting
      onScroll()
    })
    io.observe(stage)
    wide.addEventListener('change', setup)
    window.addEventListener('resize', setup)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      wide.removeEventListener('change', setup)
      window.removeEventListener('resize', setup)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div ref={ref} className={className} style={{ '--steps': steps } as CSSProperties}>
      {children}
    </div>
  )
}
