import type { Metadata } from 'next'

import { FormLayout } from '@/components/forms/FormLayout'
import { SupporterForm } from '@/components/forms/SupporterForm'
import { copy, type TitleCopy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { localizeOptions, recentSessions } from '@/lib/campus'

export const revalidate = 86400

const T = copy<{ meta: Metadata; title: TitleCopy; lede: string; points: string[]; aside: { title: string; text: string; link: string } }>(
  {
    meta: {
      title: 'সমর্থক ফরম',
      description: 'চবি ছাত্রশিবিরের সমর্থক হতে ফরমটি পূরণ করুন। শুধু প্রয়োজনীয় তথ্য, এনক্রিপ্ট করে সংরক্ষিত।',
    },
    title: [{ hl: 'সমর্থক' }, 'ফরম'],
    lede: 'দুই মিনিটের ফরম। তোমার বিভাগ বা হলের দায়িত্বশীল যোগাযোগ করবেন।',
    points: [
      'নাম, মোবাইল, ইমেইল ও ফেসবুক লিংক এনক্রিপ্ট করে রাখা হয়।',
      'শুধু দায়িত্বপ্রাপ্ত অ্যাডমিন এই তথ্য দেখতে পারেন।',
      'বাবা-মায়ের নাম, জেলা বা থানা চাওয়া হয় না।',
      'চাইলে যেকোনো সময় তথ্য মুছে ফেলার অনুরোধ করতে পারো।',
    ],
    aside: { title: 'পরামর্শ বা অভিযোগ আছে?', text: 'নাম ছাড়াও পাঠাতে পারো।', link: 'এহতেসাব ও পরামর্শ' },
  },
  {
    meta: {
      title: 'Supporter form',
      description: 'Fill in this form to become a supporter of CU Chhatrashibir. Only what is needed, stored encrypted.',
    },
    title: ['Supporter', { hl: 'form' }],
    lede: 'A two-minute form. The leader in your department or hall will get in touch.',
    points: [
      'Your name, mobile, email and Facebook link are stored encrypted.',
      'Only the admins responsible can see them.',
      'We do not ask for your parents’ names, district or thana.',
      'You can ask us to delete your details at any time.',
    ],
    aside: { title: 'Advice or a complaint?', text: 'You can send it without your name.', link: 'Ehtesab and advice' },
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/join/supporter', T[lang].meta)
}

export default async function SupporterPage() {
  const lang = await getLang()
  const t = T[lang]
  return (
    <FormLayout
      title={t.title}
      lede={t.lede}
      points={t.points}
      aside={
        <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
          <p className="font-bold text-ink">{t.aside.title}</p>
          <p className="mt-1 text-[0.95rem] text-muted">{t.aside.text}</p>
          <Link href="/join/feedback" className="btn btn-outline-blue btn-sm mt-4">
            {t.aside.link}
          </Link>
        </div>
      }
    >
      <SupporterForm sessions={localizeOptions(recentSessions(), lang)} />
    </FormLayout>
  )
}
