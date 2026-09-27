'use server'

import { copy, toLocale, type Locale } from '@/i18n/config'
import { DEPARTMENTS, HALLS, NON_RESIDENT } from '@/lib/campus'
import { getPayloadClient } from '@/lib/cms'
import { blindIndex, verifySecret } from '@/lib/crypto'
import { notifyStaff } from '@/lib/notify/telegram'
import { DONATION_GAP_DAYS, donorsFor, GROUP_OPTIONS, GROUP_VALUES, groupOf } from '@/lib/services/blood'
import { SITE } from '@/lib/site'
import type { BloodDonor } from '@/payload-types'

import { guard } from './guard'
import { LANG_NAME } from './names'
import type { FormState } from './state'
import { adminLink, withTracking } from './tracking'
import { Checker, cleanText } from './validate'

type Group = BloodDonor['bloodGroup']
type Department = NonNullable<BloodDonor['department']>
type Hall = NonNullable<BloodDonor['hall']>
const GROUPS = GROUP_OPTIONS.map((g) => g.value as Group)
const DEPT_VALUES = DEPARTMENTS.map((d) => d.value as Department)
const HALL_VALUES = [...HALLS, NON_RESIDENT].map((h) => h.value as Hall)
const DAY = 86_400_000

const T = copy(
  {
    fix: 'কিছু তথ্য ঠিক করতে হবে। লাল চিহ্নিত ঘরগুলো দেখুন।',
    failed: 'জমা দেওয়া যায়নি। একটু পরে আবার চেষ্টা করুন, অথবা ইমেইল করুন: ' + SITE.email,
    consent: 'তথ্য সংরক্ষণে সম্মতি দিন।',
    date: 'সঠিক তারিখ দিন, আজকের পরের নয়।',
    neededBy: 'কখনের মধ্যে রক্ত দরকার, সঠিক তারিখ ও সময় দিন।',
    units: '১ থেকে ১০ ব্যাগের মধ্যে লিখুন।',
    idFormat: 'দাতা আইডি (যেমন BD-7K3P9Q) ও ৬ অক্ষরের গোপন কোড সঠিকভাবে লিখুন।',
    notFound: 'এই আইডি ও কোডে কোনো দাতা পাওয়া যায়নি। অক্ষরগুলো আবার মিলিয়ে দেখুন।',
    chooseAction: 'কী করতে চান, বেছে নিন।',
    done: {
      donated: (d: string) => `ধন্যবাদ! আজকের রক্তদান লেখা হলো। ${d} থেকে আবার দিতে পারবেন, তার আগে আপনাকে ডাকা হবে না।`,
      pause: 'বিরতি চালু হলো। আবার চালু না করা পর্যন্ত আপনাকে ডাকা হবে না।',
      resume: 'আবার চালু হলো। প্রয়োজনে সমন্বয়কেরা আপনাকে ফোন করবেন।',
      leave: 'আপনার নাম, নম্বর ও সব তথ্য তালিকা থেকে মুছে ফেলা হয়েছে।',
    },
    label: { name: 'নাম', group: 'রক্তের গ্রুপ', department: 'বিভাগ', hall: 'হল', hospital: 'হাসপাতালের নাম', patient: 'রোগী সম্পর্কে' },
  },
  {
    fix: 'Some details need fixing. Check the fields marked in red.',
    failed: 'This could not be submitted. Please try again in a little while, or email us: ' + SITE.email,
    consent: 'Please agree to us storing this information.',
    date: 'Enter a real date, not later than today.',
    neededBy: 'Enter the date and time the blood is needed by.',
    units: 'Enter between 1 and 10 bags.',
    idFormat: 'Enter the donor ID (for example BD-7K3P9Q) and the 6-character secret code exactly.',
    notFound: 'No donor matches this ID and code. Check the characters again.',
    chooseAction: 'Choose what you want to do.',
    done: {
      donated: (d: string) => `Thank you! Today’s donation is noted. You can give again from ${d}, and nobody will call you before then.`,
      pause: 'You are paused. Nobody will call you until you turn it back on.',
      resume: 'You are back on the list. Coordinators will call you when your blood is needed.',
      leave: 'Your name, number and everything else have been removed from the list.',
    },
    label: { name: 'your name', group: 'your blood group', department: 'your department', hall: 'your hall', hospital: 'the hospital', patient: 'the note about the patient' },
  },
)

