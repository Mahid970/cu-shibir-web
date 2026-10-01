import type { ReactNode } from 'react'

import { SectionTitle, vars, type TitlePart } from './SectionTitle'

/** Inner-page header: a thin line grid fading out over a pale wash, and a centred title. */
export function PageHeader({ title, lede, children }: { title: string | TitlePart[]; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="hero-wash relative isolate overflow-hidden pb-14 pt-12 md:pb-20 md:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(80%_90%_at_50%_30%,#000_35%,transparent)]" />
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
