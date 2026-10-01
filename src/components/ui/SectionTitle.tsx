import type { CSSProperties, ReactNode } from 'react'

/** Inline CSS custom properties, e.g. vars({ '--d': '120ms' }). */
export const vars = (v: Record<`--${string}`, string | number>) => v as CSSProperties

export type TitlePart = string | { hl: string } | { node: ReactNode }

/**
 * Section title: word groups drop in with a soft blur one after another when the title first
 * scrolls into view; highlighted groups take the brand colour.
 */
export function SectionTitle({
  parts,
  as: Tag = 'h2',
  id,
  dark = false,
  align = 'center',
  className = '',
}: {
  parts: TitlePart[]
  as?: 'h1' | 'h2'
  id?: string
  dark?: boolean
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <Tag
      id={id}
      // Page titles are above the fold: they animate from the first paint instead of waiting for the observer.
      data-reveal={Tag === 'h1' ? 'title-now' : 'title'}
      data-amount="0.15"
      className={`title ${dark ? 'title-dark' : ''} ${align === 'left' ? 'title-left' : ''} ${className}`}
    >
      {parts.map((part, i) => {
        const style = vars({ '--i': i })
        const space = i > 0 ? ' ' : null
        if (typeof part === 'string')
          return (
            <span key={i} style={style}>
              {space}
              {part}
            </span>
          )
        if ('hl' in part)
          return (
            <span key={i} className="hl" style={style}>
              {space}
              {part.hl}
            </span>
          )
        return (
          <span key={i} style={style} className="self-center" aria-hidden="true">
            {part.node}
          </span>
        )
      })}
    </Tag>
  )
}

/**
 * Night-section heading: white text; when it scrolls into view a light band wipes across and
 * leaves the `.glow` words highlighted. Plain text without JavaScript or with reduced motion.
 */
export function SweepTitle({
  children,
  as: Tag = 'h2',
  id,
  className = '',
}: {
  children: ReactNode
  as?: 'h1' | 'h2'
  id?: string
  className?: string
}) {
  return (
    <Tag id={id} data-reveal="sweep" data-amount="0.4" className={`sweep ${className}`}>
      {children}
      <span aria-hidden="true" className="sweep__layer sweep__cover">
        {children}
      </span>
      <span aria-hidden="true" className="sweep__layer sweep__band">
        {children}
      </span>
    </Tag>
  )
}

/** Eight-point star (two overlapping squares), the site's small ornament. */
export function StarGlyph({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12 1.5 15 5.2l4.4-.6-.6 4.4 3.7 3-3.7 3 .6 4.4-4.4-.6-3 3.7-3-3.7-4.4.6.6-4.4-3.7-3 3.7-3-.6-4.4 4.4.6Z" fill="currentColor" />
    </svg>
  )
}

/** Label that opens a night section: a slowly turning star and amber text; the text wipes in on view. */
export function EyebrowTab({ text }: { text: string }) {
  return (
    <div className="eyebrow-tab" data-reveal="label" data-amount="0.5">
      <StarGlyph />
      <span>{text}</span>
    </div>
  )
}
