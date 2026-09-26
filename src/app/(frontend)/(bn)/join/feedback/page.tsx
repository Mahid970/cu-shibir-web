import type { Metadata } from 'next'

import { FeedbackForm } from '@/components/forms/FeedbackForm'
import { FormLayout } from '@/components/forms/FormLayout'
import { getLeaders } from '@/lib/cms'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'এহতেসাব ও পরামর্শ',
  description: 'চবি ছাত্রশিবিরের দায়িত্বশীলদের পরামর্শ, এহতেসাব বা অভিযোগ পাঠান, চাইলে নাম ছাড়াই।',
  alternates: { canonical: '/join/feedback' },
}

type Props = { searchParams: Promise<{ to?: string }> }

export default async function FeedbackPage({ searchParams }: Props) {
  const [{ to }, leaders] = await Promise.all([searchParams, getLeaders('bn')])
  const people = leaders.filter((p) => p.slug).map((p) => ({ value: p.slug!, label: `${p.name} (${p.position})` }))
  return (
    <FormLayout
      title={['এহতেসাব ও', { hl: 'পরামর্শ' }]}
      lede="ভুল ধরিয়ে দেওয়া, পরামর্শ দেওয়া বা সমস্যা জানানো, সবই আমাদের কাজকে ভালো করে। নাম ছাড়াও পাঠাতে পারেন।"
      points={[
        'বার্তা ও পরিচয় এনক্রিপ্ট করে রাখা হয়।',
        'নাম ছাড়া পাঠালে আপনার কোনো তথ্য সংরক্ষণ করা হয় না।',
        'শুধু দায়িত্বপ্রাপ্ত অ্যাডমিন বার্তা পড়েন এবং সংশ্লিষ্ট দায়িত্বশীলকে জানান।',
      ]}
      aside={
        <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
          <p className="font-bold text-ink">ইমেইলেও লিখতে পারেন</p>
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
