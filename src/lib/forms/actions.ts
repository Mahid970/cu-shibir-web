'use server'

import { copy, toLocale, type Locale } from '@/i18n/config'
import { DEPARTMENTS, HALLS, NON_RESIDENT } from '@/lib/campus'
import { getPayloadClient } from '@/lib/cms'
import { blindIndex, hashSecret, randomCode, verifySecret } from '@/lib/crypto'
import { notifyStaff } from '@/lib/notify/telegram'
import { SITE } from '@/lib/site'
import type { Supporter } from '@/payload-types'

import { guard } from './guard'
import { LANG_NAME } from './names'
import {
  ASSISTANCE_STATUSES,
  ASSISTANCE_TYPES,
  CONFIDENTIAL_CATEGORY,
  FEEDBACK_KINDS,
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
  SUPPORTER_INTERESTS,
} from './options'
import type { FormState } from './state'
import { Checker, cleanText, isHttpUrl } from './validate'

type Department = Supporter['department']
type Hall = NonNullable<Supporter['hall']>
const DEPT_VALUES = DEPARTMENTS.map((d) => d.value as Department)
const HALL_VALUES = [...HALLS, NON_RESIDENT].map((h) => h.value as Hall)
const SESSION_RE = /^(19|20)\d{2}-\d{2}$/

/** Messages and field names as they appear in the error texts, in the page's language. */
const T = copy(
  {
    fix: 'কিছু তথ্য ঠিক করতে হবে। লাল চিহ্নিত ঘরগুলো দেখুন।',
    failed: 'জমা দেওয়া যায়নি। একটু পরে আবার চেষ্টা করুন, অথবা ইমেইল করুন: ' + SITE.email,
    consent: 'তথ্য সংরক্ষণে সম্মতি দিন।',
    facebookUrl: 'পুরো লিংক দিন, যেমন https://facebook.com/…',
    sessionChoose: 'শিক্ষাবর্ষ বেছে নিন।',
    sessionList: 'শিক্ষাবর্ষ তালিকা থেকে বেছে নিন।',
    trackFormat: 'ট্র্যাকিং আইডি (যেমন CU-7K3P9Q) ও ৬ অক্ষরের গোপন কোড সঠিকভাবে লিখুন।',
    later: 'একটু পরে আবার চেষ্টা করুন।',
    notFound: 'এই আইডি ও কোডে কোনো আবেদন পাওয়া যায়নি। অক্ষরগুলো আবার মিলিয়ে দেখুন।',
    trackFormatIssue: 'ট্র্যাকিং আইডি (যেমন IS-7K3P9Q) ও ৬ অক্ষরের গোপন কোড সঠিকভাবে লিখুন।',
    notFoundIssue: 'এই আইডি ও কোডে কোনো সমস্যা পাওয়া যায়নি। অক্ষরগুলো আবার মিলিয়ে দেখুন।',
    label: {
      name: 'নাম',
      facebook: 'ফেসবুক লিংক',
      department: 'বিভাগ',
      session: 'শিক্ষাবর্ষ',
      hall: 'হল',
      note: 'বার্তা',
      kind: 'ধরন',
      subject: 'বিষয়',
      message: 'বার্তা',
      contact: 'যোগাযোগ',
      type: 'আবেদনের ধরন',
      registration: 'রেজিস্ট্রেশন নম্বর',
      details: 'প্রয়োজনের বিবরণ',
      references: 'রেফারেন্স',
      category: 'সমস্যার বিষয়',
      problem: 'সংক্ষেপে সমস্যা',
      problemDetails: 'বিস্তারিত',
      place: 'কোথায়',
    },
  },
  {
    fix: 'Some details need fixing. Check the fields marked in red.',
    failed: 'This could not be submitted. Please try again in a little while, or email us: ' + SITE.email,
    consent: 'Please agree to us storing this information.',
    facebookUrl: 'Enter the full link, for example https://facebook.com/…',
    sessionChoose: 'Please choose your session.',
    sessionList: 'Please choose your session from the list.',
    trackFormat: 'Enter the tracking ID (for example CU-7K3P9Q) and the 6-character secret code exactly.',
    later: 'Please try again in a little while.',
    notFound: 'No application matches this ID and code. Check the characters again.',
    trackFormatIssue: 'Enter the tracking ID (for example IS-7K3P9Q) and the 6-character secret code exactly.',
    notFoundIssue: 'No report matches this ID and code. Check the characters again.',
    label: {
      name: 'your name',
      facebook: 'the Facebook link',
      department: 'your department',
      session: 'your session',
      hall: 'your hall',
      note: 'your message',
      kind: 'what you are sending',
      subject: 'the subject',
      message: 'your message',
      contact: 'where to reply',
      type: 'what you are applying for',
      registration: 'the registration number',
      details: 'the description of your need',
      references: 'the references',
      category: 'what the problem is about',
      problem: 'the problem in brief',
      problemDetails: 'the details',
      place: 'where it happens',
    },
  },
)

