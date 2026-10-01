import type { Metadata } from 'next'

import { NextTrain } from '@/components/services/NextTrain'
import { RouteMap } from '@/components/services/RouteMap'
import { ArrowRight } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { copy, langAttr } from '@/i18n/config'
import { date, time } from '@/i18n/format'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getShuttle } from '@/lib/cms'
import { clock, dayRange, dhakaDate, type Direction, type Timetable } from '@/lib/services/shuttle'

export const revalidate = 3600

const T = copy(
  {
    meta: {
      title: 'শাটল ট্রেনের সময়সূচি',
      description: 'চট্টগ্রাম বিশ্ববিদ্যালয়ের শাটল ট্রেন: পরের ট্রেন কখন, পুরো সময়সূচি, স্টেশন আর বন্ধের দিন।',
    },
    title: ['শাটল ট্রেনের', 'সময়সূচি'],
    lede: 'পরের ট্রেন কখন ছাড়বে, কত মিনিট বাকি, আর পুরো সপ্তাহের সময়সূচি এক জায়গায়।',
    notice: 'নোটিশ',
    timetable: ['পুরো', 'সময়সূচি'],
    heading: { 'to-campus': 'শহর থেকে ক্যাম্পাস', 'to-city': 'ক্যাম্পাস থেকে শহর' } as Record<Direction, string>,
    leaves: 'ছাড়ে',
    days: 'যেদিন চলে',
    none: 'এই দিকে কোনো ট্রেন লেখা নেই।',
    closures: 'সামনে শাটল বন্ধ',
    effective: (d: string) => `${d} থেকে কার্যকর।`,
    source: (s: string) => `সময়ের উৎস: ${s}।`,
    verify: 'ট্রেন দেরিতে ছাড়তে বা বাতিল হতে পারে। জরুরি হলে বিশ্ববিদ্যালয়ের পরিবহন দপ্তরের নোটিশ মিলিয়ে নিন।',
    empty: {
      title: 'সময়সূচি শীঘ্রই আসছে',
      text: 'বিশ্ববিদ্যালয়ের পরিবহন দপ্তরের সর্বশেষ নোটিশ মিলিয়ে সময়সূচি এখানে দেওয়া হবে। ততদিন পরিবহন দপ্তরের নোটিশ দেখুন।',
    },
    problem: 'শাটলে সমস্যা? ডেস্কে জানান',
  },
  {
    meta: {
      title: 'Shuttle train timetable',
      description: 'The University of Chittagong shuttle train: when the next train leaves, the full timetable, the stations and the days without service.',
    },
    title: ['Shuttle train', 'timetable'],
    lede: 'When the next train leaves, how many minutes are left, and the whole week’s timetable in one place.',
    notice: 'Notice',
    timetable: ['Full', 'timetable'],
    heading: { 'to-campus': 'City to campus', 'to-city': 'Campus to city' } as Record<Direction, string>,
    leaves: 'Leaves',
    days: 'Runs on',
    none: 'No trains are listed in this direction.',
    closures: 'Coming days without a shuttle',
    effective: (d: string) => `In effect from ${d}.`,
    source: (s: string) => `Source of the times: ${s}.`,
    verify: 'Trains can leave late or be cancelled. If it matters, check the university transport office’s notice.',
    empty: {
      title: 'The timetable is coming soon',
      text: 'The timetable will appear here once it has been checked against the university transport office’s latest notice. Until then, please check the transport office’s notice.',
    },
    problem: 'Shuttle problem? Report it',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/shuttle', T[lang].meta)
}

export default async function ShuttlePage() {
  const lang = await getLang()
  const t = T[lang]
  const shuttle = await getShuttle(lang)
  const header = <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} />

  if (!shuttle.published || !shuttle.trips?.length) {
    return (
      <>
        {header}
        <div className="wrap max-w-2xl py-14 md:py-20">
          <div className="rounded-3xl bg-white p-8 text-center shadow-[0_4px_24px_rgb(11_31_51/0.06)] md:p-10">
            <h2 className="text-[1.4rem] font-bold text-ink">{t.empty.title}</h2>
            <p className="mt-3 leading-relaxed text-muted">{t.empty.text}</p>
          </div>
          <Problem label={t.problem} />
        </div>
      </>
    )
  }

  const timetable: Timetable = {
    trips: shuttle.trips.map((trip) => ({ direction: trip.direction, time: trip.time, days: trip.days ?? [], note: trip.note })),
    closures: (shuttle.closures ?? []).map((c) => ({ from: c.from, to: c.to, reason: c.reason })),
  }
  const stations = shuttle.stations ?? []
  const journeyMinutes = stations.at(-1)?.minutes ?? null
  const ends = stations.length > 1 ? { city: stations[0].name, campus: stations.at(-1)!.name } : undefined
  const today = dhakaDate(new Date().toISOString())
  const closures = timetable.closures.filter((c) => dhakaDate(c.to) >= today)

  return (
    <>
      {header}
      <div className="wrap max-w-5xl py-12 md:py-16">
        {shuttle.notice && (
          <p role="note" className="mb-6 rounded-2xl border border-pale-4 bg-pale p-4 leading-relaxed text-ink">
            <span className="font-bold">{t.notice}: </span>
            <span lang={langAttr(lang, shuttle.notice)}>{shuttle.notice}</span>
          </p>
        )}

        <NextTrain timetable={timetable} journeyMinutes={journeyMinutes} ends={ends} />

        {stations.length > 1 && (
          <div className="mt-8">
            <RouteMap stations={stations} lang={lang} />
          </div>
        )}

        <section aria-labelledby="timetable-title" className="mt-20" id="timetable">
          <SectionTitle id="timetable-title" parts={[t.timetable[0], { hl: t.timetable[1] }]} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {(['to-campus', 'to-city'] as Direction[]).map((direction) => {
              const trips = timetable.trips.filter((trip) => trip.direction === direction).sort((a, b) => a.time.localeCompare(b.time))
              return (
                <div key={direction} className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_24px_rgb(11_31_51/0.06)]">
                  <table className="w-full text-left">
                    <caption className="px-6 pb-2 pt-6 text-left text-[1.1rem] font-bold text-ink">{t.heading[direction]}</caption>
                    <thead className="text-[0.88rem] text-subtle">
                      <tr className="border-b border-border">
                        <th scope="col" className="px-6 py-2 font-semibold">{t.leaves}</th>
                        <th scope="col" className="px-6 py-2 font-semibold">{t.days}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-6 py-4 text-muted">{t.none}</td>
                        </tr>
                      )}
                      {trips.map((trip, i) => (
                        <tr key={`${trip.time}-${i}`} className="border-b border-border last:border-0">
                          <td className="whitespace-nowrap px-6 py-3 text-[1.05rem] font-bold text-ink">{time(lang, clock(trip.time))}</td>
                          <td className="px-6 py-3 text-ink/85">
                            {dayRange(trip.days, lang)}
                            {trip.note && (
                              <span lang={langAttr(lang, trip.note)} className="block text-[0.88rem] text-subtle">
                                {trip.note}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </div>
        </section>

        {closures.length > 0 && (
          <section aria-labelledby="closures-title" className="mt-10 rounded-3xl bg-pale p-6 md:p-8">
            <h2 id="closures-title" className="text-[1.15rem] font-bold text-ink">
              {t.closures}
            </h2>
            <ul className="mt-4 grid gap-2">
              {closures.map((c, i) => {
                const from = date(lang, c.from)
                const to = date(lang, c.to)
                return (
                  <li key={i} className="leading-relaxed text-ink/85">
                    <span className="font-semibold text-ink">{from === to ? from : `${from} – ${to}`}</span>
                    {c.reason && (
                      <>
                        {': '}
                        <span lang={langAttr(lang, c.reason)}>{c.reason}</span>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <div className="mt-10 grid gap-1 text-center text-[0.92rem] text-subtle">
          {shuttle.effectiveFrom && <p>{t.effective(date(lang, shuttle.effectiveFrom))}</p>}
          {shuttle.source && <p lang={langAttr(lang, shuttle.source)}>{t.source(shuttle.source)}</p>}
          <p>{t.verify}</p>
        </div>
        <Problem label={t.problem} />
      </div>
    </>
  )
}

function Problem({ label }: { label: string }) {
  return (
    <div className="mt-10 flex justify-center">
      <Link href="/services/issues/report" className="btn btn-outline-blue">
        {label}
        <ArrowRight />
      </Link>
    </div>
  )
}
