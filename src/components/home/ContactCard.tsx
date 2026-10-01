import { ArrowRight, CheckCircle, Facebook } from '@/components/ui/Icons'
import { CONTACT_TOPICS } from '@/content/home'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    chip: 'যোগাযোগ',
    title: 'সমস্যা যা-ই হোক, সরাসরি লেখো',
    email: 'ইমেইল',
    reply: 'সংশ্লিষ্ট দায়িত্বশীল উত্তর দেবেন। পরিচয় গোপন রাখতে চাইলে সেটাও জানাও।',
    write: 'ইমেইল করো',
    facebook: 'ফেসবুক পেজ',
  },
  {
    chip: 'Contact',
    title: 'Whatever the problem, write to us',
    email: 'Email',
    reply: 'The leader concerned will reply. Tell us if you would like to stay anonymous.',
    write: 'Send an email',
    facebook: 'Facebook page',
  },
)

/** Deep sea-blue card inviting students to write in. */
export async function ContactCard({ email, facebook }: { email: string; facebook?: string | null }) {
  const lang = await getLang()
  const t = T[lang]
  return (
    <section className="wrap pb-20 pt-6 md:pb-28" aria-labelledby="contact">
      <div
        data-reveal="up"
        className="relative overflow-hidden rounded-3xl text-white [background:radial-gradient(70%_120%_at_50%_0%,#134a78_0%,#0e2e4d_55%,#0a1d30_100%)] lg:rounded-[32px]"
      >
        <div aria-hidden="true" className="grid-lines-night absolute inset-0 [mask-image:linear-gradient(180deg,#000,transparent)]" />
        <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div>
            <span className="chip bg-white/10 text-white">{t.chip}</span>
            <h2 id="contact" className="mt-4 text-[1.9rem] font-bold leading-snug text-white md:text-[2.5rem]">
              {t.title}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {CONTACT_TOPICS[lang].map((topic) => (
                <li key={topic} className="flex items-center gap-2.5 text-[1.02rem] text-white/90">
                  <CheckCircle className="size-5 shrink-0 text-blue-soft" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white/[0.08] p-6 ring-1 ring-white/10 md:p-8">
            <p className="text-white/70">{t.email}</p>
            <a href={`mailto:${email}`} className="mt-1 break-all font-[family-name:var(--font-en)] text-[1.3rem] font-bold text-white hover:underline md:text-[1.6rem]">
              {email}
            </a>
            <p className="mt-3 text-[0.95rem] text-white/70">{t.reply}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${email}`} className="btn btn-sky">
                {t.write}
                <ArrowRight />
              </a>
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                  <Facebook className="size-5" />
                  {t.facebook}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
