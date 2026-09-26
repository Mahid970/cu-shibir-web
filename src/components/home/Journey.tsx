import { ART } from '@/components/art/Icons3D'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { JOURNEY } from '@/content/home'
import { getLang } from '@/i18n/server'

/** কর্মী → সাথী → সদস্য, with connectors that fill one after another. */
export async function Journey() {
  const lang = await getLang()
  return (
    <section className="relative overflow-hidden pb-14 pt-20 md:pb-18 md:pt-28 lg:pb-20" aria-labelledby="journey">
      <div className="wrap">
        <SectionTitle id="journey" parts={lang === 'en' ? ['Three levels of', { hl: 'membership' }] : ['সংগঠনের', { hl: 'তিন স্তর' }]} />
        <ol className="relative mx-auto mt-12 grid max-w-5xl gap-12 md:mt-16 md:grid-cols-3 md:gap-0">
          {JOURNEY.map((step, i) => {
            const Art = ART[step.icon]
            return (
              <li
                key={step.icon}
                data-reveal="up"
                style={vars({ '--d': `${i * 200}ms` })}
                className="relative flex flex-col items-center text-center"
              >
                {i < JOURNEY.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-full h-12 w-[3px] -translate-x-1/2 overflow-hidden rounded bg-pale-3 md:left-[calc(50%+92px)] md:right-[calc(-50%+92px)] md:top-[75px] md:h-[3px] md:w-auto md:translate-x-0"
                  >
                    <span className={`journey-${i + 1} block size-full rounded bg-blue`} />
                  </span>
                )}
                <span
                  className="grid size-[150px] place-items-center rounded-full ring-8 ring-white"
                  style={{ background: step.bg }}
                >
                  <Art className="art-shadow w-20" />
                </span>
                <h3 className="mt-5 text-[1.6rem] font-bold text-ink">{step.title[lang]}</h3>
                <p className="mt-1 text-[0.95rem] text-muted">{step.text[lang]}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
