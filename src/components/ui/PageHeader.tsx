import type { ReactNode } from 'react'

import { SectionTitle, StarGlyph, vars, type TitlePart } from './SectionTitle'

/** Inner-page header: the star lattice and wash, a few slowly turning stars, a centred title with a highlight. */
export function PageHeader({ title, lede, children }: { title: string | TitlePart[]; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="hero-wash relative isolate overflow-hidden pb-14 pt-12 md:pb-20 md:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="lattice absolute inset-0 [mask-image:radial-gradient(80%_90%_at_50%_30%,#000_35%,transparent)]" />
        {[
          ['top-[10%] left-[10%] size-10 md:size-14 text-pale-4', '22s'],
          ['top-[52%] left-[82%] size-12 md:size-16 text-cta/30', '28s'],
          ['top-[68%] left-[5%] size-8 md:size-10 text-blue-soft/45', '18s'],
        ].map(([p, dur]) => (
          <StarGlyph key={p} className={`page-star absolute ${p}`} style={vars({ '--dur': dur })} />
        ))}
      </div>
      <div className="wrap">
        <SectionTitle as="h1" parts={typeof title === 'string' ? [title] : title} />
        {lede && (
          <p className="lede load-rise" style={vars({ '--d': '250ms' })}>
            {lede}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
