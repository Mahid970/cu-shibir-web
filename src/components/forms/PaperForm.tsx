'use client'

import { ArrowRight, CheckCircle } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'
import { FACULTIES, localizeOptions, optionLabel } from '@/lib/campus'
import { choices } from '@/lib/forms/options'
import { submitPaper } from '@/lib/forms/paperActions'
import { EXAMS, LEVELS, PAPER_TYPES } from '@/lib/services/questions'

import { Choices, Consent, Select, TextField } from './fields'
import { FormShell } from './FormShell'

const T = copy(
  {
    submit: 'প্রশ্নপত্র পাঠান',
    sent: 'ধন্যবাদ! প্রশ্নপত্রটি পৌঁছেছে',
    sentText: 'যাচাই শেষে এটি প্রশ্ন ব্যাংকে সবার জন্য খোলা হবে। সাধারণত কয়েক দিন লাগে।',
    more: 'আরেকটি পাঠান',
    browse: 'প্রশ্ন ব্যাংক দেখুন',
    department: 'বিভাগ',
    course: 'কোর্স কোড',
    courseHint: 'যেমন CSE 211 বা BAN 101',
    title: 'কোর্সের নাম',
    year: 'পরীক্ষার সাল',
    exam: 'কোন পরীক্ষা',
    level: 'বর্ষ',
    file: 'প্রশ্নপত্র (PDF বা ছবি)',
    fileHint: 'সর্বোচ্চ ১০ MB। ছবি হলে পুরো পাতা যেন স্পষ্ট পড়া যায়। একাধিক পাতা থাকলে PDF করে দিন।',
    own: 'এটি আগের কোনো পরীক্ষার প্রশ্নপত্র বা আমার নিজের তৈরি নোট; কোনো বই বা অন্যের কপিরাইটযুক্ত লেখা নয়। এতে কারও নাম, রোল বা ফোন নম্বর নেই।',
  },
  {
    submit: 'Send the paper',
    sent: 'Thank you! The paper has arrived',
    sentText: 'Once checked, it will be open to everyone in the question bank. This usually takes a few days.',
    more: 'Send another',
    browse: 'Browse the question bank',
    department: 'Department',
    course: 'Course code',
    courseHint: 'For example CSE 211 or BAN 101',
    title: 'Course title',
    year: 'Exam year',
    exam: 'Which exam',
    level: 'Year of study',
    file: 'The paper (PDF or photo)',
    fileHint: 'Up to 10 MB. For a photo, make sure the whole page is readable. For several pages, send a PDF.',
    own: 'This is a past exam paper or notes I made myself, not a book or anyone else’s copyrighted work. It has no one’s name, roll number or phone number on it.',
  },
)

export function PaperForm() {
  const lang = useLang()
  const t = T[lang]
  return (
    <FormShell
      action={submitPaper}
      submitLabel={t.submit}
      success={() => (
        <div className="py-6 text-center">
          <CheckCircle className="mx-auto size-16 text-success" />
          <h2 className="mt-4 text-[1.7rem] font-bold text-ink">{t.sent}</h2>
          <p className="mx-auto mt-3 max-w-md text-[1.05rem] leading-relaxed text-muted">{t.sentText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="" className="btn btn-outline btn-sm">
              {t.more}
            </a>
            <Link href="/services/questions" className="btn btn-outline-blue btn-sm">
              {t.browse}
              <ArrowRight />
            </Link>
          </div>
        </div>
      )}
    >
      {({ errors }) => (
        <>
          <Select
            name="department"
            label={t.department}
            required
            groups={FACULTIES.map((f) => ({ label: optionLabel(f, lang), options: localizeOptions(f.departments, lang) }))}
            errors={errors}
          />
          <div className="grid gap-6 sm:grid-cols-[1fr_2fr]">
            <TextField name="courseCode" label={t.course} required maxLength={20} placeholder="CSE 211" hint={t.courseHint} autoCapitalize="characters" errors={errors} />
            <TextField name="courseTitle" label={t.title} maxLength={150} errors={errors} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="examYear" label={t.year} required type="number" inputMode="numeric" min={1990} max={new Date().getFullYear()} placeholder="2025" errors={errors} />
            <Select name="level" label={t.level} options={choices(LEVELS, lang)} errors={errors} />
          </div>
          <Choices name="exam" label={t.exam} options={choices(EXAMS, lang)} required defaultValue="final" errors={errors} />
          <TextField name="file" label={t.file} required type="file" accept={PAPER_TYPES.join(',')} hint={t.fileHint} className="[&_input]:py-2.5" errors={errors} />
          <Consent name="own" errors={errors}>
            {t.own}
          </Consent>
        </>
      )}
    </FormShell>
  )
}
