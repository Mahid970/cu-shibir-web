import type { ReactNode } from 'react'

import { CheckCircle, Lock } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import type { TitlePart } from '@/components/ui/SectionTitle'

/** Form pages: header, the form in a white card, and a side panel explaining how the data is handled. */
export function FormLayout({
  title,
  lede,
  points,
  children,
  aside,
}: {
  title: TitlePart[]
  lede: string
  points: string[]
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <>
      <PageHeader title={title} lede={lede} />
      <div className="wrap grid max-w-6xl gap-6 py-12 md:py-16 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-8">
        <div className="card p-5 sm:p-8 md:p-10">{children}</div>
        <aside className="grid gap-4 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-night p-6 text-white md:p-7">
            <p className="flex items-center gap-2 text-[1.1rem] font-bold">
              <Lock className="size-5 text-mint" />
              আপনার তথ্য নিরাপদ
            </p>
            <ul className="mt-4 grid gap-3 text-[0.95rem] leading-relaxed text-white/80">
              {points.map((p) => (
                <li key={p} className="flex gap-2.5">
                  <CheckCircle className="mt-1 size-4 shrink-0 text-mint" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          {aside}
        </aside>
      </div>
    </>
  )
}
