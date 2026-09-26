import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui/ComingSoon'

export const metadata: Metadata = { title: 'সিলেবাস', alternates: { canonical: '/syllabus' } }

export default function Page() {
  return (
    <ComingSoon
      title={['সিলেবাস ও', { hl: 'লাইব্রেরি' }]}
      intro="কর্মী, সাথী ও সদস্য সিলেবাস — অগ্রগতি ট্র্যাক করার সুবিধাসহ।"
      features={['কর্মী / সাথী / সদস্য সিলেবাস', 'নিজের অগ্রগতির চেকলিস্ট (ডিভাইসেই সংরক্ষিত)', 'অনলাইন লাইব্রেরির সরাসরি লিংক']}
    />
  )
}
