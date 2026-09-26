'use client'

import { startTransition, useActionState, useEffect, useRef } from 'react'

import { CheckCircle, Clock, Search } from '@/components/ui/Icons'
import { formatDate } from '@/lib/bn'
import { trackAssistance, type TrackResult } from '@/lib/forms/actions'
import { HONEYPOT_NAME, STARTED_NAME } from '@/lib/forms/names'

import { TextField } from './fields'

const idle: TrackResult = { status: 'idle' }

/** Applicant enters tracking id + secret code and sees where the application stands. */
export function TrackForm() {
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
        <TextField name="trackingId" label="ট্র্যাকিং আইডি" required placeholder="CU-XXXXXX" autoCapitalize="characters" autoComplete="off" spellCheck={false} />
        <TextField name="code" label="গোপন কোড" required placeholder="৬ অক্ষর" autoCapitalize="characters" autoComplete="off" spellCheck={false} maxLength={6} />
        <input ref={started} type="hidden" name={STARTED_NAME} />
        <input type="text" name={HONEYPOT_NAME} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
        <button type="submit" disabled={pending} className="btn btn-gradient h-12 disabled:opacity-60">
          <Search className="size-5" />
          {pending ? 'খুঁজছি…' : 'দেখুন'}
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
              {result.type}, জমা দেওয়া হয়েছে {formatDate(result.submittedAt)}
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
                        {current && <span className="chip ml-2 align-middle">এখন</span>}
                      </span>
                      {s.at && <span className="text-[0.88rem] text-subtle">{formatDate(s.at, { style: 'datetime' })}</span>}
                    </span>
                  </li>
                )
              })}
            </ol>
            {result.note && (
              <div className="mt-6 rounded-2xl bg-white p-5">
                <p className="text-[0.9rem] font-semibold text-primary">পর্যালোচকের বার্তা</p>
                <p className="mt-1 whitespace-pre-line leading-relaxed text-ink">{result.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
