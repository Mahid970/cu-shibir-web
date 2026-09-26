import { Chevrons } from '@/components/ui/Icons'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { toBnDigits } from '@/lib/bn'
import { JOIN_STEPS } from '@/content/home'

/** Four glowing numbered steps on a night band, with nudging chevrons between them. */
export function JoinSteps() {
  return (
    <section className="relative isolate overflow-hidden bg-night py-16 text-white md:py-22" aria-labelledby="join-steps">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:72px_72px]"
      />
      <div className="wrap">
        <SectionTitle id="join-steps" dark parts={['যুক্ত হওয়ার', { hl: '৪টি ধাপ' }]} />
        <ol className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {JOIN_STEPS.map((s, i) => (
            <li
              key={s.title}
              data-reveal="fade"
              style={vars({ '--d': `${i * 120}ms` })}
              className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 text-center"
            >
              <span
                className="mx-auto grid size-16 place-items-center rounded-2xl border text-[1.6rem] font-bold"
                style={{ color: s.color, borderColor: `${s.color}66`, background: `${s.color}1f`, boxShadow: `0 0 34px ${s.color}40` }}
              >
                {toBnDigits(String(i + 1).padStart(2, '0'))}
              </span>
              <h3 className="mt-5 text-[1.3rem] font-bold" style={{ color: s.color }}>
                {s.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-white/70">{s.text}</p>
              {i < JOIN_STEPS.length - 1 && (
                <Chevrons className="nudge absolute -right-[26px] top-1/2 hidden size-5 -translate-y-1/2 lg:block" style={{ color: s.color }} />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
