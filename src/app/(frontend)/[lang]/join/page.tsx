import type { Metadata } from 'next'

import { ContactCard } from '@/components/home/ContactCard'
import { JoinSteps } from '@/components/home/JoinSteps'
import { ArrowRight } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { copy, type TitleCopy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getSiteSettings } from '@/lib/cms'
import { SITE } from '@/lib/site'

type Action = { href: string; title: string; text: string; cta: string; primary: boolean }

const T = copy<{ meta: Metadata; title: TitleCopy; lede: string; actions: Action[] }>(
  {
    meta: { title: 'যুক্ত হোন', description: 'চবি ছাত্রশিবিরের সাথে যুক্ত হওয়ার উপায়, সমর্থক ফরম ও যোগাযোগ।' },
    title: [{ hl: 'সমর্থক' }, 'হোন'],
    lede: 'শিক্ষার্থীদের অধিকার আর সুন্দর ক্যাম্পাসের কাজে পাশে থাকো। শুরু করার উপায় নিচে।',
    actions: [
      { href: '/join/supporter', title: 'সমর্থক ফরম', text: 'দুই মিনিটে পূরণ করো। তোমার বিভাগ বা হলের দায়িত্বশীল যোগাযোগ করবেন।', cta: 'ফরম পূরণ করো', primary: true },
      { href: '/join/feedback', title: 'এহতেসাব ও পরামর্শ', text: 'ভুল ধরিয়ে দাও, পরামর্শ দাও বা সমস্যা জানাও। নাম ছাড়াও পাঠানো যায়।', cta: 'লিখে পাঠাও', primary: false },
    ],
  },
  {
    meta: { title: 'Get involved', description: 'Ways to get involved with CU Chhatrashibir: the supporter form and how to contact us.' },
    title: ['Become a', { hl: 'supporter' }],
    lede: 'Stand with us for students’ rights and a better campus. Here is how to start.',
    actions: [
      { href: '/join/supporter', title: 'Supporter form', text: 'Takes two minutes. The leader in your department or hall will get in touch.', cta: 'Fill in the form', primary: true },
      { href: '/join/feedback', title: 'Ehtesab and advice', text: 'Point out a mistake, give advice or report a problem. You can send it without your name.', cta: 'Write to us', primary: false },
    ],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/join', T[lang].meta)
}

export default async function JoinPage() {
  const lang = await getLang()
  const t = T[lang]
  const settings = await getSiteSettings(lang)
  return (
    <>
      <PageHeader title={t.title} lede={t.lede}>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {t.actions.map((a, i) => (
            <li
              key={a.href}
              className="load-up group relative flex flex-col items-start gap-2 rounded-3xl bg-white p-6 text-left shadow-[0_4px_24px_rgb(11_15_46/0.06)] transition-shadow hover:shadow-[0_18px_40px_rgb(11_15_46/0.12)] md:p-7"
              style={vars({ '--d': `${350 + i * 120}ms` })}
            >
              <h2 className="text-[1.3rem] font-bold text-ink">
                <Link href={a.href} className="after:absolute after:inset-0">
                  {a.title}
                </Link>
              </h2>
              <p className="text-[0.98rem] leading-relaxed text-muted">{a.text}</p>
              <span className={`btn btn-sm mt-3 ${a.primary ? 'btn-yellow' : 'btn-outline-blue'}`}>
                {a.cta}
                <ArrowRight />
              </span>
            </li>
          ))}
        </ul>
      </PageHeader>
      <JoinSteps />
      <div className="pt-16 md:pt-20">
        <ContactCard email={settings.contact?.email || SITE.email} facebook={settings.socials?.facebook} />
      </div>
    </>
  )
}
