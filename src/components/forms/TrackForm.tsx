'use client'

import { startTransition, useActionState, useEffect, useRef } from 'react'

import { CheckCircle, Clock, Search } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { date } from '@/i18n/format'
import { useLang } from '@/i18n/LangProvider'
import { trackAssistance, type TrackResult } from '@/lib/forms/actions'
import { HONEYPOT_NAME, LANG_NAME, STARTED_NAME } from '@/lib/forms/names'

import { TextField } from './fields'

const idle: TrackResult = { status: 'idle' }

const T = copy(
  {
    trackingId: 'ট্র্যাকিং আইডি',
    code: 'গোপন কোড',
    codeHint: '৬ অক্ষর',
    searching: 'খুঁজছি…',
    check: 'দেখুন',
    submitted: (type: string, when: string) => `${type}, জমা দেওয়া হয়েছে ${when}`,
    now: 'এখন',
    note: 'পর্যালোচকের বার্তা',
  },
  {
    trackingId: 'Tracking ID',
    code: 'Secret code',
    codeHint: '6 characters',
    searching: 'Searching…',
    check: 'Check',
    submitted: (type: string, when: string) => `${type}, submitted on ${when}`,
    now: 'Now',
    note: 'Message from the reviewer',
  },
)

/** Applicant enters tracking id + secret code and sees where the application stands. */
export function TrackForm() {
  const lang = useLang()
  const t = T[lang]
  const [result, action, pending] = useActionState(trackAssistance, idle)
  const started = useRef<HTMLInputElement>(null)
  const out = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (started.current) started.current.value = String(Date.now())
  }, [])
  useEffect(() => {
    if (result.status !== 'idle') out.current?.focus()
  }, [result])

  return (
    <div className="grid gap-8">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          startTransition(() => action(data))
        }}
        className="grid gap-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <TextField name="trackingId" label={t.trackingId} required placeholder="CU-XXXXXX" autoCapitalize="characters" autoComplete="off" spellCheck={false} />
        <TextField name="code" label={t.code} required placeholder={t.codeHint} autoCapitalize="characters" autoComplete="off" spellCheck={false} maxLength={6} />
        <input ref={started} type="hidden" name={STARTED_NAME} />
        <input type="hidden" name={LANG_NAME} value={lang} />
        <input type="text" name={HONEYPOT_NAME} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
        <button type="submit" disabled={pending} className="btn btn-gradient h-12 disabled:opacity-60">
          <Search className="size-5" />
          {pending ? t.searching : t.check}
        </button>
      </form>

      <div ref={out} tabIndex={-1} aria-live="polite" className="outline-none">
        {result.status === 'error' && (
          <p role="alert" className="rounded-2xl border border-crimson/25 bg-[#fff1f1] p-4 font-semibold text-crimson">
            {result.message}
          </p>
        )}
        {result.status === 'found' && (
          <div className="rounded-3xl bg-pale p-6 md:p-8">
            <p className="text-[0.95rem] text-subtle">
              {t.submitted(result.type, date(lang, result.submittedAt))}
            </p>
            <p className="mt-1 font-[family-name:var(--font-en)] text-[1.5rem] font-bold text-ink">{result.trackingId}</p>
            <ol className="mt-6 grid gap-0">
              {result.steps.map((s, i) => {
                const current = s.value === result.current
                return (
                  <li key={s.value} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < result.steps.length - 1 && (
                      <span aria-hidden="true" className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${s.done ? 'bg-success' : 'bg-pale-4'}`} />
                    )}
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full ${
                        s.done ? (s.value === 'declined' ? 'bg-crimson text-white' : 'bg-success text-white') : 'bg-white text-subtle ring-2 ring-pale-4'
                      }`}
                    >
                      {s.done ? <CheckCircle className="size-5" /> : <Clock className="size-4" />}
                    </span>
                    <span className="pt-1">
                      <span className={`block font-semibold ${current ? 'text-ink' : s.done ? 'text-ink/80' : 'text-subtle'}`}>
                        {s.label}
                        {current && <span className="chip ml-2 align-middle">{t.now}</span>}
                      </span>
                      {s.at && <span className="text-[0.88rem] text-subtle">{date(lang, s.at, 'datetime')}</span>}
                    </span>
                  </li>
                )
              })}
            </ol>
            {result.note && (
              <div className="mt-6 rounded-2xl bg-white p-5">
                <p className="text-[0.9rem] font-semibold text-primary">{t.note}</p>
                <p className="mt-1 whitespace-pre-line leading-relaxed text-ink">{result.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
