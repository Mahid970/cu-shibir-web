'use client'

import { useEffect, useRef } from 'react'

import { formatNumber } from '@/lib/bn'

/**
 * Counts from 0 to `value` in Bangla digits (1.8s, ease-out) as soon as it scrolls into view.
 * The server renders the final number; with motion on, CSS keeps it hidden until the counter
 * has reset it to ০, so it never flashes "২৪ → ০ → ২৪".
 */
export function CountUp({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!document.documentElement.classList.contains('motion') || !('IntersectionObserver' in window)) {
      el.dataset.ready = ''
      return
    }
    el.textContent = formatNumber(0)
    el.dataset.ready = ''
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1800)
          el.textContent = formatNumber(Math.round(value * (1 - Math.pow(1 - p, 3))))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      el.textContent = formatNumber(value)
    }
  }, [value])

  return (
    <span className={className}>
      <span ref={ref} className="count-num">
        {formatNumber(value)}
      </span>
      {suffix}
    </span>
  )
}
