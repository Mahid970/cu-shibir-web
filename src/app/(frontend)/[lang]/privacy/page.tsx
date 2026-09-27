import type { Metadata } from 'next'

import { PageHeader } from '@/components/ui/PageHeader'
import { copy } from '@/i18n/config'
import { date } from '@/i18n/format'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { SITE } from '@/lib/site'

const UPDATED = '2026-09-27T06:00:00Z'

const T = copy(
  {
    meta: {
      title: 'গোপনীয়তা নীতি',
      description: 'চবি ছাত্রশিবিরের ওয়েবসাইট কোন তথ্য নেয়, কীভাবে রাখে এবং কে দেখতে পারে।',
    },
    title: ['গোপনীয়তা', 'নীতি'],
    lede: 'আমাদের ওয়েবসাইট কোন তথ্য নেয়, কীভাবে রাখে এবং কে দেখতে পারে।',
    updated: 'সর্বশেষ হালনাগাদ:',
    sections: [
      {
        h: 'কোন তথ্য নিই',
        p: [
          'শুধু আপনি ফরমে যা লেখেন। প্রশ্ন ব্যাংকে প্রশ্নপত্র পাঠাতে কোনো ব্যক্তিগত তথ্য লাগে না। সমর্থক ফরমে নাম, মোবাইল, বিভাগ, শিক্ষাবর্ষ ও হল; ইমেইল ও ফেসবুক লিংক ঐচ্ছিক। সহায়তার আবেদনে এর সঙ্গে প্রয়োজনের বিবরণ ও রেফারেন্স।',
          'বাবা-মায়ের নাম, জেলা, থানা বা জাতীয় পরিচয়পত্র নম্বর আমরা চাই না।',
          'এহতেসাব ও পরামর্শ নাম ছাড়াও পাঠানো যায়। তখন প্রেরকের কোনো তথ্য রাখা হয় না।',
          'ছাত্র সমস্যা ডেস্কে সমস্যার বিষয়, বিবরণ ও জায়গা নেওয়া হয়; নাম ও যোগাযোগ ঐচ্ছিক, আর নাম ছাড়া জানালে সেগুলো রাখা হয় না।',
          'রক্তদাতা হলে নাম, মোবাইল, রক্তের গ্রুপ এবং ঐচ্ছিকভাবে বিভাগ, হল ও শেষ রক্তদানের তারিখ। রক্তের অনুরোধে রোগীর গ্রুপ, হাসপাতাল, সময় এবং অনুরোধকারীর নাম ও মোবাইল।',
        ],
      },
      {
        h: 'কীভাবে রাখি',
        p: [
          'নাম, মোবাইল, ইমেইল, ফেসবুক লিংক, রেজিস্ট্রেশন নম্বর ও বার্তা ডেটাবেসে AES-256 এনক্রিপশনে রাখা হয়। ডেটাবেস কারও হাতে গেলেও চাবি ছাড়া এগুলো পড়া যায় না।',
          'সহায়তার আবেদন ও সমস্যা ডেস্কের গোপন কোড আমরা নিজেরাও জানি না; শুধু মিলিয়ে দেখা যায় কোডটি সঠিক কি না।',
          'ওয়েবসাইটে বিজ্ঞাপন বা তৃতীয় পক্ষের ট্র্যাকিং নেই। ইউটিউব ভিডিও শুধু প্লে চাপলেই লোড হয়।',
        ],
      },
      {
        h: 'কে দেখতে পারেন',
        p: [
          'সমর্থক ফরম ও এহতেসাব শুধু শাখার দায়িত্বপ্রাপ্ত অ্যাডমিন দেখতে পারেন। সহায়তার আবেদন দেখেন অ্যাডমিন ও নির্ধারিত শিক্ষাবৃত্তি পর্যালোচক।',
          'ছাত্র সমস্যা দেখেন অ্যাডমিন ও ছাত্র সেবা ডেস্ক। হয়রানির অভিযোগ দেখেন শুধু নির্ধারিত হয়রানি ডেস্ক। ডেস্কের প্রকাশ্য হিসাবে শুধু সংখ্যা থাকে, কোনো নাম বা বিবরণ নয়।',
          'রক্তদাতা ও রক্তের অনুরোধ দেখেন শুধু রক্তদান সমন্বয়কেরা। দাতার নম্বর কখনো অনুরোধকারীকে দেওয়া হয় না; দাতা রাজি হলে দাতাকেই অনুরোধকারীর নম্বর দেওয়া হয়। দাতা যেকোনো সময় দাতা আইডি ও কোড দিয়ে নিজের নাম তালিকা থেকে মুছে ফেলতে পারেন।',
          'আপনার তথ্য কখনো বিক্রি বা অন্য কোনো প্রতিষ্ঠানকে দেওয়া হয় না।',
        ],
      },
      {
        h: 'কতদিন রাখি ও মুছে ফেলা',
        p: [
          'যে কাজের জন্য তথ্য দিয়েছেন, সেটি শেষ হলে তথ্য মুছে ফেলা হয়। বন্ধ হয়ে যাওয়া ফরম ও আবেদন এক বছর পর মুছে যায়।',
          `নিজের তথ্য দেখতে, সংশোধন করতে বা মুছে ফেলতে ${SITE.email} ঠিকানায় লিখুন।`,
        ],
      },
    ],
  },
  {
    meta: {
      title: 'Privacy policy',
      description: 'What information the CU Chhatrashibir website collects, how it is stored and who can see it.',
    },
    title: ['Privacy', 'policy'],
    lede: 'What information our website collects, how it is stored and who can see it.',
    updated: 'Last updated:',
    sections: [
      {
        h: 'What we collect',
        p: [
          'Only what you type into a form. Sending a paper to the question bank needs no personal details at all. The supporter form asks for your name, mobile number, department, session and hall; an email address and a Facebook link are optional. An aid application also asks you to describe your need and to give references.',
          'We do not ask for your parents’ names, your district or thana, or your national ID number.',
          'Ehtesab and advice can be sent without a name. Then nothing about the sender is kept.',
          'The student issues desk asks what the problem is about, the details and the place; your name and contact are optional, and nothing about you is kept if you report anonymously.',
          'Blood donors give their name, mobile number and blood group, and optionally their department, hall and last donation date. A blood request asks for the patient’s group, the hospital, the time, and the requester’s name and mobile number.',
        ],
      },
      {
        h: 'How we store it',
        p: [
          'Names, mobile numbers, email addresses, Facebook links, registration numbers and messages are stored in the database with AES-256 encryption. Even if someone got hold of the database, they could not read them without the key.',
          'We do not know the secret code of an aid application or an issue report ourselves; we can only check whether a code is correct.',
          'The website has no advertising and no third-party tracking. YouTube videos load only when you press play.',
        ],
      },
      {
        h: 'Who can see it',
        p: [
          'Supporter forms and ehtesab can be seen only by the branch’s designated admins. Aid applications are seen by the admins and the assigned scholarship reviewers.',
          'Issue reports are seen by the admins and the student service desk. Harassment reports are seen only by the assigned harassment desk. The desk’s public figures contain only numbers, never names or details.',
          'Blood donors and blood requests are seen only by the blood coordinators. A donor’s number is never given to the person asking; if the donor agrees, the donor is given the requester’s number. Donors can remove themselves from the list at any time with their donor ID and code.',
          'Your information is never sold or given to any other organisation.',
        ],
      },
      {
        h: 'How long we keep it, and deleting it',
        p: [
          'Once the purpose you gave it for is done, the information is deleted. Closed forms and applications are deleted after one year.',
          `To see, correct or delete your own information, write to ${SITE.email}.`,
        ],
      },
    ],
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/privacy', T[lang].meta)
}

export default async function PrivacyPage() {
  const lang = await getLang()
  const t = T[lang]
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} />
      <div className="wrap max-w-3xl py-12 md:py-16">
        <div className="card p-6 sm:p-10">
          <div className="prose-read">
            {t.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ))}
            <p className="text-[0.95rem] text-subtle">
              {t.updated} {date(lang, UPDATED)}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
