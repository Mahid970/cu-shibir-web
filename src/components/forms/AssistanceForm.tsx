'use client'

import { Link } from '@/i18n/link'
import { useState } from 'react'

import { ArrowRight, CheckCircle } from '@/components/ui/Icons'
import { FACULTIES, HALLS, NON_RESIDENT, type Option } from '@/lib/campus'
import { submitAssistance } from '@/lib/forms/actions'
import { ASSISTANCE_TYPES } from '@/lib/forms/options'

import { Choices, Consent, Select, TextArea, TextField } from './fields'
import { FormShell } from './FormShell'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard?.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="btn btn-outline btn-sm"
    >
      {copied ? 'কপি হয়েছে' : 'কপি করুন'}
    </button>
  )
}

export function AssistanceForm({ sessions }: { sessions: Option[] }) {
  const [type, setType] = useState('scholarship')
  return (
    <FormShell
      action={submitAssistance}
      submitLabel="আবেদন জমা দিন"
      success={(state) => {
        const t = state.tracking!
        const both = `ট্র্যাকিং আইডি: ${t.id}\nগোপন কোড: ${t.code}`
        return (
          <div className="py-4">
            <div className="text-center">
              <CheckCircle className="mx-auto size-16 text-success" />
              <h2 className="mt-4 text-[1.7rem] font-bold text-ink">আবেদন জমা হয়েছে</h2>
              <p className="mx-auto mt-3 max-w-lg text-[1.05rem] leading-relaxed text-muted">
                নিচের আইডি ও কোড দিয়ে যেকোনো সময় আবেদনের অবস্থা দেখতে পারবেন। কোডটি আর কখনো দেখানো হবে না, তাই এখনই লিখে বা স্ক্রিনশট নিয়ে রাখুন।
              </p>
            </div>
            <dl className="mx-auto mt-8 grid max-w-md gap-3 rounded-2xl border-2 border-dashed border-blue/40 bg-pale p-6 text-center">
              <div>
                <dt className="text-[0.9rem] text-subtle">ট্র্যাকিং আইডি</dt>
                <dd className="font-[family-name:var(--font-en)] text-[1.8rem] font-bold tracking-wider text-ink">{t.id}</dd>
              </div>
              <div>
                <dt className="text-[0.9rem] text-subtle">গোপন কোড</dt>
                <dd className="font-[family-name:var(--font-en)] text-[1.8rem] font-bold tracking-[0.3em] text-primary">{t.code}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CopyButton text={both} />
              <Link href="/services/assistance/status" className="btn btn-gradient btn-sm">
                অবস্থা দেখুন
                <ArrowRight />
              </Link>
            </div>
          </div>
        )
      }}
    >
      {({ errors }) => (
        <>
          <Choices name="type" label="কীসের জন্য আবেদন?" options={ASSISTANCE_TYPES} required defaultValue="scholarship" onChange={setType} errors={errors} />
          {type === 'other' && <TextField name="subject" label="কী ধরনের সহায়তা" required maxLength={150} errors={errors} />}
          <TextField name="name" label="পূর্ণ নাম" required autoComplete="name" maxLength={100} errors={errors} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="mobile" label="মোবাইল নম্বর" required type="tel" inputMode="tel" autoComplete="tel" placeholder="০১XXXXXXXXX" errors={errors} />
            <TextField name="registration" label="রেজিস্ট্রেশন বা আইডি নম্বর" maxLength={40} errors={errors} />
          </div>
          <Select name="department" label="বিভাগ" required groups={FACULTIES.map((f) => ({ label: f.label, options: f.departments }))} errors={errors} />
          <div className="grid gap-6 sm:grid-cols-2">
            <Select name="session" label="শিক্ষাবর্ষ" required options={sessions} errors={errors} />
            <Select name="hall" label="হল" options={[...HALLS, NON_RESIDENT]} errors={errors} />
          </div>
          <TextArea
            name="details"
            label="প্রয়োজনের বিবরণ"
            required
            rows={7}
            maxLength={4000}
            hint="পরিবারের অবস্থা, কত টাকা বা কী ধরনের সহায়তা দরকার এবং কবের মধ্যে। অন্তত ৪০ অক্ষর।"
            errors={errors}
          />
          <TextArea name="references" label="রেফারেন্স" rows={3} maxLength={600} hint="আপনাকে চেনেন এমন শিক্ষক বা দায়িত্বশীলের নাম ও মোবাইল।" errors={errors} />
          <Consent errors={errors}>
            আমার দেওয়া তথ্য সঠিক। আবেদন যাচাইয়ের জন্য দায়িত্বপ্রাপ্ত পর্যালোচকেরা এই তথ্য দেখবেন, এতে সম্মতি দিচ্ছি।{' '}
            <Link href="/privacy" className="font-semibold text-primary underline" target="_blank">
              গোপনীয়তা নীতি
            </Link>
          </Consent>
        </>
      )}
    </FormShell>
  )
}
