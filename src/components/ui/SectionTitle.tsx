import type { CSSProperties, ReactNode } from 'react'

/** Inline CSS custom properties, e.g. vars({ '--d': '120ms' }). */
export const vars = (v: Record<`--${string}`, string | number>) => v as CSSProperties

/** Curved underline drawn under highlighted words (gradients live in <SvgDefs/>). */
export function Swoosh({ dark = false }: { dark?: boolean }) {
  return (
    <svg viewBox="0 0 367 10" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M2 8C52.54 3.47 195.89-2.87 365 8"
        fill="none"
        stroke={dark ? 'url(#swoosh-green)' : 'url(#swoosh-blue)'}
        strokeWidth={4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export type TitlePart = string | { hl: string } | { node: ReactNode }

/**
 * Section title: word groups drop in with a soft blur one after another when the title first
 * scrolls into view; highlighted groups get gradient text and a swoosh that draws itself.
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
            <span key={i} className={`hl ${dark ? 'hl-green' : ''}`} style={style}>
              {space}
              {part.hl}
              <Swoosh dark={dark} />
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
 * leaves the `.lime` words highlighted. Plain text without JavaScript or with reduced motion.
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

/** Bangla label in a tab hanging from the top edge of a night section; wipes in on view. */
export function EyebrowTab({ text, fill = '#061327' }: { text: string; fill?: string }) {
  return (
    <div className="eyebrow-tab">
      <svg viewBox="0 0 270 45" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0H270L263.99 23.06C261.23 33.63 251.69 41 240.76 41H29.24C18.31 41 8.77 33.63 6.01 23.06L0 0Z" fill={fill} />
        <path
          d="M269.35.5 263.5 22.93C260.8 33.28 251.46 40.5 240.76 40.5H29.24C18.54 40.5 9.2 33.28 6.5 22.93L.65.5"
          fill="none"
          stroke="url(#eyebrow-edge)"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span data-reveal="wipe" data-amount="0.5">
        {text}
      </span>
    </div>
  )
}

/** Shared SVG gradients referenced by id from the components above. Render once per page. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="swoosh-blue" cx="50%" cy="50%" r="60%">
          <stop stopColor="#0060fa" />
          <stop offset="1" stopColor="#002b70" />
        </radialGradient>
        <linearGradient id="swoosh-green" x1="0" x2="1">
          <stop stopColor="#7ef7a8" />
          <stop offset="1" stopColor="#2fce55" />
        </linearGradient>
        <linearGradient id="eyebrow-edge" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#e1fd14" />
          <stop offset="1" stopColor="#002b70" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
