import type { Metadata } from 'next'

import { ServiceCards } from '@/components/home/Services'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const metadata: Metadata = { title: 'শিক্ষার্থী সেবা', alternates: { canonical: '/services' } }

export default function Page() {
  return (
    <ComingSoon title={['শিক্ষার্থী', { hl: 'সেবা' }]} intro="চবি শিক্ষার্থীদের প্রতিদিনের কাজে লাগে এমন সেবা — এক জায়গায়।">
      <ServiceCards />
    </ComingSoon>
  )
}
