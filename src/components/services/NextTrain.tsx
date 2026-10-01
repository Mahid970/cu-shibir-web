'use client'

import { useSyncExternalStore } from 'react'

import { copy } from '@/i18n/config'
import { num, time } from '@/i18n/format'
import { useLang } from '@/i18n/LangProvider'
import { clock, closureOn, DAY_NAMES, DAYS, dhakaNow, nextDepartures, type Departure, type Direction, type Timetable } from '@/lib/services/shuttle'

const T = copy(
  {
    heading: { 'to-campus': 'ক্যাম্পাসের দিকে', 'to-city': 'শহরের দিকে' },
    from: (station: string) => `${station} থেকে`,
    now: 'এখনই ছাড়ছে',
    in: (h: string, m: string) => (h ? `${h} ঘণ্টা ${m} মিনিট পর` : `${m} মিনিট পর`),
    tomorrow: 'আগামীকাল',
    reaches: (t: string) => `পৌঁছাবে আনুমানিক ${t}`,
    then: 'এরপর',
    none: 'আগামী এক সপ্তাহে কোনো ট্রেন নেই।',
    closed: 'আজ শাটল বন্ধ',
    checking: 'সময় দেখা হচ্ছে…',
  },
  {
    heading: { 'to-campus': 'To campus', 'to-city': 'To the city' },
    from: (station: string) => `from ${station}`,
    now: 'Leaving now',
    in: (h: string, m: string) => (h ? `in ${h} h ${m} min` : `in ${m} min`),
    tomorrow: 'Tomorrow',
    reaches: (t: string) => `arrives around ${t}`,
    then: 'Then',
    none: 'No trains in the coming week.',
    closed: 'No shuttle today',
    checking: 'Checking the time…',
  },
)

/** A clock that ticks every 30 s in the browser; the server renders without a time. */
const subscribe = (tick: () => void) => {
  const timer = setInterval(tick, 30_000)
  return () => clearInterval(timer)
}
const snapshot = () => Math.floor(Date.now() / 30_000) * 30_000
const serverSnapshot = () => null

type Props = { timetable: Timetable; journeyMinutes?: number | null; ends?: { city: string; campus: string } }

/**
 * The next train each way, counted down in Chattogram time. Worked out in the browser every
 * 30 seconds, so a page saved for offline use still shows the right train.
 */
export function NextTrain({ timetable, journeyMinutes, ends }: Props) {
  const lang = useLang()
  const t = T[lang]
  const stamp = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const now = stamp === null ? null : new Date(stamp)

  const today = now ? dhakaNow(now) : null
  const closed = today ? closureOn(timetable, today.date) : undefined

  const when = (d: Departure) => {
    if (d.dayOffset === 0) {
      if (d.minutesUntil === 0) return t.now
      const h = Math.floor(d.minutesUntil / 60)
      return t.in(h ? num(lang, h) : '', num(lang, d.minutesUntil % 60))
    }
    if (d.dayOffset === 1) return t.tomorrow
    return DAY_NAMES[lang][DAYS[(DAYS.indexOf(today!.day) + d.dayOffset) % 7]]
  }
  const arrival = (d: Departure) => {
    if (!journeyMinutes) return null
    const [h, m] = d.time.split(':').map(Number)
    const total = (h * 60 + m + journeyMinutes) % 1440
    return time(lang, clock(`${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`))
  }

  return (
    <div className="grid gap-4 md:grid-cols-2" aria-live="polite">
      {closed && (
        <p className="rounded-2xl border border-crimson/25 bg-[#fff1f1] p-4 font-semibold text-crimson md:col-span-2">
          {t.closed}
          {closed.reason ? `: ${closed.reason}` : ''}
        </p>
      )}
      {(['to-campus', 'to-city'] as Direction[]).map((direction) => {
        const [next, ...later] = now ? nextDepartures(timetable, direction, now, 3) : []
        return (
          <section key={direction} aria-labelledby={`next-${direction}`} className="rounded-3xl bg-night p-6 text-white md:p-8">
            <h2 id={`next-${direction}`} className="text-[1.15rem] font-bold text-white">
              {t.heading[direction]}{' '}
              {ends && <span className="font-normal text-white/65">{t.from(direction === 'to-campus' ? ends.city : ends.campus)}</span>}
            </h2>
            {!now ? (
              <p className="mt-6 text-white/70">{t.checking}</p>
            ) : !next ? (
              <p className="mt-6 text-white/80">{t.none}</p>
            ) : (
              <>
                <p className="mt-5 text-[2.6rem] font-bold leading-none text-glow md:text-[3rem]">{time(lang, clock(next.time))}</p>
                <p className="mt-3 text-[1.15rem] font-semibold">{when(next)}</p>
                {arrival(next) && <p className="mt-1 text-[0.95rem] text-white/70">{t.reaches(arrival(next)!)}</p>}
                {next.note && <p className="mt-1 text-[0.95rem] text-white/70">{next.note}</p>}
                {later.length > 0 && (
                  <p className="mt-5 border-t border-white/15 pt-4 text-[0.95rem] text-white/75">
                    {t.then}:{' '}
                    {later.map((d, i) => (
                      <span key={`${d.dayOffset}-${d.time}`}>
                        {i > 0 && ', '}
                        {time(lang, clock(d.time))}
                        {d.dayOffset > 0 && ` (${when(d)})`}
                      </span>
                    ))}
                  </p>
                )}
              </>
            )}
          </section>
        )
      })}
    </div>
  )
}
