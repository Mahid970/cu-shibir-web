'use server'

import { DEPARTMENTS, HALLS, NON_RESIDENT } from '@/lib/campus'
import { getPayloadClient } from '@/lib/cms'
import { blindIndex, hashSecret, randomCode, verifySecret } from '@/lib/crypto'
import { notifyStaff } from '@/lib/notify/telegram'
import { SITE } from '@/lib/site'
import type { Supporter } from '@/payload-types'

import { guard } from './guard'
import { ASSISTANCE_STATUSES, ASSISTANCE_TYPES, FEEDBACK_KINDS, SUPPORTER_INTERESTS } from './options'
import type { FormState } from './state'
import { Checker, cleanText, isHttpUrl } from './validate'

type Department = Supporter['department']
type Hall = NonNullable<Supporter['hall']>
const DEPT_VALUES = DEPARTMENTS.map((d) => d.value as Department)
const HALL_VALUES = [...HALLS, NON_RESIDENT].map((h) => h.value as Hall)
const SESSION_RE = /^(19|20)\d{2}-\d{2}$/

const FIX_ERRORS = 'কিছু তথ্য ঠিক করতে হবে। লাল চিহ্নিত ঘরগুলো দেখুন।'
const FAILED = 'জমা দেওয়া যায়নি। একটু পরে আবার চেষ্টা করুন, অথবা ইমেইল করুন: ' + SITE.email

function session(c: Checker) {
  const value = c.text('session', { label: 'শিক্ষাবর্ষ', max: 7 })
  if (!value) c.errors.session = 'শিক্ষাবর্ষ বেছে নিন।'
  else if (!SESSION_RE.test(value)) c.errors.session = 'শিক্ষাবর্ষ তালিকা থেকে বেছে নিন।'
  return value
}

const adminLink = (collection: string, id: number | string) => `${SITE.url}/admin/collections/${collection}/${id}`

// ---------------------------------------------------------------------------
// সমর্থক ফরম
// ---------------------------------------------------------------------------

export async function submitSupporter(_prev: FormState, data: FormData): Promise<FormState> {
  const g = await guard('supporter', data)
  if (!g.ok) return g.silent ? { status: 'success' } : { status: 'error', message: g.message }

  const c = new Checker(data)
  const name = c.text('name', { required: true, min: 3, max: 100, label: 'নাম' })
  const mobile = c.phone('mobile', { required: true })
  const email = c.email('email')
  const facebook = c.text('facebook', { max: 200, label: 'ফেসবুক লিংক' })
  if (facebook && !isHttpUrl(facebook)) c.errors.facebook = 'পুরো লিংক দিন, যেমন https://facebook.com/…'
  const department = c.choice('department', DEPT_VALUES, { required: true, label: 'বিভাগ' })
  const sess = session(c)
  const hall = c.choice('hall', HALL_VALUES, { label: 'হল' })
  const interests = c.many('interests', SUPPORTER_INTERESTS.map((i) => i.value))
  const note = c.text('note', { max: 1000, label: 'বার্তা' })
  c.checked('consent', { required: true, message: 'তথ্য সংরক্ষণে সম্মতি দিন।' })
  if (!c.ok) return { status: 'error', message: FIX_ERRORS, errors: c.errors }

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
    return { status: 'error', message: FAILED }
  }
}

// ---------------------------------------------------------------------------
// এহতেসাব ও পরামর্শ
// ---------------------------------------------------------------------------

export async function submitFeedback(_prev: FormState, data: FormData): Promise<FormState> {
  const g = await guard('feedback', data)
  if (!g.ok) return g.silent ? { status: 'success' } : { status: 'error', message: g.message }

  const c = new Checker(data)
  const kind = c.choice('kind', FEEDBACK_KINDS.map((k) => k.value), { required: true, label: 'ধরন' })
  const subject = c.text('subject', { required: true, min: 4, max: 150, label: 'বিষয়' })
  const message = c.text('message', { required: true, min: 20, max: 4000, label: 'বার্তা' })
  const anonymous = c.checked('anonymous', { message: '' })
  const name = anonymous ? '' : c.text('name', { max: 100, label: 'নাম' })
  const contact = anonymous ? '' : c.text('contact', { max: 200, label: 'যোগাযোগ' })
  const aboutSlug = cleanText(data.get('about'), 120)
  if (!c.ok) return { status: 'error', message: FIX_ERRORS, errors: c.errors }

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
    return { status: 'error', message: FAILED }
  }
}

// ---------------------------------------------------------------------------
// শিক্ষাবৃত্তি ও চিকিৎসা সহায়তা
// ---------------------------------------------------------------------------

