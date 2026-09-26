'use client'

import { useSyncExternalStore } from 'react'

import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { useLang } from '@/i18n/LangProvider'

const T = copy(
  {
    done: (label: string) => `পড়া শেষ: ${label}`,
    progress: 'অগ্রগতি',
    mine: 'আমার অগ্রগতি',
    read: (done: string, all: string) => `${done} / ${all} পড়া হয়েছে`,
    bar: 'পড়ার অগ্রগতি',
    local: 'অগ্রগতি শুধু এই ফোন বা কম্পিউটারে সংরক্ষিত থাকে। কোনো অ্যাকাউন্ট লাগে না।',
  },
  {
    done: (label: string) => `Finished reading: ${label}`,
    progress: 'Progress',
    mine: 'My progress',
    read: (done: string, all: string) => `${done} of ${all} read`,
    bar: 'Reading progress',
    local: 'Progress is saved only on this phone or computer, and shared by the Bangla and English pages. No account needed.',
  },
)

/**
 * Reading progress lives only on this device (localStorage), no account needed. Every checkbox and
 * counter subscribes to the same tiny store, so ticking one item updates the totals at once.
 */
const KEY = 'syllabus-progress-v1'
const EVENT = 'syllabus-progress'

function read(): Record<string, true> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Record<string, true>
  } catch {
    return {}
  }
}

let snapshot = ''
function getSnapshot() {
  try {
    snapshot = localStorage.getItem(KEY) || '{}'
  } catch {
    snapshot = '{}'
  }
  return snapshot
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(EVENT, onChange)
  }
}

function useProgress(): Record<string, true> {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => '{}')
  try {
    return JSON.parse(raw) as Record<string, true>
  } catch {
    return {}
  }
}

function toggle(id: string, done: boolean) {
  const next = read()
  if (done) next[id] = true
  else delete next[id]
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Private mode or storage full: the tick still shows until the page is left.
  }
  window.dispatchEvent(new Event(EVENT))
}

export function ProgressCheck({ id, label }: { id: string; label: string }) {
  const done = Boolean(useProgress()[id])
  const t = T[useLang()]
  return (
    <input
      type="checkbox"
      checked={done}
      onChange={(e) => toggle(id, e.target.checked)}
      aria-label={t.done(label)}
      className="mt-1 size-5 shrink-0 cursor-pointer accent-[#35b252]"
    />
  )
}

/** "১২ / ৪০ পড়া হয়েছে" with a bar; `ids` are all checklist items of the level. */
export function LevelProgress({ ids, compact = false }: { ids: string[]; compact?: boolean }) {
  const progress = useProgress()
  const lang = useLang()
  const t = T[lang]
  const done = ids.filter((id) => progress[id]).length
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0
  return (
    <div className={compact ? '' : 'rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgb(11_15_46/0.06)]'}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold text-ink">{compact ? t.progress : t.mine}</p>
        <p className="text-[0.92rem] text-muted" aria-live="polite">
          {t.read(num(lang, done), num(lang, ids.length))}
        </p>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-pale-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t.bar}>
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#7ef7a8,#2fce55)] transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      {!compact && (
        <p className="mt-3 text-[0.85rem] text-subtle">{t.local}</p>
      )}
    </div>
  )
}
