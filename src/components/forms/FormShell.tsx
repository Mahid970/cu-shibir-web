'use client'

import Script from 'next/script'
import { useActionState, useEffect, useRef, startTransition, type ReactNode } from 'react'

import { ArrowRight, Lock } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { HONEYPOT_NAME, LANG_NAME, STARTED_NAME } from '@/lib/forms/names'
import { initialFormState, type FormState } from '@/lib/forms/state'

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const T = copy(
  { website: 'ওয়েবসাইট', encrypted: 'তথ্য এনক্রিপ্ট করে সংরক্ষিত হয়।', sending: 'জমা হচ্ছে…' },
  { website: 'Website', encrypted: 'Your details are stored encrypted.', sending: 'Submitting…' },
)

/**
 * Wraps a public form: anti-bot fields, optional Turnstile, pending state, an error summary that
 * takes focus, and the success view. Fields keep what the visitor typed when the server says no.
 */
export function FormShell({
  action,
  submitLabel,
  children,
  success,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>
  submitLabel: string
  children: (state: FormState) => ReactNode
  success: (state: FormState) => ReactNode
}) {
  const lang = useLang()
  const t = T[lang]
  const [state, formAction, pending] = useActionState(action, initialFormState)
  const started = useRef<HTMLInputElement>(null)
  const summary = useRef<HTMLDivElement>(null)
  const done = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (started.current) started.current.value = String(Date.now())
  }, [])

  useEffect(() => {
    if (state.status === 'error') summary.current?.focus()
    if (state.status === 'success') done.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div ref={done} tabIndex={-1} className="outline-none" role="status">
        {success(state)}
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => formAction(data))
      }}
      className="grid gap-6"
    >
      {state.status === 'error' && state.message && (
        <div ref={summary} tabIndex={-1} role="alert" className="rounded-2xl border border-crimson/25 bg-[#fff1f1] p-4 font-semibold text-crimson outline-none">
          {state.message}
        </div>
      )}

      {children(state)}

      {/* Not shown to people. Bots that fill every field are ignored. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {t.website}
          <input type="text" name={HONEYPOT_NAME} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={started} type="hidden" name={STARTED_NAME} />
      <input type="hidden" name={LANG_NAME} value={lang} />

      {TURNSTILE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} data-language={lang} />
        </>
      )}

      <div className="flex flex-col items-start gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[0.92rem] text-subtle">
          <Lock className="size-4 shrink-0" />
          {t.encrypted}
        </p>
        <button type="submit" disabled={pending} className="btn btn-gradient disabled:opacity-60">
          {pending ? t.sending : submitLabel}
          {!pending && <ArrowRight />}
        </button>
      </div>
    </form>
  )
}
