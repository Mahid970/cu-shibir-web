'use client'

import { ArrowRight, CheckCircle } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'
import { FACULTIES, HALLS, localizeOptions, NON_RESIDENT, optionLabel } from '@/lib/campus'
import { manageDonor, submitBloodRequest, submitDonor } from '@/lib/forms/bloodActions'
import { GROUP_OPTIONS } from '@/lib/services/blood'

import { Choices, Consent, Select, TextArea, TextField } from './fields'
import { FormShell } from './FormShell'
import { TrackingTicket } from './TrackingTicket'

const T = copy(
  {
    group: 'রক্তের গ্রুপ',
    patientGroup: 'রোগীর রক্তের গ্রুপ',
    name: 'পূর্ণ নাম',
    mobile: 'মোবাইল নম্বর',
    mobileHint: '০১XXXXXXXXX',
    department: 'বিভাগ',
    hall: 'হল',
    last: 'শেষ কবে রক্ত দিয়েছেন',
    lastHint: 'মনে না থাকলে বা কখনো না দিয়ে থাকলে খালি রাখুন।',
    donorConsent: 'প্রয়োজনে রক্তদান সমন্বয়কেরা আমাকে ফোন করতে পারেন। আমার নম্বর কাউকে দেওয়া হবে না; রক্ত দেব কি না, সে সিদ্ধান্ত আমার।',
    join: 'দাতা হিসেবে নিবন্ধন করুন',
    joined: 'আপনি এখন রক্তদাতা তালিকায়',
    joinedText: 'এই আইডি ও কোড দিয়ে যেকোনো সময় রক্তদানের তারিখ লিখতে, বিরতি নিতে বা তালিকা থেকে নাম সরাতে পারবেন। কোডটি আর দেখানো হবে না, লিখে রাখুন।',
    manageLink: 'নিজের তথ্য',
    units: 'কত ব্যাগ',
    hospital: 'হাসপাতাল',
    hospitalHint: 'হাসপাতালের নাম ও ওয়ার্ড/বেড, যেমন “চমেক হাসপাতাল, ওয়ার্ড ১২”',
    neededBy: 'কখনের মধ্যে দরকার',
    patient: 'রোগী সম্পর্কে',
    patientHint: 'কেন রক্ত দরকার, যেমন অপারেশন বা থ্যালাসেমিয়া। নাম লেখার দরকার নেই।',
    requester: 'আপনার নাম',
    requestConsent: 'দাতা রাজি হলে সমন্বয়কেরা তাঁকে আমার নম্বর দিতে পারেন, আর আমার সাথে যোগাযোগ করতে পারেন।',
    request: 'অনুরোধ পাঠান',
    requested: 'অনুরোধ পৌঁছেছে',
    requestedText: 'সমন্বয়কেরা উপযুক্ত দাতাদের সাথে যোগাযোগ করে আপনাকে ফোন করবেন। খুব জরুরি হলে একই সঙ্গে হাসপাতালের ব্লাড ব্যাংকেও খোঁজ নিন।',
    donorId: 'দাতা আইডি',
    code: 'গোপন কোড',
    codeHint: '৬ অক্ষর',
    what: 'কী করতে চান?',
    actions: [
      { value: 'donated', label: 'আজ রক্ত দিয়েছি' },
      { value: 'pause', label: 'কিছুদিন বিরতি' },
      { value: 'resume', label: 'আবার চালু করুন' },
      { value: 'leave', label: 'তালিকা থেকে নাম সরান' },
    ],
    save: 'জমা দিন',
    saved: 'হয়ে গেছে',
    back: 'রক্তদাতা নেটওয়ার্কে ফিরুন',
    privacy: 'গোপনীয়তা নীতি',
  },
  {
    group: 'Blood group',
    patientGroup: 'Patient’s blood group',
    name: 'Full name',
    mobile: 'Mobile number',
    mobileHint: '01XXXXXXXXX',
    department: 'Department',
    hall: 'Hall',
    last: 'When did you last give blood?',
    lastHint: 'Leave it empty if you don’t remember or have never given.',
    donorConsent: 'The blood coordinators may call me when my blood is needed. My number will not be given to anyone, and whether I give blood is my decision.',
    join: 'Register as a donor',
    joined: 'You are on the donor list',
    joinedText: 'With this ID and code you can note a donation, take a break or leave the list at any time. The code will not be shown again, so write it down.',
    manageLink: 'Your details',
    units: 'Bags',
    hospital: 'Hospital',
    hospitalHint: 'The hospital and ward or bed, for example “CMC Hospital, ward 12”',
    neededBy: 'Needed by',
    patient: 'About the patient',
    patientHint: 'Why the blood is needed, for example surgery or thalassaemia. No need for a name.',
    requester: 'Your name',
    requestConsent: 'If a donor agrees, the coordinators may give them my number, and may call me.',
    request: 'Send the request',
    requested: 'Your request has arrived',
    requestedText: 'The coordinators will contact suitable donors and call you. If it is very urgent, ask the hospital’s blood bank at the same time.',
    donorId: 'Donor ID',
    code: 'Secret code',
    codeHint: '6 characters',
    what: 'What would you like to do?',
    actions: [
      { value: 'donated', label: 'I gave blood today' },
      { value: 'pause', label: 'Take a break' },
      { value: 'resume', label: 'Put me back on' },
      { value: 'leave', label: 'Remove me from the list' },
    ],
    save: 'Submit',
    saved: 'Done',
    back: 'Back to the blood donor network',
    privacy: 'Privacy policy',
  },
)

