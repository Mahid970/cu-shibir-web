'use client'

import Link from 'next/link'

import { ArrowRight, CheckCircle } from '@/components/ui/Icons'
import { FACULTIES, HALLS, NON_RESIDENT, type Option } from '@/lib/campus'
import { submitSupporter } from '@/lib/forms/actions'
import { SUPPORTER_INTERESTS } from '@/lib/forms/options'

import { Choices, Consent, Select, TextArea, TextField } from './fields'
import { FormShell } from './FormShell'

export function SupporterForm({ sessions }: { sessions: Option[] }) {
  return (
    <FormShell
      action={submitSupporter}
      submitLabel="ফরম জমা দিন"
      success={() => (
        <div className="py-6 text-center">
          <CheckCircle className="mx-auto size-16 text-success" />
          <h2 className="mt-4 text-[1.7rem] font-bold text-ink">জাযাকাল্লাহু খাইরান!</h2>
          <p className="mx-auto mt-3 max-w-md text-[1.05rem] leading-relaxed text-muted">
            ফরমটি জমা হয়েছে। তোমার বিভাগ বা হলের দায়িত্বশীল শীঘ্রই যোগাযোগ করবেন।
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/news" className="btn btn-outline-blue btn-sm">
              সর্বশেষ সংবাদ
            </Link>
            <Link href="/about" className="btn btn-gradient btn-sm">
              আমাদের সম্পর্কে জানো
              <ArrowRight />
            </Link>
          </div>
        </div>
      )}
    >
      {({ errors }) => (
        <>
          <TextField name="name" label="পূর্ণ নাম" required autoComplete="name" maxLength={100} errors={errors} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="mobile" label="মোবাইল নম্বর" required type="tel" inputMode="tel" autoComplete="tel" placeholder="০১XXXXXXXXX" errors={errors} />
            <TextField name="email" label="ইমেইল" type="email" autoComplete="email" errors={errors} />
          </div>
          <TextField name="facebook" label="ফেসবুক প্রোফাইলের লিংক" type="url" inputMode="url" placeholder="https://facebook.com/…" errors={errors} />
          <Select
            name="department"
            label="বিভাগ"
            required
            groups={FACULTIES.map((f) => ({ label: f.label, options: f.departments }))}
            errors={errors}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Select name="session" label="শিক্ষাবর্ষ" required options={sessions} errors={errors} />
            <Select name="hall" label="হল" options={[...HALLS, NON_RESIDENT]} errors={errors} />
          </div>
          <Choices name="interests" type="checkbox" label="কোন কাজে যুক্ত হতে চাও?" options={SUPPORTER_INTERESTS} errors={errors} />
          <TextArea name="note" label="আমাদের কিছু বলতে চাও?" maxLength={1000} rows={4} errors={errors} />
          <Consent errors={errors}>
            আমার দেওয়া তথ্য চবি ছাত্রশিবিরের দায়িত্বপ্রাপ্তরা শুধু যোগাযোগের জন্য ব্যবহার করবেন, এতে সম্মতি দিচ্ছি।{' '}
            <Link href="/privacy" className="font-semibold text-primary underline" target="_blank">
              গোপনীয়তা নীতি
            </Link>
          </Consent>
        </>
      )}
    </FormShell>
  )
}
