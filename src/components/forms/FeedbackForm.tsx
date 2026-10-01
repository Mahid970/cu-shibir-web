'use client'

import { useState } from 'react'

import { CheckCircle } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'
import { submitFeedback } from '@/lib/forms/actions'
import { choices, FEEDBACK_KINDS } from '@/lib/forms/options'

import { Choices, Select, TextArea, TextField } from './fields'
import { FormShell } from './FormShell'

const T = copy(
  {
    submit: 'পাঠিয়ে দিন',
    arrived: 'বার্তাটি পৌঁছেছে',
    done: 'সংশ্লিষ্ট দায়িত্বশীল বিষয়টি দেখবেন। উত্তরের ঠিকানা দিয়ে থাকলে সেখানেই জানানো হবে।',
    home: 'হোমে ফিরে যান',
    kind: 'কী পাঠাতে চান?',
    about: 'কার উদ্দেশে',
    everyone: 'পুরো শাখার উদ্দেশে',
    aboutHint: 'নির্দিষ্ট দায়িত্বশীলকে বলতে চাইলে বেছে নিন।',
    subject: 'বিষয়',
    message: 'বিস্তারিত',
    messageHint: 'অন্তত ২০ অক্ষর। যত নির্দিষ্ট করে লিখবেন, তত দ্রুত ব্যবস্থা নেওয়া যাবে।',
    anonymous: 'নাম ছাড়া পাঠাতে চাই',
    anonymousHint: 'তখন আপনার নাম বা যোগাযোগের কোনো তথ্য রাখা হবে না, তাই উত্তরও দেওয়া যাবে না।',
    name: 'আপনার নাম',
    contact: 'উত্তর কোথায় দেব',
    contactHint: 'মোবাইল বা ইমেইল',
  },
  {
    submit: 'Send',
    arrived: 'Your message has arrived',
    done: 'The leader concerned will look into it. If you left a way to reach you, the reply will come there.',
    home: 'Back to home',
    kind: 'What would you like to send?',
    about: 'Addressed to',
    everyone: 'The whole branch',
    aboutHint: 'Choose a leader if it is meant for one person.',
    subject: 'Subject',
    message: 'Details',
    messageHint: 'At least 20 characters. The more specific you are, the sooner we can act.',
    anonymous: 'Send without my name',
    anonymousHint: 'Then no name or contact details are kept, so we cannot reply either.',
    name: 'Your name',
    contact: 'Where should we reply?',
    contactHint: 'Mobile or email',
  },
)

export function FeedbackForm({ people, to }: { people: { value: string; label: string }[]; to?: string }) {
  const lang = useLang()
  const t = T[lang]
  const [anonymous, setAnonymous] = useState(false)
  return (
    <FormShell
      action={submitFeedback}
      submitLabel={t.submit}
      success={() => (
        <div className="py-6 text-center">
          <CheckCircle className="mx-auto size-16 text-success" />
          <h2 className="mt-4 text-[1.7rem] font-bold text-ink">{t.arrived}</h2>
          <p className="mx-auto mt-3 max-w-md text-[1.05rem] leading-relaxed text-muted">{t.done}</p>
          <Link href="/" className="btn btn-outline-blue btn-sm mt-8">
            {t.home}
          </Link>
        </div>
      )}
    >
      {({ errors }) => (
        <>
          <Choices name="kind" label={t.kind} options={choices(FEEDBACK_KINDS, lang)} required defaultValue="advice" errors={errors} />
          <Select
            name="about"
            label={t.about}
            options={people}
            defaultValue={to ?? ''}
            placeholder={t.everyone}
            hint={t.aboutHint}
            errors={errors}
          />
          <TextField name="subject" label={t.subject} required maxLength={150} errors={errors} />
          <TextArea name="message" label={t.message} required maxLength={4000} rows={7} hint={t.messageHint} errors={errors} />

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
              <TextField name="contact" label={t.contact} placeholder={t.contactHint} maxLength={200} errors={errors} />
            </div>
          )}
        </>
      )}
    </FormShell>
  )
}
