import { ChevronDown } from '@/components/ui/Icons'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { FAQS } from '@/content/home'

/** Accordion on native <details>; the open question turns into gradient text. */
export function Faq() {
  return (
    <section className="py-16 md:py-22" aria-labelledby="faq">
      <div className="wrap max-w-4xl">
        <SectionTitle id="faq" parts={['তোমার প্রশ্ন,', { hl: 'আমাদের উত্তর' }]} />
        <div className="mt-10 space-y-4">
          {FAQS.map((f) => (
            <details
              key={f.q}
              data-reveal="fade"
              data-amount="0.5"
              className="faq group rounded-xl bg-white shadow-[12px_12px_24px_rgb(0_0_0/0.05)] md:rounded-3xl"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[1.15rem] font-semibold leading-snug text-text md:p-8 md:text-[1.4rem]">
                <span className="faq-q">{f.q}</span>
                <ChevronDown className="size-6 shrink-0 text-subtle transition-transform duration-300 group-open:rotate-180 md:size-7" />
              </summary>
              <p className="px-5 pb-6 text-[1rem] leading-relaxed text-muted md:px-8 md:pb-8 md:text-[1.1rem]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
