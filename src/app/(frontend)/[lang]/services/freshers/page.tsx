import type { Metadata } from 'next'

import { CampusMap } from '@/components/services/CampusMap'
import { ArrowRight, CheckCircle, ExternalLink } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { copy, langAttr } from '@/i18n/config'
import { num } from '@/i18n/format'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getFreshers } from '@/lib/cms'
import { PLACE_CATEGORIES } from '@/lib/services/places'

export const revalidate = 3600

const T = copy(
  {
    meta: {
      title: 'নবীন গাইড ও ক্যাম্পাস ম্যাপ',
      description: 'চবিতে প্রথম দিনগুলোর জন্য: কী কী করতে হবে, জরুরি নম্বর, আর অনুষদ, হল, লাইব্রেরি, চিকিৎসা কেন্দ্র ও মসজিদ কোথায়।',
    },
    title: ['নবীন', 'গাইড'],
    lede: 'চট্টগ্রাম বিশ্ববিদ্যালয়ে স্বাগতম। প্রথম দিনগুলো সহজ করতে যা জানা দরকার, আর ক্যাম্পাসে কোথায় কী।',
    first: ['প্রথম', 'সপ্তাহে'],
    checklist: [
      { text: 'বিভাগে গিয়ে ক্লাস রুটিন আর কোর্সের তালিকা জেনে নাও। সিনিয়রদের সাথে পরিচিত হও।' },
      { text: 'শাটলের সময় দেখে নাও; প্রথম দিন একটু আগে বের হও।', href: '/services/shuttle', link: 'শাটলের সময়সূচি' },
      { text: 'নিচের ম্যাপে বিভাগ, লাইব্রেরি, চিকিৎসা কেন্দ্র আর মসজিদ চিনে রাখো।', href: '#map', link: 'ক্যাম্পাস ম্যাপ' },
      { text: 'হলের আসনের নোটিশ হল অফিস থেকে জেনে নাও। আবাসন বা অন্য সমস্যায় আমাদের জানাও।', href: '/services/issues', link: 'ছাত্র সমস্যা ডেস্ক' },
      { text: 'টাকার জন্য পড়াশোনা বা চিকিৎসা আটকে গেলে সহায়তার আবেদন করো।', href: '/services/assistance', link: 'শিক্ষাবৃত্তি ও সহায়তা' },
      { text: 'পরীক্ষার আগে আগের বছরের প্রশ্ন দেখে নাও।', href: '/services/questions', link: 'প্রশ্ন ব্যাংক' },
      { text: 'নিজের রক্তের গ্রুপ জেনে রাখো, পারলে রক্তদাতা হও।', href: '/services/blood', link: 'রক্তদাতা নেটওয়ার্ক' },
    ],
    emergency: ['জরুরি', 'যোগাযোগ'],
    national: { name: 'জাতীয় জরুরি সেবা', note: 'পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স' },
    call: (n: string) => `${n} নম্বরে ফোন করুন`,
    moreSoon: 'ক্যাম্পাসের নম্বরগুলো (প্রক্টর অফিস, চিকিৎসা কেন্দ্র, নিরাপত্তা দপ্তর) যাচাই করে শীঘ্রই এখানে দেওয়া হবে।',
    map: ['ক্যাম্পাস', 'ম্যাপ'],
    directions: 'দিকনির্দেশনা',
    osm: 'অবস্থান: © OpenStreetMap অবদানকারীরা',
    guide: 'সব বিভাগ ও হলের তালিকা',
  },
  {
    meta: {
      title: 'Freshers’ guide and campus map',
      description: 'For your first days at the University of Chittagong: what to do, emergency numbers, and where the faculties, halls, library, medical centre and mosques are.',
    },
    title: ['Freshers’', 'guide'],
    lede: 'Welcome to the University of Chittagong. What you need to know to make your first days easier, and where everything is on campus.',
    first: ['Your first', 'week'],
    checklist: [
      { text: 'Go to your department for the class routine and the list of courses. Get to know your seniors.' },
      { text: 'Check the shuttle times, and leave a little early on your first day.', href: '/services/shuttle', link: 'Shuttle timetable' },
      { text: 'Find your department, the library, the medical centre and a mosque on the map below.', href: '#map', link: 'Campus map' },
      { text: 'Ask the hall office about seat notices. Tell us about housing or any other problem.', href: '/services/issues', link: 'Student issues desk' },
      { text: 'If money is stopping your studies or treatment, apply for support.', href: '/services/assistance', link: 'Scholarships and support' },
      { text: 'Look at past papers before your exams.', href: '/services/questions', link: 'Question bank' },
      { text: 'Know your blood group, and become a donor if you can.', href: '/services/blood', link: 'Blood donor network' },
    ],
    emergency: ['Emergency', 'contacts'],
    national: { name: 'National emergency service', note: 'Police, fire service, ambulance' },
    call: (n: string) => `Call ${n}`,
    moreSoon: 'Campus numbers (the proctor’s office, the medical centre, the security office) will be added here once they have been checked.',
    map: ['Campus', 'map'],
    directions: 'Directions',
    osm: 'Locations: © OpenStreetMap contributors',
    guide: 'All departments and halls',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/freshers', T[lang].meta)
}

export default async function FreshersPage() {
  const lang = await getLang()
  const t = T[lang]
  const { contacts, places } = await getFreshers(lang)
  const contactCards = [
    { name: t.national.name, phone: '999', note: t.national.note },
    ...contacts.map((c) => ({ name: c.name, phone: c.phone, note: c.note })),
  ]

  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} />
      <div className="wrap py-12 md:py-16">
        <section aria-labelledby="first-title">
          <SectionTitle id="first-title" parts={[t.first[0], { hl: t.first[1] }]} />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-3">
            {t.checklist.map((item, i) => (
              <li
                key={item.text}
                data-reveal="fade"
                style={vars({ '--d': `${(i % 4) * 80}ms` })}
                className="flex flex-col gap-2 rounded-2xl bg-white px-5 py-4 shadow-[0_4px_24px_rgb(11_31_51/0.06)] sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <span className="flex gap-3 leading-relaxed text-ink">
                  <CheckCircle className="mt-1 size-5 shrink-0 text-blue" />
                  {item.text}
                </span>
                {item.href && (
                  <Link href={item.href} className="inline-flex shrink-0 items-center gap-1.5 pl-8 font-semibold text-primary sm:pl-0">
                    {item.link}
                    <ArrowRight className="size-4" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="emergency-title" className="mt-20" id="emergency">
          <SectionTitle id="emergency-title" parts={[t.emergency[0], { hl: t.emergency[1] }]} />
          <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-4">
            {contactCards.map((c) => (
              <li key={`${c.name}-${c.phone}`} className="w-full rounded-3xl bg-night p-6 text-white sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]">
                <p lang={langAttr(lang, c.name)} className="font-semibold text-white/80">
                  {c.name}
                </p>
                <a href={`tel:${c.phone.replace(/[^+0-9]/g, '')}`} aria-label={t.call(c.phone)} className="mt-2 block text-[2rem] font-bold leading-none text-blue-soft">
                  {num(lang, c.phone)}
                </a>
                {c.note && (
                  <p lang={langAttr(lang, c.note)} className="mt-2 text-[0.92rem] text-white/65">
                    {c.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
          {contacts.length === 0 && <p className="mx-auto mt-5 max-w-2xl text-center text-[0.95rem] text-subtle">{t.moreSoon}</p>}
        </section>

        {places.length > 0 && (
          <section aria-labelledby="map-title" className="mt-20 scroll-mt-24" id="map">
            <SectionTitle id="map-title" parts={[t.map[0], { hl: t.map[1] }]} />
            <div className="mx-auto mt-10 max-w-5xl">
              <CampusMap places={places} />
            </div>
            <div className="mx-auto mt-6 grid max-w-5xl gap-6 md:grid-cols-2">
              {PLACE_CATEGORIES.map((category) => {
                const here = places.filter((p) => p.category === category.value).sort((a, b) => a.name.localeCompare(b.name, lang))
                if (!here.length) return null
                return (
                  <section key={category.value} aria-labelledby={`cat-${category.value}`} className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_31_51/0.06)]">
                    <h3 id={`cat-${category.value}`} className="text-[1.1rem] font-bold text-ink">
                      {category.label[lang]}
                    </h3>
                    <ul className="mt-3 divide-y divide-border">
                      {here.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-4 py-2.5">
                          <span lang={langAttr(lang, p.name)} className="text-ink">
                            {p.name}
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1 text-[0.9rem] font-semibold text-primary"
                          >
                            {t.directions}
                            <ExternalLink className="size-3.5" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
            <p className="mt-5 text-center text-[0.85rem] text-subtle">{t.osm}</p>
          </section>
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/services/campus" className="btn btn-outline-blue">
            {t.guide}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </>
  )
}
