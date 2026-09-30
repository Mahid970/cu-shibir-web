import type { ReactNode } from 'react'

import { vars } from '@/components/ui/SectionTitle'

/** Pops in, then bobs and wobbles forever (campus-life icons around a hero). Decorative. */
export function FloatIcon({
  children,
  className = '',
  rotate = 0,
  wobble = 6,
  drift = 14,
  duration = 6,
  delay = 0.35,
}: {
  children: ReactNode
  className?: string
  rotate?: number
  wobble?: number
  drift?: number
  duration?: number
  delay?: number
}) {
  return (
    <span
      aria-hidden="true"
      className={`float-icon ${className}`}
      style={vars({
        '--r': `${rotate}deg`,
        '--w': `${wobble}deg`,
        '--drift': `${drift}px`,
        '--dur': `${duration}s`,
        '--pop': `${delay}s`,
      })}
    >
      <span>{children}</span>
    </span>
  )
}