const langOf = (data: FormData): Locale => toLocale(data.get(LANG_NAME))

function session(c: Checker, t: (typeof T)[Locale]) {
  const value = c.text('session', { label: t.label.session, max: 7 })
  if (!value) c.errors.session = t.sessionChoose
  else if (!SESSION_RE.test(value)) c.errors.session = t.sessionList
  return value
}

const adminLink = (collection: string, id: number | string) => `${SITE.url}/admin/collections/${collection}/${id}`

/**
 * Save a submission under a fresh public tracking id (PREFIX-XXXXXX) and a 6-character secret code
 * that is stored only as a hash. Retries on the (unlikely) id collision.
 */
async function withTracking<D extends { id: number | string }>(prefix: string, create: (trackingId: string, secretHash: string) => Promise<D>) {
  const code = randomCode(6)
  for (let attempt = 0; ; attempt++) {
    const trackingId = `${prefix}-${randomCode(6)}`
    try {
      return { doc: await create(trackingId, hashSecret(code)), trackingId, code }
    } catch (err) {
      if (attempt === 2 || !String(err).includes('unique')) throw err
    }
  }
}

// ---------------------------------------------------------------------------
// সমর্থক ফরম
// ---------------------------------------------------------------------------

export async function submitSupporter(_prev: FormState, data: FormData): Promise<FormState> {
  const g = await guard('supporter', data)
  if (!g.ok) return g.silent ? { status: 'success' } : { status: 'error', message: g.message }

  const lang = langOf(data)
  const t = T[lang]
  const c = new Checker(data, lang)
  const name = c.text('name', { required: true, min: 3, max: 100, label: t.label.name })
  const mobile = c.phone('mobile', { required: true })
  const email = c.email('email')
  const facebook = c.text('facebook', { max: 200, label: t.label.facebook })
  if (facebook && !isHttpUrl(facebook)) c.errors.facebook = t.facebookUrl
  const department = c.choice('department', DEPT_VALUES, { required: true, label: t.label.department })
  const sess = session(c, t)
  const hall = c.choice('hall', HALL_VALUES, { label: t.label.hall })
  const interests = c.many('interests', SUPPORTER_INTERESTS.map((i) => i.value))
  const note = c.text('note', { max: 1000, label: t.label.note })
  c.checked('consent', { required: true, message: t.consent })
  if (!c.ok) return { status: 'error', message: t.fix, errors: c.errors }

  try {
    const payload = await getPayloadClient()
    const mobileHash = blindIndex(mobile)
    // The same number twice within 30 days: don't store a duplicate, but don't reveal it either.
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
    const { totalDocs } = await payload.count({
      collection: 'supporters',
      where: { and: [{ mobileHash: { equals: mobileHash } }, { createdAt: { greater_than: since } }] },
      overrideAccess: true,
    })
    if (totalDocs === 0) {
      const doc = await payload.create({
        collection: 'supporters',
        overrideAccess: true,
        data: {
          name,
          mobile,
          email: email || undefined,
          facebook: facebook || undefined,
          department: department!,
          session: sess,
          hall: hall ?? undefined,
          interests: interests as never,
          note: note || undefined,
          status: 'new',
          consentAt: new Date().toISOString(),
          mobileHash,
        },
      })
      await notifyStaff(`নতুন সমর্থক ফরম জমা পড়েছে।\n${adminLink('supporters', doc.id)}`)
    }
    return { status: 'success' }
  } catch (err) {
    console.error('[supporter] save failed', err)
    return { status: 'error', message: t.failed }
  }
}

