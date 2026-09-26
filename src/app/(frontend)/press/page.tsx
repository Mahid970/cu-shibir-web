import type { Metadata } from 'next'

import { ExternalLink } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { formatDate, toBnDigits } from '@/lib/bn'
import { getAllPress } from '@/lib/cms'
import type { PressCoverage } from '@/payload-types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'মিডিয়ায় আমরা',
  description: 'জাতীয় সংবাদমাধ্যমে চবি ছাত্রশিবির ও চাকসু নিয়ে প্রকাশিত সংবাদের লিংক।',
  alternates: { canonical: '/press' },
}

/** Group by year (Dhaka time) so the list reads like an archive. */
function byYear(items: PressCoverage[]) {
  const groups = new Map<string, PressCoverage[]>()
  for (const item of items) {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date(item.publishedAt))
    groups.set(year, [...(groups.get(year) ?? []), item])
  }
  return [...groups.entries()]
}

export default async function PressPage() {
  const press = await getAllPress()
  const outlets = new Set(press.map((p) => p.outlet)).size
  return (
    <>
      <PageHeader
        title={['মিডিয়ায়', { hl: 'আমরা' }]}
        lede={`জাতীয় সংবাদমাধ্যমে আমাদের নিয়ে ${toBnDigits(press.length)}টি প্রতিবেদন, ${toBnDigits(outlets)}টি সংবাদমাধ্যমে। প্রতিটি লিংক মূল প্রতিবেদনে নিয়ে যাবে।`}
      />
      <div className="wrap max-w-4xl py-12 md:py-16">
        {byYear(press).map(([year, items]) => (
          <section key={year} aria-labelledby={`y${year}`} className="mb-12 last:mb-0">
            <h2 id={`y${year}`} className="mb-5 font-[family-name:var(--font-en)] text-[1.6rem] font-bold text-ink">
              {toBnDigits(year)}
            </h2>
            <ul className="grid gap-3">
              {items.map((item, i) => (
                <li key={item.id} data-reveal="fade" style={vars({ '--d': `${(i % 4) * 70}ms` })}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgb(11_15_46/0.06)] transition-shadow hover:shadow-[0_14px_34px_rgb(11_15_46/0.1)] md:p-6"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-[0.88rem]">
                        <span className="rounded bg-[image:var(--gradient)] px-2 py-0.5 font-semibold text-white">{item.outlet}</span>
                        <time dateTime={item.publishedAt} className="text-subtle">
                          {formatDate(item.publishedAt)}
                        </time>
                      </span>
                      <span className="mt-2 block text-[1.1rem] font-semibold leading-snug text-ink group-hover:text-primary md:text-[1.2rem]">
                        {item.headline}
                      </span>
                    </span>
                    <ExternalLink className="mt-1 size-5 shrink-0 text-subtle group-hover:text-primary" />
                    <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
