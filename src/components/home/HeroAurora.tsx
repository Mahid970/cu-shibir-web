'use client'

import { useEffect, useRef } from 'react'

/**
 * Soft lights drifting behind the home hero. They pause while the hero is off screen, and on
 * desktop they lean a few pixels toward the pointer, each by a different amount, so the sky
 * feels deep. Still with reduced motion (the drift only runs under `.motion`).
 */
export function HeroAurora() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sky = ref.current
    const hero = sky?.closest('section')
    if (!sky || !hero) return

    const io = new IntersectionObserver(([e]) => hero.toggleAttribute('data-paused', !e.isIntersecting))
    io.observe(hero)

    const motion = document.documentElement.classList.contains('motion')
    if (!motion || !matchMedia('(pointer: fine)').matches) return () => io.disconnect()

    let frame = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect()
        sky.style.setProperty('--px', `${((e.clientX - r.left) / r.width - 0.5) * 40}px`)
        sky.style.setProperty('--py', `${((e.clientY - r.top) / r.height - 0.5) * 30}px`)
      })
    }
    const leave = () => {
      sky.style.setProperty('--px', '0px')
      sky.style.setProperty('--py', '0px')
    }
    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerleave', leave)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10">
      {(['a', 'b', 'c', 'd'] as const).map((k) => (
        <span key={k} className={`aurora__lean aurora__lean--${k}`}>
          <span className={`aurora__light aurora__light--${k}`} />
        </span>
      ))}
    </div>
  )
}