// ---------------------------------------------------------------------------
// এহতেসাব ও পরামর্শ
// ---------------------------------------------------------------------------

export async function submitFeedback(_prev: FormState, data: FormData): Promise<FormState> {
  const g = await guard('feedback', data)
  if (!g.ok) return g.silent ? { status: 'success' } : { status: 'error', message: g.message }

  const lang = langOf(data)
  const t = T[lang]
  const c = new Checker(data, lang)
  const kind = c.choice('kind', FEEDBACK_KINDS.map((k) => k.value), { required: true, label: t.label.kind })
  const subject = c.text('subject', { required: true, min: 4, max: 150, label: t.label.subject })
  const message = c.text('message', { required: true, min: 20, max: 4000, label: t.label.message })
  const anonymous = c.checked('anonymous', { message: '' })
  const name = anonymous ? '' : c.text('name', { max: 100, label: t.label.name })
  const contact = anonymous ? '' : c.text('contact', { max: 200, label: t.label.contact })
  const aboutSlug = cleanText(data.get('about'), 120)
  if (!c.ok) return { status: 'error', message: t.fix, errors: c.errors }

  try {
    const payload = await getPayloadClient()
    let about: number | undefined
    if (aboutSlug) {
      const { docs } = await payload.find({
        collection: 'people',
        where: { and: [{ slug: { equals: aboutSlug } }, { _status: { equals: 'published' } }] },
        limit: 1,
        depth: 0,
        select: { slug: true },
      })
      about = docs[0]?.id
    }
    const doc = await payload.create({
      collection: 'feedback',
      overrideAccess: true,
      data: {
        kind: kind!,
        subject,
        message,
        anonymous,
        name: name || undefined,
        contact: contact || undefined,
        about,
        status: 'new',
      },
    })
    await notifyStaff(`নতুন ${FEEDBACK_KINDS.find((k) => k.value === kind)?.label ?? 'বার্তা'} এসেছে।\n${adminLink('feedback', doc.id)}`)
    return { status: 'success' }
  } catch (err) {
    console.error('[feedback] save failed', err)
    return { status: 'error', message: t.failed }
  }
}

// ---------------------------------------------------------------------------
// শিক্ষাবৃত্তি ও চিকিৎসা সহায়তা
// ---------------------------------------------------------------------------

export async function submitAssistance(_prev: FormState, data: FormData): Promise<FormState> {
  const lang = langOf(data)
  const t = T[lang]
  const g = await guard('assistance', data, { limit: 3 })
  if (!g.ok) return g.silent ? { status: 'error', message: t.failed } : { status: 'error', message: g.message }

  const c = new Checker(data, lang)
  const type = c.choice('type', ASSISTANCE_TYPES.map((a) => a.value), { required: true, label: t.label.type })
  const subject = type === 'other' ? c.text('subject', { required: true, min: 4, max: 150, label: t.label.subject }) : ''
  const name = c.text('name', { required: true, min: 3, max: 100, label: t.label.name })
  const mobile = c.phone('mobile', { required: true })
  const registration = c.text('registration', { max: 40, label: t.label.registration })
  const department = c.choice('department', DEPT_VALUES, { required: true, label: t.label.department })
  const sess = session(c, t)
  const hall = c.choice('hall', HALL_VALUES, { label: t.label.hall })
  const details = c.text('details', { required: true, min: 40, max: 4000, label: t.label.details })
  const references = c.text('references', { max: 600, label: t.label.references })
  c.checked('consent', { required: true, message: t.consent })
  if (!c.ok) return { status: 'error', message: t.fix, errors: c.errors }

  try {
    const payload = await getPayloadClient()
    const { doc, trackingId, code } = await withTracking('CU', (trackingId, secretHash) =>
      payload.create({
        collection: 'assistance',
        overrideAccess: true,
        data: {
          trackingId,
          type: type!,
          subject: subject || undefined,
          name,
          mobile,
          registration: registration || undefined,
          department: department!,
          session: sess,
          hall: hall ?? undefined,
          details,
          references: references || undefined,
          status: 'submitted',
          secretHash,
          mobileHash: blindIndex(mobile),
        },
      }),
    )
    await notifyStaff(`নতুন সহায়তার আবেদন: ${trackingId}\n${adminLink('assistance', doc.id)}`)
    return { status: 'success', tracking: { id: trackingId, code } }
  } catch (err) {
    console.error('[assistance] save failed', err)
    return { status: 'error', message: t.failed }
  }
}

