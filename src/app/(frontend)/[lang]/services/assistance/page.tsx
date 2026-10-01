import type { Metadata } from 'next'

import { AssistanceForm } from '@/components/forms/AssistanceForm'
import { FormLayout } from '@/components/forms/FormLayout'
import { Search } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { localizeOptions, recentSessions } from '@/lib/campus'

export const revalidate = 86400

const T = copy(
  {
    meta: {
      title: 'শিক্ষাবৃত্তি ও চিকিৎসা সহায়তা',
      description: 'চবি শিক্ষার্থীদের জন্য শিক্ষাবৃত্তি ও চিকিৎসা সহায়তার অনলাইন আবেদন, ট্র্যাকিং কোড দিয়ে অগ্রগতি দেখার সুবিধাসহ।',
    },
    title: ['শিক্ষাবৃত্তি ও', 'সহায়তা'],
    lede: 'আর্থিক সংকটে পড়াশোনা বা চিকিৎসা যেন থেমে না যায়। আবেদন করুন, তারপর ট্র্যাকিং কোড দিয়ে অগ্রগতি দেখুন।',
    points: [
      'নাম, মোবাইল, রেজিস্ট্রেশন নম্বর ও বিবরণ এনক্রিপ্ট করে রাখা হয়।',
      'শুধু শিক্ষাবৃত্তি পর্যালোচক ও অ্যাডমিন আবেদন দেখতে পারেন।',
      'গোপন কোডটি আমাদের কাছেও সংরক্ষিত থাকে না, শুধু যাচাই করা যায়।',
    ],
    aside: { title: 'আগেই আবেদন করেছেন?', text: 'ট্র্যাকিং আইডি ও কোড দিয়ে অবস্থা দেখুন।', link: 'আবেদনের অবস্থা' },
  },
  {
    meta: {
      title: 'Scholarships and medical aid',
      description: 'Apply online for a scholarship or medical aid as a University of Chittagong student, and follow your application with a tracking code.',
    },
    title: ['Scholarships and', 'support'],
    lede: 'So that money troubles do not stop your studies or your treatment. Apply, then follow your application with a tracking code.',
    points: [
      'Your name, mobile, registration number and description are stored encrypted.',
      'Only the scholarship reviewers and admins can see applications.',
      'We do not keep your secret code either; we can only check that it matches.',
    ],
    aside: { title: 'Applied already?', text: 'Check where it stands with your tracking ID and code.', link: 'Application status' },
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/assistance', T[lang].meta)
}

export default async function AssistancePage() {
  const lang = await getLang()
  const t = T[lang]
  return (
    <FormLayout
      title={[t.title[0], { hl: t.title[1] }]}
      lede={t.lede}
      points={t.points}
      aside={
        <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
          <p className="font-bold text-ink">{t.aside.title}</p>
          <p className="mt-1 text-[0.95rem] text-muted">{t.aside.text}</p>
          <Link href="/services/assistance/status" className="btn btn-outline-blue btn-sm mt-4">
            <Search className="size-5" />
            {t.aside.link}
          </Link>
        </div>
      }
    >
      <AssistanceForm sessions={localizeOptions(recentSessions(), lang)} />
    </FormLayout>
  )
}