const langOf = (data: FormData): Locale => toLocale(data.get(LANG_NAME))

/** YYYY-MM-DD from a date input, as noon UTC (the CMS's "day only" convention); not in the future. */
function pastDate(value: FormDataEntryValue | null): string | null | false {
  const raw = cleanText(value, 10)
  if (!raw) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false
  const at = Date.parse(`${raw}T12:00:00Z`)
  if (Number.isNaN(at) || at > Date.now() + DAY || at < Date.now() - 20 * 365 * DAY) return false
  return new Date(at).toISOString()
}

const today = () => `${new Date(Date.now() + 6 * 3600_000).toISOString().slice(0, 10)}T12:00:00.000Z`

// ---------------------------------------------------------------------------
// রক্তদাতা হিসেবে নিবন্ধন
// ---------------------------------------------------------------------------

export async function submitDonor(_prev: FormState, data: FormData): Promise<FormState> {
  const lang = langOf(data)
  const t = T[lang]
  const g = await guard('donor', data, { limit: 3 })
  if (!g.ok) return g.silent ? { status: 'error', message: t.failed } : { status: 'error', message: g.message }

  const c = new Checker(data, lang)
  const name = c.text('name', { required: true, min: 3, max: 100, label: t.label.name })
  const mobile = c.phone('mobile', { required: true })
  const bloodGroup = c.choice('bloodGroup', GROUPS, { required: true, label: t.label.group })
  const department = c.choice('department', DEPT_VALUES, { label: t.label.department })
  const hall = c.choice('hall', HALL_VALUES, { label: t.label.hall })
  const last = pastDate(data.get('lastDonation'))
  if (last === false) c.errors.lastDonation = t.date
  c.checked('consent', { required: true, message: t.consent })
  if (!c.ok) return { status: 'error', message: t.fix, errors: c.errors }

  try {
    const payload = await getPayloadClient()
    const mobileHash = blindIndex(mobile)
    // Registering twice is allowed (the code may be lost); the coordinators see the earlier entry.
    const { docs: earlier } = await payload.find({
      collection: 'blood-donors',
      where: { mobileHash: { equals: mobileHash } },
      limit: 3,
      depth: 0,
      overrideAccess: true,
      select: { donorId: true },
    })
    const { doc, trackingId, code } = await withTracking('BD', (donorId, secretHash) =>
      payload.create({
        collection: 'blood-donors',
        overrideAccess: true,
        data: {
          donorId,
          name,
          mobile,
          bloodGroup: bloodGroup!,
          department: department ?? undefined,
          hall: hall ?? undefined,
          lastDonation: last || undefined,
          available: true,
          consentAt: new Date().toISOString(),
          coordinatorNote: earlier.length ? `একই নম্বরে আগের নিবন্ধন: ${earlier.map((d) => d.donorId).join(', ')}` : undefined,
          secretHash,
          mobileHash,
        },
      }),
    )
    await notifyStaff(`নতুন রক্তদাতা (${groupOf(bloodGroup!)}): ${trackingId}\n${adminLink('blood-donors', doc.id)}`)
    return { status: 'success', tracking: { id: trackingId, code } }
  } catch (err) {
    console.error('[donor] save failed', err)
    return { status: 'error', message: t.failed }
  }
}

// ---------------------------------------------------------------------------
// রক্তের অনুরোধ
// ---------------------------------------------------------------------------

