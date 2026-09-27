'use server'

import { copy, toLocale } from '@/i18n/config'
import { DEPARTMENTS } from '@/lib/campus'
import { getPayloadClient } from '@/lib/cms'
import { randomCode } from '@/lib/crypto'
import { notifyStaff } from '@/lib/notify/telegram'
import { courseCode, EXAMS, LEVELS, MAX_PAPER_BYTES } from '@/lib/services/questions'
import { SITE } from '@/lib/site'
import type { QuestionPaper } from '@/payload-types'

import { guard } from './guard'
import { LANG_NAME } from './names'
import type { FormState } from './state'
import { adminLink } from './tracking'
import { Checker, cleanText } from './validate'

type Department = QuestionPaper['department']
const DEPT_VALUES = DEPARTMENTS.map((d) => d.value as Department)

const T = copy(
  {
    fix: 'কিছু তথ্য ঠিক করতে হবে। লাল চিহ্নিত ঘরগুলো দেখুন।',
    failed: 'জমা দেওয়া যায়নি। একটু পরে আবার চেষ্টা করুন, অথবা ইমেইল করুন: ' + SITE.email,
    file: 'প্রশ্নপত্রের PDF বা ছবি (JPG, PNG, WebP) দিন।',
    big: 'ফাইলটি ১০ MB-এর বেশি। ছোট করে বা PDF করে দিন।',
    year: (max: string) => `১৯৯০ থেকে ${max}-এর মধ্যে পরীক্ষার সাল লিখুন।`,
    own: 'নিশ্চিত করুন যে এটি আগের পরীক্ষার প্রশ্ন বা আপনার নিজের তৈরি।',
    label: { department: 'বিভাগ', course: 'কোর্স কোড', title: 'কোর্সের নাম', exam: 'পরীক্ষা', level: 'বর্ষ' },
  },
  {
    fix: 'Some details need fixing. Check the fields marked in red.',
    failed: 'This could not be submitted. Please try again in a little while, or email us: ' + SITE.email,
    file: 'Attach the paper as a PDF or a photo (JPG, PNG, WebP).',
    big: 'The file is larger than 10 MB. Make it smaller or save it as a PDF.',
    year: (max: string) => `Enter an exam year between 1990 and ${max}.`,
    own: 'Please confirm this is a past exam paper or your own work.',
    label: { department: 'the department', course: 'the course code', title: 'the course title', exam: 'the exam', level: 'the year of study' },
  },
)

/** What the file's first bytes say it is; the browser's MIME type alone is not trusted. */
function sniff(head: Uint8Array): { mime: string; ext: string } | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...head.slice(from, to))
  if (ascii(0, 5) === '%PDF-') return { mime: 'application/pdf', ext: 'pdf' }
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' }
  if (head[0] === 0x89 && ascii(1, 4) === 'PNG') return { mime: 'image/png', ext: 'png' }
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return { mime: 'image/webp', ext: 'webp' }
  return null
}

export async function submitPaper(_prev: FormState, data: FormData): Promise<FormState> {
  const lang = toLocale(data.get(LANG_NAME))
  const t = T[lang]
  const g = await guard('paper', data, { limit: 5 })
  if (!g.ok) return g.silent ? { status: 'success' } : { status: 'error', message: g.message }

  const c = new Checker(data, lang)
  const department = c.choice('department', DEPT_VALUES, { required: true, label: t.label.department })
  const code = c.text('courseCode', { required: true, min: 2, max: 20, label: t.label.course })
  const courseTitle = c.text('courseTitle', { max: 150, label: t.label.title })
  const exam = c.choice('exam', EXAMS.map((e) => e.value), { required: true, label: t.label.exam })
  const level = c.choice('level', LEVELS.map((l) => l.value), { label: t.label.level })
  const thisYear = new Date().getFullYear()
  const examYear = Number(cleanText(data.get('examYear'), 4))
  if (!Number.isInteger(examYear) || examYear < 1990 || examYear > thisYear) c.errors.examYear = t.year(lang === 'bn' ? String(thisYear).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]) : String(thisYear))
  c.checked('own', { required: true, message: t.own })

  const file = data.get('file')
  let upload: { data: Buffer; mimetype: string; name: string; size: number } | null = null
  if (!(file instanceof File) || file.size === 0) c.errors.file = t.file
  else if (file.size > MAX_PAPER_BYTES) c.errors.file = t.big
  else {
    const bytes = Buffer.from(await file.arrayBuffer())
    const kind = sniff(bytes.subarray(0, 16))
    if (!kind) c.errors.file = t.file
    // A neutral file name: never the uploader's own (it may carry their name).
    else upload = { data: bytes, mimetype: kind.mime, size: bytes.length, name: `${courseCode(code || 'paper').replace(/\s/g, '-').toLowerCase()}-${examYear || 'x'}-${randomCode(6).toLowerCase()}.${kind.ext}` }
  }
  if (!c.ok || !upload) return { status: 'error', message: t.fix, errors: c.errors }

  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'question-papers',
      overrideAccess: true,
      data: { department: department!, courseCode: code, courseTitle: courseTitle || undefined, examYear, exam: exam!, level: level ?? undefined, status: 'pending' },
      file: upload,
    })
    await notifyStaff(`প্রশ্ন ব্যাংকে নতুন প্রশ্নপত্র যাচাইয়ের অপেক্ষায়: ${doc.courseCode} (${examYear})\n${adminLink('question-papers', doc.id)}`)
    return { status: 'success' }
  } catch (err) {
    // Payload also checks that a PDF or image is intact; a broken one is the visitor's to fix.
    const fileError = (err as { data?: { errors?: { path?: string }[] } }).data?.errors?.some((e) => e.path === 'file')
    if (fileError) return { status: 'error', message: t.fix, errors: { file: t.file } }
    console.error('[paper] save failed', err)
    return { status: 'error', message: t.failed }
  }
}
