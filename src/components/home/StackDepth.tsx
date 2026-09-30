'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Stacked sticky cards: as the next card slides over one, that card sinks back a little
 * (--cover goes 0 → 1; CSS scales and dims it). Runs only while the stack is on screen.
 */
export function StackDepth({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = ref.current
    if (!list || !document.documentElement.classList.contains('motion')) return
    const items = [...list.children] as HTMLElement[]
    let raf = 0
    let shown = false
    const frame = () => {
      raf = 0
      for (let i = 0; i < items.length - 1; i++) {
        const a = items[i].getBoundingClientRect()
        const b = items[i + 1].getBoundingClientRect()
        // How far the next card has climbed over this one, relative to this card's height.
        const cover = Math.min(1, Math.max(0, (a.bottom - b.top) / Math.max(1, a.height)))
        items[i].style.setProperty('--cover', cover.toFixed(3))
      }
    }
    const onScroll = () => {
      if (shown && !raf) raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(([e]) => {
      shown = e.isIntersecting
      onScroll()
    })
    io.observe(list)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  )
}
