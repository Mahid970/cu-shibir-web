'use client'

import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'

/**
 * Endless row that drifts sideways, pauses on hover and can be dragged with a mouse
 * (touch scrolls natively). The content is rendered twice; the copy is inert.
 */
export function Marquee({
  children,
  duration = 60,
  reverse = false,
  label,
}: {
  children: ReactNode
  duration?: number
  reverse?: boolean
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ id: -1, startX: 0, startLeft: 0, moved: false })
  const [dragging, setDragging] = useState(false)

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !ref.current) return
    drag.current = { id: e.pointerId, startX: e.clientX, startLeft: ref.current.scrollLeft, moved: false }
    setDragging(true)
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || drag.current.id !== e.pointerId) return
    const dx = e.clientX - drag.current.startX
    if (!drag.current.moved) {
      if (Math.abs(dx) < 4) return
      drag.current.moved = true
      el.setPointerCapture(e.pointerId)
    }
    el.scrollLeft = drag.current.startLeft - dx
  }
  const up = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || drag.current.id !== e.pointerId) return
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    drag.current.id = -1
    setDragging(false)
  }

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      className="marquee"
      data-dragging={dragging}
      data-reverse={reverse || undefined}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onClickCapture={(e) => {
        if (drag.current.moved) {
          drag.current.moved = false
          e.preventDefault()
          e.stopPropagation()
        }
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="marquee__track" style={{ '--duration': `${duration}s` } as CSSProperties}>
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  )
}
