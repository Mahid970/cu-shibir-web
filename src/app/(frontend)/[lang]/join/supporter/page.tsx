import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { FormLayout } from '@/components/forms/FormLayout'
import { SupporterForm } from '@/components/forms/SupporterForm'
import { recentSessions } from '@/lib/campus'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'সমর্থক ফরম',
  description: 'চবি ছাত্রশিবিরের সমর্থক হতে ফরমটি পূরণ করুন। শুধু প্রয়োজনীয় তথ্য, এনক্রিপ্ট করে সংরক্ষিত।',
  alternates: { canonical: '/join/supporter' },
}

export default function SupporterPage() {
  return (
    <FormLayout
      title={[{ hl: 'সমর্থক' }, 'ফরম']}
      lede="দুই মিনিটের ফরম। তোমার বিভাগ বা হলের দায়িত্বশীল যোগাযোগ করবেন।"
      points={[
        'নাম, মোবাইল, ইমেইল ও ফেসবুক লিংক এনক্রিপ্ট করে রাখা হয়।',
        'শুধু দায়িত্বপ্রাপ্ত অ্যাডমিন এই তথ্য দেখতে পারেন।',
        'বাবা-মায়ের নাম, জেলা বা থানা চাওয়া হয় না।',
        'চাইলে যেকোনো সময় তথ্য মুছে ফেলার অনুরোধ করতে পারো।',
      ]}
      aside={
        <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
          <p className="font-bold text-ink">পরামর্শ বা অভিযোগ আছে?</p>
          <p className="mt-1 text-[0.95rem] text-muted">নাম ছাড়াও পাঠাতে পারো।</p>
          <Link href="/join/feedback" className="btn btn-outline-blue btn-sm mt-4">
            এহতেসাব ও পরামর্শ
          </Link>
        </div>
      }
    >
      <SupporterForm sessions={recentSessions()} />
    </FormLayout>
  )
}
