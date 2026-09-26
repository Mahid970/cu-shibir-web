import { ArrowRight, CheckCircle, Facebook } from '@/components/ui/Icons'
import { CONTACT_TOPICS } from '@/content/home'

/** Deep-blue radial card (Phitron's fee block) inviting students to write in. */
export function ContactCard({ email, facebook }: { email: string; facebook?: string | null }) {
  return (
    <section className="wrap pb-20 pt-6 md:pb-28" aria-labelledby="contact">
      <div
        data-reveal="up"
        className="relative overflow-hidden rounded-3xl text-white [background:radial-gradient(70%_120%_at_50%_0%,#0341a6_0%,#052b62_55%,#042755_100%)] lg:rounded-[32px]"
      >
        <div aria-hidden="true" className="dot-grid absolute inset-0 [mask-image:linear-gradient(180deg,#000,transparent)]" />
        <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div>
            <span className="chip bg-white/10 text-white">যোগাযোগ</span>
            <h2 id="contact" className="mt-4 text-[1.9rem] font-bold leading-snug text-white md:text-[2.5rem]">
              সমস্যা যা-ই হোক, সরাসরি লেখো
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {CONTACT_TOPICS.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[1.02rem] text-white/90">
                  <CheckCircle className="size-5 shrink-0 text-mint" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white/[0.08] p-6 ring-1 ring-white/10 md:p-8">
            <p className="text-white/70">ইমেইল</p>
            <a href={`mailto:${email}`} className="mt-1 break-all font-[family-name:var(--font-en)] text-[1.3rem] font-bold text-white hover:underline md:text-[1.6rem]">
              {email}
            </a>
            <p className="mt-3 text-[0.95rem] text-white/70">সংশ্লিষ্ট দায়িত্বশীল উত্তর দেবেন। পরিচয় গোপন রাখতে চাইলে সেটাও জানাও।</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${email}`} className="btn btn-yellow">
                ইমেইল করো
                <ArrowRight />
              </a>
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                  <Facebook className="size-5" />
                  ফেসবুক পেজ
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
