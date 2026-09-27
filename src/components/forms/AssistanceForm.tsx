'use client'

import { useState } from 'react'

import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'
import { FACULTIES, HALLS, localizeOptions, NON_RESIDENT, optionLabel } from '@/lib/campus'
import { submitAssistance } from '@/lib/forms/actions'
import { ASSISTANCE_TYPES, choices } from '@/lib/forms/options'

import { Choices, Consent, Select, TextArea, TextField } from './fields'
import { FormShell } from './FormShell'
import { TrackingTicket } from './TrackingTicket'

const T = copy(
  {
    submit: 'আবেদন জমা দিন',
    submitted: 'আবেদন জমা হয়েছে',
    type: 'কীসের জন্য আবেদন?',
    subject: 'কী ধরনের সহায়তা',
    name: 'পূর্ণ নাম',
    mobile: 'মোবাইল নম্বর',
    mobileHint: '০১XXXXXXXXX',
    registration: 'রেজিস্ট্রেশন বা আইডি নম্বর',
    department: 'বিভাগ',
    session: 'শিক্ষাবর্ষ',
    hall: 'হল',
    details: 'প্রয়োজনের বিবরণ',
    detailsHint: 'পরিবারের অবস্থা, কত টাকা বা কী ধরনের সহায়তা দরকার এবং কবের মধ্যে। অন্তত ৪০ অক্ষর।',
    references: 'রেফারেন্স',
    referencesHint: 'আপনাকে চেনেন এমন শিক্ষক বা দায়িত্বশীলের নাম ও মোবাইল।',
    consent: 'আমার দেওয়া তথ্য সঠিক। আবেদন যাচাইয়ের জন্য দায়িত্বপ্রাপ্ত পর্যালোচকেরা এই তথ্য দেখবেন, এতে সম্মতি দিচ্ছি।',
    privacy: 'গোপনীয়তা নীতি',
  },
  {
    submit: 'Submit application',
    submitted: 'Application submitted',
    type: 'What are you applying for?',
    subject: 'What kind of support',
    name: 'Full name',
    mobile: 'Mobile number',
    mobileHint: '01XXXXXXXXX',
    registration: 'Registration or ID number',
    department: 'Department',
    session: 'Session',
    hall: 'Hall',
    details: 'Describe your need',
    detailsHint: 'Your family’s situation, how much money or what kind of support you need, and by when. At least 40 characters.',
    references: 'References',
    referencesHint: 'Name and mobile number of a teacher or leader who knows you.',
    consent: 'The information I have given is correct. I agree that the assigned reviewers will see it to assess my application.',
    privacy: 'Privacy policy',
  },
)

export function AssistanceForm({ sessions }: { sessions: { value: string; label: string }[] }) {
  const lang = useLang()
  const t = T[lang]
  const [type, setType] = useState('scholarship')
  return (
    <FormShell
      action={submitAssistance}
      submitLabel={t.submit}
      success={(state) => <TrackingTicket ticket={state.tracking!} title={t.submitted} statusHref="/services/assistance/status" />}
    >
      {({ errors }) => (
        <>
          <Choices name="type" label={t.type} options={choices(ASSISTANCE_TYPES, lang)} required defaultValue="scholarship" onChange={setType} errors={errors} />
          {type === 'other' && <TextField name="subject" label={t.subject} required maxLength={150} errors={errors} />}
          <TextField name="name" label={t.name} required autoComplete="name" maxLength={100} errors={errors} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="mobile" label={t.mobile} required type="tel" inputMode="tel" autoComplete="tel" placeholder={t.mobileHint} errors={errors} />
            <TextField name="registration" label={t.registration} maxLength={40} errors={errors} />
          </div>
          <Select
            name="department"
            label={t.department}
            required
            groups={FACULTIES.map((f) => ({ label: optionLabel(f, lang), options: localizeOptions(f.departments, lang) }))}
            errors={errors}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Select name="session" label={t.session} required options={sessions} errors={errors} />
            <Select name="hall" label={t.hall} options={localizeOptions([...HALLS, NON_RESIDENT], lang)} errors={errors} />
          </div>
          <TextArea name="details" label={t.details} required rows={7} maxLength={4000} hint={t.detailsHint} errors={errors} />
          <TextArea name="references" label={t.references} rows={3} maxLength={600} hint={t.referencesHint} errors={errors} />
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