export async function submitBloodRequest(_prev: FormState, data: FormData): Promise<FormState> {
  const lang = langOf(data)
  const t = T[lang]
  const g = await guard('blood-request', data, { limit: 3 })
  if (!g.ok) return g.silent ? { status: 'success' } : { status: 'error', message: g.message }

  const c = new Checker(data, lang)
  const bloodGroup = c.choice('bloodGroup', GROUPS, { required: true, label: t.label.group })
  const units = Number(cleanText(data.get('units'), 3) || '1')
  if (!Number.isInteger(units) || units < 1 || units > 10) c.errors.units = t.units
  const hospital = c.text('hospital', { required: true, min: 3, max: 150, label: t.label.hospital })
  // A datetime-local value is the requester's clock, which is Chattogram time.
  const neededRaw = cleanText(data.get('neededBy'), 16)
  const neededAt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(neededRaw) ? Date.parse(`${neededRaw}:00+06:00`) : NaN
  if (Number.isNaN(neededAt) || neededAt < Date.now() - DAY || neededAt > Date.now() + 60 * DAY) c.errors.neededBy = t.neededBy
  const patientNote = c.text('patientNote', { max: 500, label: t.label.patient })
  const name = c.text('name', { required: true, min: 3, max: 100, label: t.label.name })
  const mobile = c.phone('mobile', { required: true })
  c.checked('consent', { required: true, message: t.consent })
  if (!c.ok) return { status: 'error', message: t.fix, errors: c.errors }

  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'blood-requests',
      overrideAccess: true,
      data: {
        bloodGroup: bloodGroup!,
        units,
        hospital,
        neededBy: new Date(neededAt).toISOString(),
        patientNote: patientNote || undefined,
        name,
        mobile,
        status: 'new',
      },
    })
    // Tell the coordinators how many willing, eligible donors could give, without naming anyone.
    const patient = groupOf(bloodGroup!)!
    const gapStart = new Date(Date.now() - DONATION_GAP_DAYS * DAY).toISOString()
    const { totalDocs } = await payload.count({
      collection: 'blood-donors',
      overrideAccess: true,
      where: {
        and: [
          { bloodGroup: { in: donorsFor(patient).map((g) => GROUP_VALUES[g]) } },
          { available: { equals: true } },
          { or: [{ lastDonation: { exists: false } }, { lastDonation: { less_than: gapStart } }] },
        ],
      },
    })
    await notifyStaff(`রক্ত দরকার: ${patient}, ${units} ব্যাগ, ${hospital}। দিতে পারেন এমন দাতা: ${totalDocs} জন।\n${adminLink('blood-requests', doc.id)}`)
    return { status: 'success' }
  } catch (err) {
    console.error('[blood-request] save failed', err)
    return { status: 'error', message: t.failed }
  }
}

// ---------------------------------------------------------------------------
// দাতার নিজের তথ্য
// ---------------------------------------------------------------------------

const ACTIONS = ['donated', 'pause', 'resume', 'leave'] as const

export async function manageDonor(_prev: FormState, data: FormData): Promise<FormState> {
  const lang = langOf(data)
  const t = T[lang]
  const id = cleanText(data.get('donorId'), 20).toUpperCase().replace(/\s/g, '')
  const code = cleanText(data.get('code'), 20).toUpperCase().replace(/\s/g, '')
  const action = cleanText(data.get('action'), 10) as (typeof ACTIONS)[number]
  if (!/^BD-[A-Z0-9]{6}$/.test(id) || code.length !== 6) return { status: 'error', message: t.idFormat }
  if (!ACTIONS.includes(action)) return { status: 'error', message: t.chooseAction }
  const g = await guard('donor-manage', data, { limit: 10, minFillMs: 0 })
  if (!g.ok) return { status: 'error', message: g.message || t.failed }

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blood-donors',
    where: { donorId: { equals: id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    showHiddenFields: true,
    select: { donorId: true, secretHash: true },
  })
  const donor = docs[0]
  if (!donor || !verifySecret(code, donor.secretHash)) return { status: 'error', message: t.notFound }

  try {
    if (action === 'leave') {
      await payload.delete({ collection: 'blood-donors', id: donor.id, overrideAccess: true })
      return { status: 'success', message: t.done.leave }
    }
    const change = action === 'donated' ? { lastDonation: today() } : { available: action === 'resume' }
    await payload.update({ collection: 'blood-donors', id: donor.id, overrideAccess: true, data: change })
    if (action === 'donated') {
      const again = new Date(Date.parse(today()) + DONATION_GAP_DAYS * DAY)
      const shown = new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(again)
      return { status: 'success', message: t.done.donated(shown) }
    }
    return { status: 'success', message: t.done[action] }
  } catch (err) {
    console.error('[donor-manage] failed', err)
    return { status: 'error', message: t.failed }
  }
}
