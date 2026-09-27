'use client'

import { useState } from 'react'

import { ArrowRight, CheckCircle } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { Link } from '@/i18n/link'

const T = copy(
  {
    copied: 'কপি হয়েছে',
    copy: 'কপি করুন',
    keep: 'নিচের আইডি ও কোড দিয়ে যেকোনো সময় অবস্থা দেখতে পারবেন। কোডটি আর কখনো দেখানো হবে না, তাই এখনই লিখে বা স্ক্রিনশট নিয়ে রাখুন।',
    trackingId: 'ট্র্যাকিং আইডি',
    code: 'গোপন কোড',
    status: 'অবস্থা দেখুন',
  },
  {
    copied: 'Copied',
    copy: 'Copy',
    keep: 'Use the ID and code below to check where it stands at any time. The code will never be shown again, so write it down or take a screenshot now.',
    trackingId: 'Tracking ID',
    code: 'Secret code',
    status: 'Check status',
  },
)

function CopyButton({ text, labels }: { text: string; labels: { copy: string; copied: string } }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard?.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="btn btn-outline btn-sm"
    >
      {copied ? labels.copied : labels.copy}
    </button>
  )
}

/** Shown once after a tracked submission: the public id and the secret code, to note down. */
export function TrackingTicket({ ticket, title, statusHref }: { ticket: { id: string; code: string }; title: string; statusHref: string }) {
  const t = T[useLang()]
  const both = `${t.trackingId}: ${ticket.id}\n${t.code}: ${ticket.code}`
  return (
    <div className="py-4">
      <div className="text-center">
        <CheckCircle className="mx-auto size-16 text-success" />
        <h2 className="mt-4 text-[1.7rem] font-bold text-ink">{title}</h2>
        <p className="mx-auto mt-3 max-w-lg text-[1.05rem] leading-relaxed text-muted">{t.keep}</p>
      </div>
      <dl className="mx-auto mt-8 grid max-w-md gap-3 rounded-2xl border-2 border-dashed border-blue/40 bg-pale p-6 text-center">
        <div>
          <dt className="text-[0.9rem] text-subtle">{t.trackingId}</dt>
          <dd className="font-[family-name:var(--font-en)] text-[1.8rem] font-bold tracking-wider text-ink">{ticket.id}</dd>
        </div>
        <div>
          <dt className="text-[0.9rem] text-subtle">{t.code}</dt>
          <dd className="font-[family-name:var(--font-en)] text-[1.8rem] font-bold tracking-[0.3em] text-primary">{ticket.code}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <CopyButton text={both} labels={t} />
        <Link href={statusHref} className="btn btn-gradient btn-sm">
          {t.status}
          <ArrowRight />
        </Link>
      </div>
    </div>
  )
}