// ---------------------------------------------------------------------------
// ছাত্র সমস্যা ডেস্ক
// ---------------------------------------------------------------------------

const ISSUE_VALUES = ISSUE_CATEGORIES.map((c) => c.value)

export async function submitIssue(_prev: FormState, data: FormData): Promise<FormState> {
  const lang = langOf(data)
  const t = T[lang]
  const g = await guard('issue', data, { limit: 3 })
  if (!g.ok) return g.silent ? { status: 'error', message: t.failed } : { status: 'error', message: g.message }

  const c = new Checker(data, lang)
  const category = c.choice('category', ISSUE_VALUES, { required: true, label: t.label.category })
  const hall = c.choice('hall', HALL_VALUES, { label: t.label.hall })
  const subject = c.text('subject', { required: true, min: 6, max: 150, label: t.label.problem })
  const details = c.text('details', { required: true, min: 30, max: 4000, label: t.label.problemDetails })
  const place = c.text('place', { max: 150, label: t.label.place })
  const anonymous = c.checked('anonymous', { message: '' })
  const name = anonymous ? '' : c.text('name', { max: 100, label: t.label.name })
  const contact = anonymous ? '' : c.text('contact', { max: 200, label: t.label.contact })
  c.checked('consent', { required: true, message: t.consent })
  if (!c.ok) return { status: 'error', message: t.fix, errors: c.errors }

  try {
    const payload = await getPayloadClient()
    const { doc, trackingId, code } = await withTracking('IS', (trackingId, secretHash) =>
      payload.create({
        collection: 'issues',
        overrideAccess: true,
        data: {
          trackingId,
          category: category!,
          hall: hall ?? undefined,
          subject,
          details,
          place: place || undefined,
          anonymous,
          name: name || undefined,
          contact: contact || undefined,
          status: 'received',
          secretHash,
        },
      }),
    )
    // The staff group may include people outside the harassment desk: say only that something came in.
    const what = category === CONFIDENTIAL_CATEGORY ? 'নতুন গোপনীয় অভিযোগ (হয়রানি ডেস্ক)' : `নতুন ছাত্র সমস্যা: ${trackingId}`
    await notifyStaff(`${what}\n${adminLink('issues', doc.id)}`)
    return { status: 'success', tracking: { id: trackingId, code } }
  } catch (err) {
    console.error('[issue] save failed', err)
    return { status: 'error', message: t.failed }
  }
}

// ---------------------------------------------------------------------------
// Tracking pages
// ---------------------------------------------------------------------------

export type TrackResult =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | {
      status: 'found'
      trackingId: string
      type: string
      current: string
      steps: { value: string; label: string; at?: string; done: boolean }[]
      note?: string | null
      submittedAt: string
    }

type Tracked = { trackingId: string; status: string; statusHistory?: unknown; publicNote?: string | null; secretHash?: string | null; createdAt: string }

