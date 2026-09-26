'use client'

import { ArrowRight, CheckCircle } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'
import { FACULTIES, HALLS, localizeOptions, NON_RESIDENT, optionLabel } from '@/lib/campus'
import { submitSupporter } from '@/lib/forms/actions'
import { choices, SUPPORTER_INTERESTS } from '@/lib/forms/options'

import { Choices, Consent, Select, TextArea, TextField } from './fields'
import { FormShell } from './FormShell'

const T = copy(
  {
    submit: 'ফরম জমা দিন',
    thanks: 'জাযাকাল্লাহু খাইরান!',
    done: 'ফরমটি জমা হয়েছে। তোমার বিভাগ বা হলের দায়িত্বশীল শীঘ্রই যোগাযোগ করবেন।',
    news: 'সর্বশেষ সংবাদ',
    about: 'আমাদের সম্পর্কে জানো',
    name: 'পূর্ণ নাম',
    mobile: 'মোবাইল নম্বর',
    mobileHint: '০১XXXXXXXXX',
    email: 'ইমেইল',
    facebook: 'ফেসবুক প্রোফাইলের লিংক',
    department: 'বিভাগ',
    session: 'শিক্ষাবর্ষ',
    hall: 'হল',
    interests: 'কোন কাজে যুক্ত হতে চাও?',
    note: 'আমাদের কিছু বলতে চাও?',
    consent: 'আমার দেওয়া তথ্য চবি ছাত্রশিবিরের দায়িত্বপ্রাপ্তরা শুধু যোগাযোগের জন্য ব্যবহার করবেন, এতে সম্মতি দিচ্ছি।',
    privacy: 'গোপনীয়তা নীতি',
  },
  {
    submit: 'Submit the form',
    thanks: 'JazakAllahu khairan!',
    done: 'Your form has been submitted. The leader in your department or hall will contact you soon.',
    news: 'Latest news',
    about: 'Learn about us',
    name: 'Full name',
    mobile: 'Mobile number',
    mobileHint: '01XXXXXXXXX',
    email: 'Email',
    facebook: 'Link to your Facebook profile',
    department: 'Department',
    session: 'Session',
    hall: 'Hall',
    interests: 'What would you like to help with?',
    note: 'Anything you would like to tell us?',
    consent: 'I agree that the people responsible at CU Chhatrashibir will use this information only to contact me.',
    privacy: 'Privacy policy',
  },
)

export function SupporterForm({ sessions }: { sessions: { value: string; label: string }[] }) {
  const lang = useLang()
  const t = T[lang]
  return (
    <FormShell
      action={submitSupporter}
      submitLabel={t.submit}
      success={() => (
        <div className="py-6 text-center">
          <CheckCircle className="mx-auto size-16 text-success" />
          <h2 className="mt-4 text-[1.7rem] font-bold text-ink">{t.thanks}</h2>
          <p className="mx-auto mt-3 max-w-md text-[1.05rem] leading-relaxed text-muted">{t.done}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/news" className="btn btn-outline-blue btn-sm">
              {t.news}
            </Link>
            <Link href="/about" className="btn btn-gradient btn-sm">
              {t.about}
              <ArrowRight />
            </Link>
          </div>
        </div>
      )}
    >
      {({ errors }) => (
        <>
          <TextField name="name" label={t.name} required autoComplete="name" maxLength={100} errors={errors} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="mobile" label={t.mobile} required type="tel" inputMode="tel" autoComplete="tel" placeholder={t.mobileHint} errors={errors} />
            <TextField name="email" label={t.email} type="email" autoComplete="email" errors={errors} />
          </div>
          <TextField name="facebook" label={t.facebook} type="url" inputMode="url" placeholder="https://facebook.com/…" errors={errors} />
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
          <Choices name="interests" type="checkbox" label={t.interests} options={choices(SUPPORTER_INTERESTS, lang)} errors={errors} />
          <TextArea name="note" label={t.note} maxLength={1000} rows={4} errors={errors} />
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
