import type { ReactNode } from 'react'

import { SectionTitle, vars, type TitlePart } from './SectionTitle'

/** Inner-page header: the home hero's grid paper and wash, a centred title with a highlight. */
export function PageHeader({ title, lede, children }: { title: string | TitlePart[]; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="hero-wash relative isolate overflow-hidden pb-14 pt-12 md:pb-20 md:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-paper absolute inset-0" />
        {['top-[8%] left-[12%]', 'top-[55%] left-[80%]', 'top-[70%] left-[6%]'].map((p) => (
          <div key={p} className={`absolute size-12 bg-pale-4/45 md:size-16 ${p}`} />
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
