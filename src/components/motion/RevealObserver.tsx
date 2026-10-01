'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect } from 'react'

/**
 * One observer for the whole site. Elements opt in with
 * `data-reveal="up|fade|scale|wipe|title|sweep|draw"`; this flips their `data-state` to
 * "visible" once, when `data-amount` (default 0.12) of them is on screen. CSS in globals.css does
 * the animating, so nothing re-hides or flickers on the way back up.
 */
export function RevealObserver() {
  const pathname = usePathname()

  // Switching language rebuilds the root layout, and React resets <html>'s classes when it does.
  // Put `motion` back before the new page paints (the inline script only runs on a full load).
  useLayoutEffect(() => {
    try {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('motion')
    } catch {
      // matchMedia unavailable: leave everything visible
    }
  }, [pathname])

  useEffect(() => {
    const all = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-state="visible"])')
    if (!document.documentElement.classList.contains('motion') || !('IntersectionObserver' in window)) {
      all().forEach((el) => (el.dataset.state = 'visible'))
      return
    }

    const observers = new Map<number, IntersectionObserver>()
    const seen = new WeakSet<Element>()

    const observerFor = (amount: number) => {
      let io = observers.get(amount)
      if (!io) {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting || entry.intersectionRatio < amount - 0.001) continue
              const el = entry.target as HTMLElement
              el.dataset.state = 'visible'
              observer.unobserve(el)
            }
          },
          // Trigger a little before the element reaches the bottom edge on tall phones.
          { threshold: [0, amount], rootMargin: '0px 0px -6% 0px' },
        )
        observers.set(amount, observer)
        io = observer
      }
      return io
    }

    const scan = () => {
      all().forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        const amount = Math.min(1, Math.max(0, Number(el.dataset.amount ?? 0.12)))
        observerFor(amount).observe(el)
      })
    }

    scan()
    let raf = 0
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(scan)
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      cancelAnimationFrame(raf)
      observers.forEach((io) => io.disconnect())
    }
  }, [pathname])

  return null
}
