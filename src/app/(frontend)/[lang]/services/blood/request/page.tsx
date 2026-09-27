import type { Metadata } from 'next'

import { BloodRequestForm } from '@/components/forms/BloodForms'
import { FormLayout } from '@/components/forms/FormLayout'
import { copy } from '@/i18n/config'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

export const revalidate = 86400

const T = copy(
  {
    meta: { title: 'রক্তের অনুরোধ', description: 'রক্ত দরকার? রোগীর গ্রুপ, হাসপাতাল ও সময় জানিয়ে চবি শিক্ষার্থীদের রক্তদাতা নেটওয়ার্কে অনুরোধ পাঠান।' },
    title: ['রক্তের', 'অনুরোধ'],
    lede: 'রোগীর রক্তের গ্রুপ, হাসপাতাল আর কখনের মধ্যে দরকার জানান। সমন্বয়কেরা মিলে যাওয়া দাতাদের সাথে যোগাযোগ করে আপনাকে ফোন করবেন।',
    points: [
      'আপনার নাম, নম্বর ও রোগীর বিবরণ এনক্রিপ্ট করে রাখা হয়।',
      'দাতা রাজি হলে শুধু তখনই তাঁকে আপনার নম্বর দেওয়া হয়।',
      'খুব জরুরি হলে একই সঙ্গে হাসপাতালের ব্লাড ব্যাংকেও খোঁজ নিন।',
    ],
  },
  {
    meta: { title: 'Request blood', description: 'Need blood? Send the patient’s blood group, the hospital and the time to the blood donor network of University of Chittagong students.' },
    title: ['Request', 'blood'],
    lede: 'Tell us the patient’s blood group, the hospital and when the blood is needed. The coordinators will contact matching donors and call you.',
    points: [
      'Your name, number and the note about the patient are stored encrypted.',
      'Your number is given to a donor only once they agree to give.',
      'If it is very urgent, ask the hospital’s blood bank at the same time.',
    ],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/blood/request', T[lang].meta)
}

export default async function RequestBloodPage() {
  const t = T[await getLang()]
  return (
    <FormLayout title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} points={t.points}>
      <BloodRequestForm />
    </FormLayout>
  )
}
