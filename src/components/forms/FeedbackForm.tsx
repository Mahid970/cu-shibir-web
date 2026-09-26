'use client'

import Link from 'next/link'
import { useState } from 'react'

import { CheckCircle } from '@/components/ui/Icons'
import { submitFeedback } from '@/lib/forms/actions'
import { FEEDBACK_KINDS } from '@/lib/forms/options'

import { Choices, Select, TextArea, TextField } from './fields'
import { FormShell } from './FormShell'

export function FeedbackForm({ people, to }: { people: { value: string; label: string }[]; to?: string }) {
  const [anonymous, setAnonymous] = useState(false)
  return (
    <FormShell
      action={submitFeedback}
      submitLabel="পাঠিয়ে দিন"
      success={() => (
        <div className="py-6 text-center">
          <CheckCircle className="mx-auto size-16 text-success" />
          <h2 className="mt-4 text-[1.7rem] font-bold text-ink">বার্তাটি পৌঁছেছে</h2>
          <p className="mx-auto mt-3 max-w-md text-[1.05rem] leading-relaxed text-muted">
            সংশ্লিষ্ট দায়িত্বশীল বিষয়টি দেখবেন। উত্তরের ঠিকানা দিয়ে থাকলে সেখানেই জানানো হবে।
          </p>
          <Link href="/" className="btn btn-outline-blue btn-sm mt-8">
            হোমে ফিরে যান
          </Link>
        </div>
      )}
    >
      {({ errors }) => (
        <>
          <Choices name="kind" label="কী পাঠাতে চান?" options={FEEDBACK_KINDS} required defaultValue="advice" errors={errors} />
          <Select
            name="about"
            label="কার উদ্দেশে"
            options={people}
            defaultValue={to ?? ''}
            placeholder="পুরো শাখার উদ্দেশে"
            hint="নির্দিষ্ট দায়িত্বশীলকে বলতে চাইলে বেছে নিন।"
            errors={errors}
          />
          <TextField name="subject" label="বিষয়" required maxLength={150} errors={errors} />
          <TextArea name="message" label="বিস্তারিত" required maxLength={4000} rows={7} hint="অন্তত ২০ অক্ষর। যত নির্দিষ্ট করে লিখবেন, তত দ্রুত ব্যবস্থা নেওয়া যাবে।" errors={errors} />

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-pale p-4">
            <input type="checkbox" name="anonymous" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="mt-1 size-5 shrink-0 accent-[#0052d8]" />
            <span>
              <span className="block font-semibold text-ink">নাম ছাড়া পাঠাতে চাই</span>
              <span className="text-[0.92rem] text-muted">তখন আপনার নাম বা যোগাযোগের কোনো তথ্য রাখা হবে না, তাই উত্তরও দেওয়া যাবে না।</span>
            </span>
          </label>

          {!anonymous && (
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField name="name" label="আপনার নাম" autoComplete="name" maxLength={100} errors={errors} />
              <TextField name="contact" label="উত্তর কোথায় দেব" placeholder="মোবাইল বা ইমেইল" maxLength={200} errors={errors} />
            </div>
          )}
        </>
      )}
    </FormShell>
  )
}
