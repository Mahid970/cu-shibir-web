import type { Metadata } from 'next'

import { ArrowRight } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getBloodStats } from '@/lib/cms'

export const revalidate = 3600

const T = copy(
  {
    meta: {
      title: 'রক্তদাতা নেটওয়ার্ক',
      description: 'চবি শিক্ষার্থীদের রক্তদাতা নেটওয়ার্ক: জরুরি প্রয়োজনে রক্তের অনুরোধ পাঠান, অথবা দাতা হিসেবে নিবন্ধন করুন। কারও নম্বর প্রকাশ করা হয় না।',
    },
    title: ['রক্তদাতা', 'নেটওয়ার্ক'],
    lede: 'রক্ত দরকার হলে অনুরোধ পাঠান; সমন্বয়কেরা মিলে যাওয়া দাতাদের ফোন করবেন। দাতাদের নম্বর কোথাও প্রকাশ হয় না, আর রক্ত দেবেন কি না সে সিদ্ধান্ত দাতার।',
    need: 'রক্ত দরকার',
    give: 'দাতা হোন',
    how: ['কীভাবে', 'কাজ করে'],
    steps: [
      { title: 'অনুরোধ আসে', text: 'রোগীর গ্রুপ, হাসপাতাল আর সময় জানিয়ে অনুরোধ পাঠান।' },
      { title: 'সমন্বয়কেরা খোঁজেন', text: 'যাঁদের রক্ত মিলবে আর শেষ রক্তদানের পর ১২০ দিন পেরিয়েছে, শুধু তাঁদের ফোন করা হয়।' },
      { title: 'দাতা রাজি হলে যোগাযোগ', text: 'দাতা রাজি হলে তাঁকেই আপনার নম্বর দেওয়া হয়। দাতার নম্বর আপনার কাছে যায় না।' },
    ],
    list: ['তালিকায় কতজন', 'দাতা'],
    listLede: 'যাঁরা এখন ডাক পেলে রক্ত দিতে রাজি, গ্রুপ অনুযায়ী। শুধু সংখ্যা, কারও নাম নয়।',
    donors: (n: string) => `${n} জন দাতা`,
    ready: (n: string) => `আজ দিতে পারেন ${n} জন`,
    empty: 'তালিকা এখনো শুরু হয়নি। প্রথম দাতাদের একজন হোন।',
    already: ['আগেই দাতা?', 'নিজের তথ্য বদলান', 'রক্তদানের তারিখ লিখুন, বিরতি নিন বা নাম সরান।'],
  },
  {
    meta: {
      title: 'Blood donor network',
      description: 'The blood donor network of University of Chittagong students: send a request when blood is needed, or register as a donor. Nobody’s number is published.',
    },
    title: ['Blood donor', 'network'],
    lede: 'When blood is needed, send a request and the coordinators will call matching donors. Donors’ numbers are never published, and whether to give is always the donor’s decision.',
    need: 'I need blood',
    give: 'Become a donor',
    how: ['How it', 'works'],
    steps: [
      { title: 'A request comes in', text: 'Send the patient’s blood group, the hospital and when the blood is needed.' },
      { title: 'Coordinators search', text: 'Only donors whose blood matches and who last gave more than 120 days ago are called.' },
      { title: 'The donor agrees, then you talk', text: 'If a donor agrees, they are given your number. The donor’s number is never passed to you.' },
    ],
    list: ['Donors on', 'the list'],
    listLede: 'People ready to give when called, by blood group. Numbers only, never names.',
    donors: (n: string) => `${n} ${n === '1' ? 'donor' : 'donors'}`,
    ready: (n: string) => `${n} can give today`,
    empty: 'The list has not started yet. Be one of the first donors.',
    already: ['Already a donor?', 'Update your details', 'note a donation, take a break or leave the list.'],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/blood', T[lang].meta)
}

export default async function BloodPage() {
  const lang = await getLang()
  const t = T[lang]
  const stats = await getBloodStats()
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede}>
        <div className="load-rise mt-8 flex flex-wrap justify-center gap-3" style={vars({ '--d': '350ms' })}>
          <Link href="/services/blood/request" className="btn btn-cta">
            {t.need}
            <ArrowRight />
          </Link>
          <Link href="/services/blood/donate" className="btn btn-outline-blue">
            {t.give}
          </Link>
        </div>
      </PageHeader>

      <div className="wrap py-12 md:py-16">
        <section aria-labelledby="how-title">
          <SectionTitle id="how-title" parts={[t.how[0], { hl: t.how[1] }]} />
          <ol className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <li key={s.title} data-reveal="fade" style={vars({ '--d': `${i * 100}ms` })} className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_31_51/0.06)] md:p-7">
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-[#fbeaea] text-[1.1rem] font-bold text-crimson">
                  {num(lang, i + 1)}
                </span>
                <h3 className="mt-4 text-[1.15rem] font-bold text-ink">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="list-title" className="mt-20" id="donors">
          <SectionTitle id="list-title" parts={[t.list[0], { hl: t.list[1] }]} />
          <p className="lede">{t.listLede}</p>
          {stats.total === 0 ? (
            <p className="mx-auto mt-10 max-w-xl rounded-3xl bg-white p-8 text-center text-[1.05rem] text-muted shadow-[0_4px_24px_rgb(11_31_51/0.06)]">{t.empty}</p>
          ) : (
            <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.groups.map((g) => (
                <li key={g.group} className="rounded-3xl bg-white p-5 text-center shadow-[0_4px_24px_rgb(11_31_51/0.06)]">
                  <p className="font-[family-name:var(--font-en)] text-[2rem] font-bold leading-none text-crimson">{g.group}</p>
                  <p className="mt-3 font-semibold text-ink">{t.donors(num(lang, g.donors))}</p>
                  <p className="mt-0.5 text-[0.88rem] text-subtle">{t.ready(num(lang, g.ready))}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-14 text-center text-muted">
          {t.already[0]}{' '}
          <Link href="/services/blood/donor" className="font-semibold text-primary underline">
            {t.already[1]}
          </Link>
          : {t.already[2]}
        </p>
      </div>
    </>
  )
}