export async function submitAssistance(_prev: FormState, data: FormData): Promise<FormState> {
  const g = await guard('assistance', data, { limit: 3 })
  if (!g.ok) return g.silent ? { status: 'error', message: FAILED } : { status: 'error', message: g.message }

  const c = new Checker(data)
  const type = c.choice('type', ASSISTANCE_TYPES.map((t) => t.value), { required: true, label: 'আবেদনের ধরন' })
  const subject = type === 'other' ? c.text('subject', { required: true, min: 4, max: 150, label: 'বিষয়' }) : ''
  const name = c.text('name', { required: true, min: 3, max: 100, label: 'নাম' })
  const mobile = c.phone('mobile', { required: true })
  const registration = c.text('registration', { max: 40, label: 'রেজিস্ট্রেশন নম্বর' })
  const department = c.choice('department', DEPT_VALUES, { required: true, label: 'বিভাগ' })
  const sess = session(c)
  const hall = c.choice('hall', HALL_VALUES, { label: 'হল' })
  const details = c.text('details', { required: true, min: 40, max: 4000, label: 'প্রয়োজনের বিবরণ' })
  const references = c.text('references', { max: 600, label: 'রেফারেন্স' })
  c.checked('consent', { required: true, message: 'তথ্য সংরক্ষণে সম্মতি দিন।' })
  if (!c.ok) return { status: 'error', message: FIX_ERRORS, errors: c.errors }

  try {
    const payload = await getPayloadClient()
    const code = randomCode(6)
    // Retry on the (unlikely) tracking id collision.
    for (let attempt = 0; attempt < 3; attempt++) {
      const trackingId = `CU-${randomCode(6)}`
      try {
        const doc = await payload.create({
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
            secretHash: hashSecret(code),
            mobileHash: blindIndex(mobile),
          },
        })
        await notifyStaff(`নতুন সহায়তার আবেদন: ${trackingId}\n${adminLink('assistance', doc.id)}`)
        return { status: 'success', tracking: { id: trackingId, code } }
      } catch (err) {
        if (attempt === 2 || !String(err).includes('unique')) throw err
      }
    }
    return { status: 'error', message: FAILED }
  } catch (err) {
    console.error('[assistance] save failed', err)
    return { status: 'error', message: FAILED }
  }
}

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

export async function trackAssistance(_prev: TrackResult, data: FormData): Promise<TrackResult> {
  const id = cleanText(data.get('trackingId'), 20).toUpperCase().replace(/\s/g, '')
  const code = cleanText(data.get('code'), 20).toUpperCase().replace(/\s/g, '')
  if (!/^CU-[A-Z0-9]{6}$/.test(id) || code.length !== 6) {
    return { status: 'error', message: 'ট্র্যাকিং আইডি (যেমন CU-7K3P9Q) ও ৬ অক্ষরের গোপন কোড সঠিকভাবে লিখুন।' }
  }
  const g = await guard('track', data, { limit: 10, minFillMs: 0 })
  if (!g.ok) return { status: 'error', message: g.message || 'একটু পরে আবার চেষ্টা করুন।' }

  const notFound = { status: 'error' as const, message: 'এই আইডি ও কোডে কোনো আবেদন পাওয়া যায়নি। অক্ষরগুলো আবার মিলিয়ে দেখুন।' }
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'assistance',
    where: { trackingId: { equals: id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    showHiddenFields: true,
    select: { trackingId: true, type: true, status: true, statusHistory: true, publicNote: true, secretHash: true, createdAt: true },
  })
  const doc = docs[0]
  if (!doc || !verifySecret(code, doc.secretHash)) return notFound

  const history = (Array.isArray(doc.statusHistory) ? doc.statusHistory : []) as { status: string; at: string }[]
  const at = (s: string) => [...history].reverse().find((h) => h.status === s)?.at
  // Only one final state is shown: approved or declined.
  const flow = ASSISTANCE_STATUSES.filter((s) => (doc.status === 'declined' ? s.value !== 'approved' : s.value !== 'declined'))
  const reached = flow.findIndex((s) => s.value === doc.status)
  return {
    status: 'found',
    trackingId: doc.trackingId,
    type: ASSISTANCE_TYPES.find((t) => t.value === doc.type)?.label ?? doc.type,
    current: doc.status,
    steps: flow.map((s, i) => ({ value: s.value, label: s.label.bn, at: at(s.value), done: i <= reached })),
    note: doc.publicNote,
    submittedAt: doc.createdAt,
  }
}
