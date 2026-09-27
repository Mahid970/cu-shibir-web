import type { Metadata } from 'next'

import { FormLayout } from '@/components/forms/FormLayout'
import { IssueForm } from '@/components/forms/IssueForm'
import { Search } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

export const revalidate = 86400

const T = copy(
  {
    meta: {
      title: 'সমস্যা জানান',
      description: 'হল, শাটল, খাবার, নিরাপত্তা বা পড়াশোনার সমস্যা ছাত্র সমস্যা ডেস্কে জানান, চাইলে নাম ছাড়াই, আর ট্র্যাকিং কোড দিয়ে অগ্রগতি দেখুন।',
    },
    title: ['সমস্যা', 'জানান'],
    lede: 'হল, শাটল, খাবার, নিরাপত্তা বা পড়াশোনা: যে সমস্যা আপনাকে বা আপনার বন্ধুদের ভোগাচ্ছে, লিখে জানান। ডেস্ক খোঁজ নেবে, দায়িত্বপ্রাপ্তদের কাছে তুলবে এবং অগ্রগতি জানাবে।',
    points: [
      'বিবরণ, জায়গা, নাম ও যোগাযোগ এনক্রিপ্ট করে রাখা হয়।',
      'চাইলে নাম ছাড়াই জানাতে পারেন; ট্র্যাকিং কোড দিয়ে তবুও অগ্রগতি দেখা যাবে।',
      'হয়রানির অভিযোগ শুধু হয়রানি ডেস্ক দেখে। প্রকাশ্য পরিসংখ্যানে কোনো ব্যক্তিগত তথ্য থাকে না।',
    ],
    aside: { title: 'আগেই জানিয়েছেন?', text: 'ট্র্যাকিং আইডি ও কোড দিয়ে অগ্রগতি দেখুন।', link: 'সমস্যার অবস্থা' },
  },
  {
    meta: {
      title: 'Report a problem',
      description: 'Report a problem with halls, the shuttle, food, safety or studies to the student issues desk, anonymously if you like, and follow it with a tracking code.',
    },
    title: ['Report a', 'problem'],
    lede: 'Halls, the shuttle, food, safety or studies: write down the problem that is troubling you or your friends. The desk will look into it, raise it with those responsible and tell you how it is going.',
    points: [
      'The details, the place, your name and your contact are stored encrypted.',
      'You can report without your name and still follow the progress with the tracking code.',
      'Harassment reports are seen only by the harassment desk. The public figures contain no personal details.',
    ],
    aside: { title: 'Reported already?', text: 'Follow the progress with your tracking ID and code.', link: 'Report status' },
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/issues/report', T[lang].meta)
}

export default async function ReportIssuePage() {
  const t = T[await getLang()]
  return (
    <FormLayout
      title={[t.title[0], { hl: t.title[1] }]}
      lede={t.lede}
      points={t.points}
      aside={
        <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
          <p className="font-bold text-ink">{t.aside.title}</p>
          <p className="mt-1 text-[0.95rem] text-muted">{t.aside.text}</p>
          <Link href="/services/issues/status" className="btn btn-outline-blue btn-sm mt-4">
            <Search className="size-5" />
            {t.aside.link}
          </Link>
        </div>
      }
    >
      <IssueForm />
    </FormLayout>
  )
}
