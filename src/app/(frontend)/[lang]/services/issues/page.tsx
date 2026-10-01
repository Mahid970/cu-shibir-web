import type { Metadata } from 'next'

import { IssueFigures } from '@/components/services/IssueFigures'
import { ArrowRight, Search } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getIssueStats } from '@/lib/cms'

export const revalidate = 3600

const T = copy(
  {
    meta: {
      title: 'ছাত্র সমস্যা ডেস্ক',
      description: 'হল, শাটল, খাবার, নিরাপত্তা বা পড়াশোনার সমস্যা জানান, ট্র্যাকিং কোড দিয়ে অগ্রগতি দেখুন, আর দেখুন কতগুলো সমস্যার সমাধান হলো।',
    },
    title: ['ছাত্র সমস্যা', 'ডেস্ক'],
    lede: 'হল, শাটল, খাবার, নিরাপত্তা বা পড়াশোনার সমস্যা আমাদের জানান। আমরা খোঁজ নিই, দায়িত্বপ্রাপ্তদের কাছে তুলি এবং কতগুলোর সমাধান হলো তা সবার সামনে রাখি।',
    report: 'সমস্যা জানান',
    track: 'অবস্থা দেখুন',
    how: ['কীভাবে', 'কাজ করে'],
    steps: [
      { title: 'আপনি জানান', text: 'সমস্যা, জায়গা আর বিস্তারিত লিখুন। চাইলে নাম ছাড়াই। একটি ট্র্যাকিং আইডি ও গোপন কোড পাবেন।' },
      { title: 'ডেস্ক খোঁজ নেয়', text: 'দায়িত্বপ্রাপ্তরা যাচাই করে সমস্যাটি হল প্রশাসন, প্রক্টর অফিস বা সংশ্লিষ্ট দপ্তরে তোলেন।' },
      { title: 'আপনি অগ্রগতি দেখেন', text: 'প্রতিটি ধাপ আর ডেস্কের বার্তা ট্র্যাকিং পাতায় দেখা যায়, সমাধান হওয়া পর্যন্ত।' },
    ],
    figures: ['প্রকাশ্য', 'হিসাব'],
    figuresLede: 'কতগুলো সমস্যা এসেছে আর কতগুলোর সমাধান হয়েছে, কারও নাম বা বিবরণ ছাড়া।',
  },
  {
    meta: {
      title: 'Student issues desk',
      description: 'Report a problem with halls, the shuttle, food, safety or studies, follow it with a tracking code, and see how many problems have been resolved.',
    },
    title: ['Student issues', 'desk'],
    lede: 'Tell us about problems with halls, the shuttle, food, safety or studies. We look into them, raise them with those responsible, and publish how many get resolved.',
    report: 'Report a problem',
    track: 'Check status',
    how: ['How it', 'works'],
    steps: [
      { title: 'You report it', text: 'Write down the problem, the place and the details, anonymously if you like. You get a tracking ID and a secret code.' },
      { title: 'The desk looks into it', text: 'The people on the desk check it and raise it with the hall administration, the proctor’s office or the office concerned.' },
      { title: 'You follow the progress', text: 'Every step and the desk’s messages appear on the tracking page until it is resolved.' },
    ],
    figures: ['Public', 'figures'],
    figuresLede: 'How many problems have come in and how many have been resolved, without anyone’s name or details.',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/issues', T[lang].meta)
}

export default async function IssuesDeskPage() {
  const lang = await getLang()
  const t = T[lang]
  const stats = await getIssueStats()
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede}>
        <div className="load-rise mt-8 flex flex-wrap justify-center gap-3" style={vars({ '--d': '350ms' })}>
          <Link href="/services/issues/report" className="btn btn-cta">
            {t.report}
            <ArrowRight />
          </Link>
          <Link href="/services/issues/status" className="btn btn-outline-blue">
            <Search className="size-5" />
            {t.track}
          </Link>
        </div>
      </PageHeader>

      <div className="wrap py-12 md:py-16">
        <section aria-labelledby="how-title">
          <SectionTitle id="how-title" parts={[t.how[0], { hl: t.how[1] }]} />
          <ol className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <li key={s.title} data-reveal="fade" style={vars({ '--d': `${i * 100}ms` })} className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_31_51/0.06)] md:p-7">
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-pale-2 text-[1.1rem] font-bold text-primary">
                  {num(lang, i + 1)}
                </span>
                <h3 className="mt-4 text-[1.15rem] font-bold text-ink">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="figures-title" className="mt-20" id="figures">
          <SectionTitle id="figures-title" parts={[t.figures[0], { hl: t.figures[1] }]} />
          <p className="lede">{t.figuresLede}</p>
          <div className="mt-10">
            <IssueFigures stats={stats} lang={lang} />
          </div>
        </section>
      </div>
    </>
  )
}
