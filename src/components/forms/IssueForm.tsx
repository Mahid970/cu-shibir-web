'use client'

import { useState } from 'react'

import { Lock } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'
import { HALLS, localizeOptions, NON_RESIDENT } from '@/lib/campus'
import { submitIssue } from '@/lib/forms/actions'
import { choices, CONFIDENTIAL_CATEGORY, ISSUE_CATEGORIES } from '@/lib/forms/options'

import { Choices, Consent, Select, TextArea, TextField } from './fields'
import { FormShell } from './FormShell'
import { TrackingTicket } from './TrackingTicket'

const T = copy(
  {
    submit: 'সমস্যা জানান',
    submitted: 'সমস্যাটি ডেস্কে পৌঁছেছে',
    category: 'সমস্যাটি কী নিয়ে?',
    confidential: {
      title: 'এই অভিযোগ গোপনীয়',
      text: 'শুধু হয়রানি ডেস্কের দায়িত্বপ্রাপ্তরা এটি দেখবেন। চাইলে বিশ্ববিদ্যালয়ের যৌন হয়রানি প্রতিরোধ কমিটিতেও অভিযোগ করতে পারেন; কীভাবে করবেন, ডেস্ক জানিয়ে দেবে।',
      now: 'এখনই বিপদে থাকলে ফোন করুন: জাতীয় জরুরি সেবা ৯৯৯, নারী ও শিশু নির্যাতন প্রতিরোধ হেল্পলাইন ১০৯।',
    },
    hall: 'হল',
    subject: 'সংক্ষেপে সমস্যা',
    subjectHint: 'যেমন: “আলাওল হলের তিনতলার পানির কল এক সপ্তাহ ধরে নষ্ট”',
    place: 'কোথায়',
    placeHint: 'ভবন, তলা বা জায়গার নাম, যাতে খুঁজে পাওয়া যায়।',
    details: 'বিস্তারিত',
    detailsHint: 'কী হচ্ছে, কবে থেকে, কারা ভুগছেন, আগে কোথাও জানিয়েছেন কি না। অন্তত ৩০ অক্ষর।',
    anonymous: 'নাম ছাড়া জানাতে চাই',
    anonymousHint: 'নাম বা যোগাযোগ রাখা হবে না। তবু ট্র্যাকিং কোড দিয়ে অগ্রগতি আর ডেস্কের বার্তা দেখতে পারবেন।',
    name: 'আপনার নাম',
    contact: 'যোগাযোগ',
    contactHint: 'মোবাইল বা ইমেইল, যদি ডেস্ক আপনার কাছে আরও জানতে চায়।',
    consent: 'আমার দেওয়া তথ্য সত্য। সমস্যাটি সমাধানের জন্য দায়িত্বপ্রাপ্তরা এই তথ্য দেখবেন, এতে সম্মতি দিচ্ছি।',
    privacy: 'গোপনীয়তা নীতি',
  },
  {
    submit: 'Report the problem',
    submitted: 'Your report has reached the desk',
    category: 'What is the problem about?',
    confidential: {
      title: 'This report is confidential',
      text: 'Only the people on the harassment desk will see it. You can also complain to the university’s sexual harassment prevention committee; the desk will tell you how.',
      now: 'If you are in danger right now, call the national emergency number 999, or 109, the helpline for violence against women and children.',
    },
    hall: 'Hall',
    subject: 'The problem in brief',
    subjectHint: 'For example: “The tap on the third floor of Alaol Hall has been broken for a week”',
    place: 'Where',
    placeHint: 'The building, floor or name of the place, so it can be found.',
    details: 'Details',
    detailsHint: 'What is happening, since when, who is affected, and whether you have told anyone already. At least 30 characters.',
    anonymous: 'Report without my name',
    anonymousHint: 'No name or contact details are kept. You can still follow the progress and read the desk’s replies with the tracking code.',
    name: 'Your name',
    contact: 'Contact',
    contactHint: 'Mobile or email, in case the desk needs to ask you more.',
    consent: 'What I have written is true. I agree that the people handling the problem will see this information.',
    privacy: 'Privacy policy',
  },
)

export function IssueForm() {
  const lang = useLang()
  const t = T[lang]
  const [category, setCategory] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  return (
    <FormShell
      action={submitIssue}
      submitLabel={t.submit}
      success={(state) => <TrackingTicket ticket={state.tracking!} title={t.submitted} statusHref="/services/issues/status" />}
    >
      {({ errors }) => (
        <>
          <Choices name="category" label={t.category} options={choices(ISSUE_CATEGORIES, lang)} required onChange={setCategory} errors={errors} />
          {category === CONFIDENTIAL_CATEGORY && (
            <div role="note" className="rounded-2xl border border-pale-4 bg-pale p-5 leading-relaxed">
              <p className="flex items-center gap-2 font-bold text-primary">
                <Lock className="size-5 shrink-0" />
                {t.confidential.title}
              </p>
              <p className="mt-2 text-ink/85">{t.confidential.text}</p>
              <p className="mt-2 font-semibold text-ink">{t.confidential.now}</p>
            </div>
          )}
          <TextField name="subject" label={t.subject} required maxLength={150} hint={t.subjectHint} errors={errors} />
          <div className="grid gap-6 sm:grid-cols-2">
            <Select name="hall" label={t.hall} options={localizeOptions([...HALLS, NON_RESIDENT], lang)} errors={errors} />
            <TextField name="place" label={t.place} maxLength={150} hint={t.placeHint} errors={errors} />
          </div>
          <TextArea name="details" label={t.details} required rows={7} maxLength={4000} hint={t.detailsHint} errors={errors} />

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-pale p-4">
            <input type="checkbox" name="anonymous" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="mt-1 size-5 shrink-0 accent-primary" />
            <span>
              <span className="block font-semibold text-ink">{t.anonymous}</span>
              <span className="text-[0.92rem] text-muted">{t.anonymousHint}</span>
            </span>
          </label>

          {!anonymous && (
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField name="name" label={t.name} autoComplete="name" maxLength={100} errors={errors} />
              <TextField name="contact" label={t.contact} maxLength={200} hint={t.contactHint} errors={errors} />
            </div>
          )}

          <Consent errors={errors}>
            {t.consent}{' '}
            <Link href="/privacy" className="font-semibold text-primary underline" target="_blank">
              {t.privacy}
            </Link>
          </Consent>
        </>
      )}
    </FormShell>
  )
}
