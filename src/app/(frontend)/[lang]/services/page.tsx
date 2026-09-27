import type { Metadata } from 'next'

import { ServiceCards } from '@/components/home/Services'
import { ArrowRight } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { copy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    meta: {
      title: 'শিক্ষার্থী সেবা',
      description: 'চবি শিক্ষার্থীদের জন্য শিক্ষাবৃত্তি ও চিকিৎসা সহায়তা, ছাত্র সমস্যা ডেস্ক, ক্যাম্পাস গাইড এবং আসন্ন সেবাসমূহ।',
    },
    title: ['শিক্ষার্থী', 'সেবা'],
    lede: 'চবি শিক্ষার্থীদের প্রতিদিনের কাজে লাগে এমন সেবা, এক জায়গায়। যেগুলো চালু আছে সেগুলো এখনই ব্যবহার করা যাবে।',
    problem: 'হল, পরিবহন বা নিরাপত্তা নিয়ে সমস্যা?',
    problemText: 'ছাত্র সমস্যা ডেস্কে জানাও, চাইলে নাম ছাড়াই। ট্র্যাকিং কোড দিয়ে অগ্রগতি দেখতে পারবে।',
    report: 'সমস্যা জানাও',
  },
  {
    meta: {
      title: 'Student services',
      description: 'Scholarship and medical aid, the student issues desk, a campus guide and more services for students of the University of Chittagong.',
    },
    title: ['Student', 'services'],
    lede: 'Services for the everyday needs of CU students, in one place. The ones marked available can be used right now.',
    problem: 'A problem with your hall, transport or safety?',
    problemText: 'Tell the student issues desk, anonymously if you like, and follow the progress with a tracking code.',
    report: 'Report a problem',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services', T[lang].meta)
}

export default async function ServicesPage() {
  const t = T[await getLang()]
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} />
      <div className="wrap py-14 md:py-20">
        <ServiceCards />
        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-[0_4px_24px_rgb(11_15_46/0.06)] md:p-10">
          <h2 className="text-[1.5rem] font-bold text-ink md:text-[1.8rem]">{t.problem}</h2>
          <p className="max-w-xl text-muted">{t.problemText}</p>
          <Link href="/services/issues/report" className="btn btn-yellow">
            {t.report}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </>
  )
}