const groups = GROUP_OPTIONS.map((g) => ({ value: g.value, label: g.label }))

function Done({ title, text }: { title: string; text?: string }) {
  const t = T[useLang()]
  return (
    <div className="py-6 text-center">
      <CheckCircle className="mx-auto size-16 text-success" />
      <h2 className="mt-4 text-[1.7rem] font-bold text-ink">{title}</h2>
      {text && <p className="mx-auto mt-3 max-w-lg text-[1.05rem] leading-relaxed text-muted">{text}</p>}
      <Link href="/services/blood" className="btn btn-outline-blue btn-sm mt-8">
        {t.back}
        <ArrowRight />
      </Link>
    </div>
  )
}

export function DonorForm() {
  const lang = useLang()
  const t = T[lang]
  return (
    <FormShell
      action={submitDonor}
      submitLabel={t.join}
      success={(state) => (
        <TrackingTicket ticket={state.tracking!} title={t.joined} text={t.joinedText} statusHref="/services/blood/donor" linkLabel={t.manageLink} />
      )}
    >
      {({ errors }) => (
        <>
          <Choices name="bloodGroup" label={t.group} options={groups} required errors={errors} />
          <TextField name="name" label={t.name} required autoComplete="name" maxLength={100} errors={errors} />
          <TextField name="mobile" label={t.mobile} required type="tel" inputMode="tel" autoComplete="tel" placeholder={t.mobileHint} errors={errors} />
          <div className="grid gap-6 sm:grid-cols-2">
            <Select
              name="department"
              label={t.department}
              groups={FACULTIES.map((f) => ({ label: optionLabel(f, lang), options: localizeOptions(f.departments, lang) }))}
              errors={errors}
            />
            <Select name="hall" label={t.hall} options={localizeOptions([...HALLS, NON_RESIDENT], lang)} errors={errors} />
          </div>
          <TextField name="lastDonation" label={t.last} type="date" hint={t.lastHint} errors={errors} />
          <Consent errors={errors}>
            {t.donorConsent}{' '}
            <Link href="/privacy" className="font-semibold text-primary underline" target="_blank">
              {t.privacy}
            </Link>
          </Consent>
        </>
      )}
    </FormShell>
  )
}

export function BloodRequestForm() {
  const lang = useLang()
  const t = T[lang]
  return (
    <FormShell action={submitBloodRequest} submitLabel={t.request} success={() => <Done title={t.requested} text={t.requestedText} />}>
      {({ errors }) => (
        <>
          <Choices name="bloodGroup" label={t.patientGroup} options={groups} required errors={errors} />
          <div className="grid gap-6 sm:grid-cols-[1fr_2fr]">
            <TextField name="units" label={t.units} type="number" min={1} max={10} defaultValue={1} inputMode="numeric" required errors={errors} />
            <TextField name="neededBy" label={t.neededBy} type="datetime-local" required errors={errors} />
          </div>
          <TextField name="hospital" label={t.hospital} required maxLength={150} hint={t.hospitalHint} errors={errors} />
          <TextArea name="patientNote" label={t.patient} rows={3} maxLength={500} hint={t.patientHint} errors={errors} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="name" label={t.requester} required autoComplete="name" maxLength={100} errors={errors} />
            <TextField name="mobile" label={t.mobile} required type="tel" inputMode="tel" autoComplete="tel" placeholder={t.mobileHint} errors={errors} />
          </div>
          <Consent errors={errors}>
            {t.requestConsent}{' '}
            <Link href="/privacy" className="font-semibold text-primary underline" target="_blank">
              {t.privacy}
            </Link>
          </Consent>
        </>
      )}
    </FormShell>
  )
}

export function DonorManageForm() {
  const lang = useLang()
  const t = T[lang]
  return (
    <FormShell action={manageDonor} submitLabel={t.save} success={(state) => <Done title={t.saved} text={state.message} />}>
      {({ errors }) => (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="donorId" label={t.donorId} required placeholder="BD-XXXXXX" autoCapitalize="characters" autoComplete="off" spellCheck={false} errors={errors} />
            <TextField name="code" label={t.code} required placeholder={t.codeHint} autoCapitalize="characters" autoComplete="off" spellCheck={false} maxLength={6} errors={errors} />
          </div>
          <Choices name="action" label={t.what} options={t.actions} required errors={errors} />
        </>
      )}
    </FormShell>
  )
}
