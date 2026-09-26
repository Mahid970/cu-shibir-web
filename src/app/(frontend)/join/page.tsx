import type { Metadata } from 'next'

import { ContactCard } from '@/components/home/ContactCard'
import { JoinSteps } from '@/components/home/JoinSteps'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { getSiteSettings } from '@/lib/cms'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'যুক্ত হোন',
  description: 'চবি ছাত্রশিবিরের সাথে যুক্ত হওয়ার উপায়, সমর্থক ফরম ও যোগাযোগ।',
  alternates: { canonical: '/join' },
}

const COMING = ['অনলাইন সমর্থক ফরম (তথ্য এনক্রিপ্টেড)', 'এহতেসাব ও পরামর্শ — চাইলে নাম ছাড়াই', 'স্বেচ্ছাসেবক নিবন্ধন']

export default async function JoinPage() {
  const settings = await getSiteSettings('bn')
  return (
    <>
      <PageHeader
        title={[{ hl: 'সমর্থক' }, 'হোন']}
        lede="শিক্ষার্থীদের অধিকার আর সুন্দর ক্যাম্পাসের কাজে পাশে থাকো। শুরু করার উপায় নিচে।"
      >
        <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {COMING.map((c, i) => (
            <li
              key={c}
              className="load-up inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[0.95rem] font-semibold text-ink shadow-[0_4px_24px_rgb(11_15_46/0.06)]"
              style={vars({ '--d': `${350 + i * 100}ms` })}
            >
              {c}
              <span className="chip">শীঘ্রই</span>
            </li>
          ))}
        </ul>
      </PageHeader>
      <JoinSteps />
      <div className="pt-16 md:pt-20">
        <ContactCard email={settings.contact?.email || SITE.email} facebook={settings.socials?.facebook} />
      </div>
    </>
  )
}
