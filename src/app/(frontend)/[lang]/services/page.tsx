import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { ServiceCards } from '@/components/home/Services'
import { ArrowRight } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'শিক্ষার্থী সেবা',
  description: 'চবি শিক্ষার্থীদের জন্য শিক্ষাবৃত্তি ও চিকিৎসা সহায়তার আবেদন, ক্যাম্পাস গাইড এবং আসন্ন সেবাসমূহ।',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader title={['শিক্ষার্থী', { hl: 'সেবা' }]} lede="চবি শিক্ষার্থীদের প্রতিদিনের কাজে লাগে এমন সেবা, এক জায়গায়। যেগুলো চালু আছে সেগুলো এখনই ব্যবহার করা যাবে।" />
      <div className="wrap py-14 md:py-20">
        <ServiceCards />
        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-[0_4px_24px_rgb(11_15_46/0.06)] md:p-10">
          <h2 className="text-[1.5rem] font-bold text-ink md:text-[1.8rem]">হল, পরিবহন বা নিরাপত্তা নিয়ে সমস্যা?</h2>
          <p className="max-w-xl text-muted">ছাত্র সমস্যা ডেস্ক চালু হওয়া পর্যন্ত সমস্যাটি অভিযোগ হিসেবে জানাও। দায়িত্বশীলরা খোঁজ নেবেন।</p>
          <Link href="/join/feedback" className="btn btn-yellow">
            সমস্যা জানাও
            <ArrowRight />
          </Link>
        </div>
      </div>
    </>
  )
}
