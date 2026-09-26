import type { Metadata } from 'next'

import { FeedbackForm } from '@/components/forms/FeedbackForm'
import { FormLayout } from '@/components/forms/FormLayout'
import { copy } from '@/i18n/config'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getLeaders } from '@/lib/cms'
import { personName, personPosition } from '@/lib/people'
import { SITE } from '@/lib/site'

const T = copy(
  {
    meta: {
      title: 'এহতেসাব ও পরামর্শ',
      description: 'চবি ছাত্রশিবিরের দায়িত্বশীলদের পরামর্শ, এহতেসাব বা অভিযোগ পাঠান, চাইলে নাম ছাড়াই।',
    },
    title: ['এহতেসাব ও', 'পরামর্শ'],
    lede: 'ভুল ধরিয়ে দেওয়া, পরামর্শ দেওয়া বা সমস্যা জানানো, সবই আমাদের কাজকে ভালো করে। নাম ছাড়াও পাঠাতে পারেন।',
    points: [
      'বার্তা ও পরিচয় এনক্রিপ্ট করে রাখা হয়।',
      'নাম ছাড়া পাঠালে আপনার কোনো তথ্য সংরক্ষণ করা হয় না।',
      'শুধু দায়িত্বপ্রাপ্ত অ্যাডমিন বার্তা পড়েন এবং সংশ্লিষ্ট দায়িত্বশীলকে জানান।',
    ],
    email: 'ইমেইলেও লিখতে পারেন',
  },
  {
    meta: {
      title: 'Ehtesab and advice',
      description: 'Send advice, ehtesab (constructive criticism) or a complaint to the leaders of CU Chhatrashibir, with or without your name.',
    },
    title: ['Ehtesab and', 'advice'],
    lede: 'Pointing out mistakes, giving advice and reporting problems all make our work better. You can send it without your name.',
    points: [
      'Messages and identities are stored encrypted.',
      'If you send it without your name, nothing about you is stored.',
      'Only the admins responsible read messages and pass them on to the leader concerned.',
    ],
    email: 'You can also email us',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/join/feedback', T[lang].meta)
}

type Props = { searchParams: Promise<{ to?: string }> }

export default async function FeedbackPage({ searchParams }: Props) {
  const lang = await getLang()
  const t = T[lang]
  const [{ to }, leaders] = await Promise.all([searchParams, getLeaders(lang)])
  const people = leaders
    .filter((p) => p.slug)
    .map((p) => ({ value: p.slug!, label: `${personName(p.name, lang)} (${personPosition(p.position, lang)})` }))
  return (
    <FormLayout
      title={[t.title[0], { hl: t.title[1] }]}
      lede={t.lede}
      points={t.points}
      aside={
        <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
          <p className="font-bold text-ink">{t.email}</p>
          <a href={`mailto:${SITE.email}`} className="mt-2 block break-all font-semibold text-primary hover:underline">
            {SITE.email}
          </a>
        </div>
      }
    >
      <FeedbackForm people={people} to={people.some((p) => p.value === to) ? to : undefined} />
    </FormLayout>
  )
}
