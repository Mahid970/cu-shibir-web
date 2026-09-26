import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui/ComingSoon'
import { copy } from '@/i18n/config'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    meta: { title: 'ইভেন্ট' },
    title: ['ইভেন্ট', 'ও কর্মসূচি'],
    intro: 'আসন্ন প্রোগ্রাম, অনলাইন রেজিস্ট্রেশন ও কিউআর টিকিট।',
    features: ['অনলাইন রেজিস্ট্রেশন ও কিউআর টিকিট', 'অফলাইনেও চলে এমন চেক-ইন স্ক্যানার', 'ক্যালেন্ডারে যোগ ও রিমাইন্ডার', 'সার্টিফিকেট ও ফিডব্যাক'],
  },
  {
    meta: { title: 'Events' },
    title: ['Events', 'and programmes'],
    intro: 'Upcoming programmes, online registration and QR tickets.',
    features: ['Online registration and QR tickets', 'A check-in scanner that works offline', 'Add to calendar and reminders', 'Certificates and feedback'],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/events', T[lang].meta)
}

export default async function Page() {
  const t = T[await getLang()]
  return <ComingSoon title={[{ hl: t.title[0] }, t.title[1]]} intro={t.intro} features={t.features} />
}
