import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui/ComingSoon'

export const metadata: Metadata = { title: 'ইভেন্ট', alternates: { canonical: '/events' } }

export default function Page() {
  return (
    <ComingSoon
      title={[{ hl: 'ইভেন্ট' }, 'ও কর্মসূচি']}
      intro="আসন্ন প্রোগ্রাম, অনলাইন রেজিস্ট্রেশন ও কিউআর টিকিট।"
      features={['অনলাইন রেজিস্ট্রেশন ও কিউআর টিকিট', 'অফলাইনেও চলে এমন চেক-ইন স্ক্যানার', 'ক্যালেন্ডারে যোগ ও রিমাইন্ডার', 'সার্টিফিকেট ও ফিডব্যাক']}
    />
  )
}
