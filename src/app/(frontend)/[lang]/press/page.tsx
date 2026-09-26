import type { Metadata } from 'next'

import { ExternalLink } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { copy, langAttr } from '@/i18n/config'
import { date, num } from '@/i18n/format'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getAllPress } from '@/lib/cms'
import { outletName } from '@/lib/press'
import type { PressCoverage } from '@/payload-types'

export const revalidate = 3600

const T = copy(
  {
    meta: { title: 'মিডিয়ায় আমরা', description: 'জাতীয় সংবাদমাধ্যমে চবি ছাত্রশিবির ও চাকসু নিয়ে প্রকাশিত সংবাদের লিংক।' },
    title: ['মিডিয়ায়', 'আমরা'],
    lede: (n: string, m: string) => `জাতীয় সংবাদমাধ্যমে আমাদের নিয়ে ${n}টি প্রতিবেদন, ${m}টি সংবাদমাধ্যমে। প্রতিটি লিংক মূল প্রতিবেদনে নিয়ে যাবে।`,
    newTab: '(নতুন ট্যাবে খুলবে)',
  },
  {
    meta: { title: 'In the media', description: 'Links to national news coverage of CU Chhatrashibir and CUCSU.' },
    title: ['In the', 'media'],
    lede: (n: string, m: string) =>
      `${n} reports about us in ${m} national news outlets. Each link opens the original report, most of them in Bangla.`,
    newTab: '(opens in a new tab)',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/press', T[lang].meta)
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
  const lang = await getLang()
  const t = T[lang]
  const press = await getAllPress()
  const outlets = new Set(press.map((p) => p.outlet)).size
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede(num(lang, press.length), num(lang, outlets))} />
      <div className="wrap max-w-4xl py-12 md:py-16">
        {byYear(press).map(([year, items]) => (
          <section key={year} aria-labelledby={`y${year}`} className="mb-12 last:mb-0">
            <h2 id={`y${year}`} className="mb-5 font-[family-name:var(--font-en)] text-[1.6rem] font-bold text-ink">
              {num(lang, year)}
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
                        <span className="rounded bg-[image:var(--gradient)] px-2 py-0.5 font-semibold text-white">{outletName(item.outlet, lang)}</span>
                        <time dateTime={item.publishedAt} className="text-subtle">
                          {date(lang, item.publishedAt)}
                        </time>
                      </span>
                      <span lang={langAttr(lang, item.headline)} className="mt-2 block text-[1.1rem] font-semibold leading-snug text-ink group-hover:text-primary md:text-[1.2rem]">
                        {item.headline}
                      </span>
                    </span>
                    <ExternalLink className="mt-1 size-5 shrink-0 text-subtle group-hover:text-primary" />
                    <span className="sr-only">{t.newTab}</span>
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