/** Reads the id and code, checks the guard, and loads the record if the code matches. */
async function lookup<D extends Tracked>(
  data: FormData,
  prefix: 'CU' | 'IS',
  messages: { format: string; notFound: string; later: string },
  find: (trackingId: string) => Promise<D | undefined>,
): Promise<{ doc: D } | { error: string }> {
  const id = cleanText(data.get('trackingId'), 20).toUpperCase().replace(/\s/g, '')
  const code = cleanText(data.get('code'), 20).toUpperCase().replace(/\s/g, '')
  if (!new RegExp(`^${prefix}-[A-Z0-9]{6}$`).test(id) || code.length !== 6) return { error: messages.format }
  const g = await guard('track', data, { limit: 10, minFillMs: 0 })
  if (!g.ok) return { error: g.message || messages.later }
  const doc = await find(id)
  if (!doc || !verifySecret(code, doc.secretHash)) return { error: messages.notFound }
  return { doc }
}

/**
 * The applicant's timeline: every step up to the current one is done. Only one of the two final
 * states is shown (approved or declined, resolved or closed).
 */
function timeline(
  doc: Tracked,
  lang: Locale,
  statuses: readonly { value: string; label: Record<Locale, string> }[],
  finals: [ok: string, no: string],
  current = doc.status,
) {
  const history = (Array.isArray(doc.statusHistory) ? doc.statusHistory : []) as { status: string; at: string }[]
  const at = (s: string) => [...history].reverse().find((h) => h.status === s)?.at
  const flow = statuses.filter((s) => (current === finals[1] ? s.value !== finals[0] : s.value !== finals[1]))
  const reached = flow.findIndex((s) => s.value === current)
  return flow.map((s, i) => ({ value: s.value, label: s.label[lang], at: at(s.value), done: i <= reached }))
}

export async function trackAssistance(_prev: TrackResult, data: FormData): Promise<TrackResult> {
  const lang = langOf(data)
  const t = T[lang]
  const found = await lookup(data, 'CU', { format: t.trackFormat, notFound: t.notFound, later: t.later }, async (trackingId) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'assistance',
      where: { trackingId: { equals: trackingId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      showHiddenFields: true,
      select: { trackingId: true, type: true, status: true, statusHistory: true, publicNote: true, secretHash: true, createdAt: true },
    })
    return docs[0]
  })
  if ('error' in found) return { status: 'error', message: found.error }
  const { doc } = found
  const typeOption = ASSISTANCE_TYPES.find((a) => a.value === doc.type)
  return {
    status: 'found',
    trackingId: doc.trackingId,
    type: typeOption ? (lang === 'en' ? typeOption.en : typeOption.label) : doc.type,
    current: doc.status,
    steps: timeline(doc, lang, ASSISTANCE_STATUSES, ['approved', 'declined']),
    note: doc.publicNote,
    submittedAt: doc.createdAt,
  }
}

export async function trackIssue(_prev: TrackResult, data: FormData): Promise<TrackResult> {
  const lang = langOf(data)
  const t = T[lang]
  const found = await lookup(data, 'IS', { format: t.trackFormatIssue, notFound: t.notFoundIssue, later: t.later }, async (trackingId) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'issues',
      where: { trackingId: { equals: trackingId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      showHiddenFields: true,
      select: { trackingId: true, category: true, status: true, statusHistory: true, publicNote: true, secretHash: true, createdAt: true },
    })
    return docs[0]
  })
  if ('error' in found) return { status: 'error', message: found.error }
  const { doc } = found
  // Spam is only a desk label; the student sees the report as closed.
  const current = doc.status === 'spam' ? 'closed' : doc.status
  const category = ISSUE_CATEGORIES.find((c) => c.value === doc.category)
  return {
    status: 'found',
    trackingId: doc.trackingId,
    type: category ? (lang === 'en' ? category.en : category.label) : doc.category,
    current,
    steps: timeline(doc, lang, ISSUE_STATUSES, ['resolved', 'closed'], current),
    note: doc.publicNote,
    submittedAt: doc.createdAt,
  }
}
