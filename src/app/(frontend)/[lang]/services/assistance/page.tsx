import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { AssistanceForm } from '@/components/forms/AssistanceForm'
import { FormLayout } from '@/components/forms/FormLayout'
import { Search } from '@/components/ui/Icons'
import { recentSessions } from '@/lib/campus'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'শিক্ষাবৃত্তি ও চিকিৎসা সহায়তা',
  description: 'চবি শিক্ষার্থীদের জন্য শিক্ষাবৃত্তি ও চিকিৎসা সহায়তার অনলাইন আবেদন, ট্র্যাকিং কোড দিয়ে অগ্রগতি দেখার সুবিধাসহ।',
  alternates: { canonical: '/services/assistance' },
}

export default function AssistancePage() {
  return (
    <FormLayout
      title={['শিক্ষাবৃত্তি ও', { hl: 'সহায়তা' }]}
      lede="আর্থিক সংকটে পড়াশোনা বা চিকিৎসা যেন থেমে না যায়। আবেদন করুন, তারপর ট্র্যাকিং কোড দিয়ে অগ্রগতি দেখুন।"
      points={[
        'নাম, মোবাইল, রেজিস্ট্রেশন নম্বর ও বিবরণ এনক্রিপ্ট করে রাখা হয়।',
        'শুধু শিক্ষাবৃত্তি পর্যালোচক ও অ্যাডমিন আবেদন দেখতে পারেন।',
        'গোপন কোডটি আমাদের কাছেও সংরক্ষিত থাকে না, শুধু যাচাই করা যায়।',
      ]}
      aside={
        <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
          <p className="font-bold text-ink">আগেই আবেদন করেছেন?</p>
          <p className="mt-1 text-[0.95rem] text-muted">ট্র্যাকিং আইডি ও কোড দিয়ে অবস্থা দেখুন।</p>
          <Link href="/services/assistance/status" className="btn btn-outline-blue btn-sm mt-4">
            <Search className="size-5" />
            আবেদনের অবস্থা
          </Link>
        </div>
      }
    >
      <AssistanceForm sessions={recentSessions()} />
    </FormLayout>
  )
}
