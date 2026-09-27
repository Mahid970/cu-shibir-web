import type { Metadata } from 'next'

import { DonorForm } from '@/components/forms/BloodForms'
import { FormLayout } from '@/components/forms/FormLayout'
import { copy } from '@/i18n/config'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

export const revalidate = 86400

const T = copy(
  {
    meta: { title: 'রক্তদাতা হোন', description: 'চবি শিক্ষার্থীদের রক্তদাতা নেটওয়ার্কে নিবন্ধন করুন। আপনার নম্বর প্রকাশ হবে না; প্রয়োজনে সমন্বয়কেরা ফোন করবেন।' },
    title: ['রক্তদাতা', 'হোন'],
    lede: 'আপনার রক্তের গ্রুপ দরকার হলে সমন্বয়কেরা ফোন করবেন। রাজি থাকলে দেবেন, না থাকলে না।',
    points: [
      'নাম ও মোবাইল নম্বর এনক্রিপ্ট করে রাখা হয়; দেখেন শুধু রক্তদান সমন্বয়কেরা।',
      'আপনার নম্বর কোনো অনুরোধকারীকে দেওয়া হয় না।',
      'শেষ রক্তদানের ১২০ দিনের মধ্যে আপনাকে ডাকা হবে না। যেকোনো সময় বিরতি নিতে বা নাম সরাতে পারবেন।',
    ],
  },
  {
    meta: { title: 'Become a blood donor', description: 'Join the blood donor network of University of Chittagong students. Your number is never published; coordinators call you when needed.' },
    title: ['Become a', 'blood donor'],
    lede: 'When your blood group is needed, a coordinator will call you. Give if you can; say no if you can’t.',
    points: [
      'Your name and mobile number are stored encrypted, and only the blood coordinators can see them.',
      'Your number is never given to anyone asking for blood.',
      'Nobody will call you within 120 days of your last donation. You can take a break or leave at any time.',
    ],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/blood/donate', T[lang].meta)
}

export default async function DonatePage() {
  const t = T[await getLang()]
  return (
    <FormLayout title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} points={t.points}>
      <DonorForm />
    </FormLayout>
  )
}
