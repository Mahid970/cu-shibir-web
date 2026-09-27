import type { Metadata } from 'next'

import { FormLayout } from '@/components/forms/FormLayout'
import { PaperForm } from '@/components/forms/PaperForm'
import { copy } from '@/i18n/config'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

export const revalidate = 86400

const T = copy(
  {
    meta: { title: 'প্রশ্নপত্র পাঠান', description: 'চবির আগের পরীক্ষার প্রশ্নপত্র প্রশ্ন ব্যাংকে পাঠান, যাতে পরের ব্যাচ উপকৃত হয়।' },
    title: ['প্রশ্নপত্র', 'পাঠান'],
    lede: 'আপনার কাছে থাকা আগের পরীক্ষার প্রশ্ন পরের ব্যাচের কাজে লাগবে। ছবি বা PDF পাঠান; যাচাইয়ের পর সবার জন্য খোলা হবে।',
    points: [
      'আপনার নাম বা কোনো ব্যক্তিগত তথ্য চাওয়া হয় না।',
      'ফাইলের নাম বদলে দেওয়া হয়, যাতে তাতে কারও নাম না থাকে।',
      'দায়িত্বপ্রাপ্তরা যাচাই না করা পর্যন্ত ফাইলটি কেউ দেখতে পায় না। বই বা কপিরাইটযুক্ত লেখা নেওয়া হয় না।',
    ],
  },
  {
    meta: { title: 'Send a question paper', description: 'Send a past University of Chittagong exam paper to the question bank so the next batch can use it.' },
    title: ['Send a', 'question paper'],
    lede: 'A past exam paper you have will help the next batch. Send a photo or a PDF; it opens to everyone once it has been checked.',
    points: [
      'We do not ask for your name or any personal details.',
      'The file is renamed so that it carries nobody’s name.',
      'Nobody can see the file until it has been checked. Books and copyrighted work are not accepted.',
    ],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/questions/upload', T[lang].meta)
}

export default async function UploadPaperPage() {
  const t = T[await getLang()]
  return (
    <FormLayout title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} points={t.points}>
      <PaperForm />
    </FormLayout>
  )
}
