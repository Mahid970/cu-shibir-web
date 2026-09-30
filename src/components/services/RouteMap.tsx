import { copy, langAttr, type Locale } from '@/i18n/config'
import { num } from '@/i18n/format'

const T = copy(
  { label: 'শাটল ট্রেনের পথ', min: (m: string) => `${m} মিনিট` },
  { label: 'The shuttle route', min: (m: string) => `${m} min` },
)

/** The route as a rail line with its stations, city to campus (vertical on phones). */
export function RouteMap({ stations, lang }: { stations: { name: string; minutes?: number | null }[]; lang: Locale }) {
  const t = T[lang]
  return (
    <figure data-reveal="rail" className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)] md:px-10 md:py-9">
      <figcaption className="text-[1.15rem] font-bold text-ink">{t.label}</figcaption>
      <div className="relative mt-8 pl-9 md:pl-0 md:pt-2">
        {/* The rail: a line with sleepers. */}
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-3 top-3 w-1.5 rounded-full bg-[repeating-linear-gradient(180deg,var(--pale-4)_0_6px,transparent_6px_12px)] md:bottom-auto md:left-3 md:right-3 md:top-[1.05rem] md:h-1.5 md:w-auto md:bg-[repeating-linear-gradient(90deg,var(--pale-4)_0_6px,transparent_6px_12px)]"
        />
        <svg aria-hidden="true" viewBox="0 0 36 22" className="route-train z-10 w-9 drop-shadow-[0_4px_8px_rgb(53_100_255/0.35)] md:top-0">
          <rect x="1" y="2" width="34" height="16" rx="5" fill="var(--blue)" />
          <rect x="5" y="5" width="7" height="5" rx="1.5" fill="#fff" />
          <rect x="14.5" y="5" width="7" height="5" rx="1.5" fill="#fff" />
          <rect x="24" y="5" width="7" height="5" rx="1.5" fill="#fff" />
          <rect x="1" y="12.5" width="34" height="2" fill="var(--cta)" />
          <circle cx="9" cy="19.5" r="2.5" fill="var(--ink)" />
          <circle cx="27" cy="19.5" r="2.5" fill="var(--ink)" />
        </svg>
        <ol className="grid gap-6 md:grid-flow-col md:auto-cols-fr md:gap-2">
          {stations.map((s, i) => {
            const end = i === 0 || i === stations.length - 1
            return (
              <li key={`${s.name}-${i}`} className="relative md:text-center">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[2.05rem] top-1 block rounded-full border-[3px] border-white md:static md:mx-auto ${end ? 'size-5 bg-blue' : 'size-4 bg-pale-4 md:mt-0.5'} shadow-[0_0_0_2px_var(--pale-4)]`}
                />
                <span lang={langAttr(lang, s.name)} className={`block leading-snug md:mt-3 ${end ? 'font-bold text-ink' : 'font-semibold text-ink/80'}`}>
                  {s.name}
                </span>
                {typeof s.minutes === 'number' && i > 0 && <span className="text-[0.85rem] text-subtle">{t.min(num(lang, s.minutes))}</span>}
              </li>
            )
          })}
        </ol>
      </div>
    </figure>
  )
}
