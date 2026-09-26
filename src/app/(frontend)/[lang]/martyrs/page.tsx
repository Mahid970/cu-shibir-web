import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/content/RichText'
import { copy, langAttr } from '@/i18n/config'
import { date } from '@/i18n/format'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getMartyrs } from '@/lib/cms'
import { pickImage } from '@/lib/media'
import type { Martyr } from '@/payload-types'

export const revalidate = 3600

const T = copy(
  {
    meta: { title: 'শহীদ স্মরণ', description: 'চট্টগ্রাম বিশ্ববিদ্যালয় শাখার শহীদদের স্মরণে।' },
    title: 'শহীদ স্মরণ',
    ayah: 'আর যারা আল্লাহর পথে নিহত হয়, তাদের মৃত বলো না; বরং তারা জীবিত, কিন্তু তোমরা তা উপলব্ধি করতে পার না।',
    ref: 'সূরা আল বাকারা, আয়াত ১৫৪',
    constellation: 'শহীদদের নাম তারকার মতো সাজানো; নিচে পূর্ণ তালিকা',
    list: 'শহীদদের তালিকা',
    shaheed: 'শহীদ',
    more: 'বিস্তারিত পড়ুন',
  },
  {
    meta: { title: 'In memory of our martyrs', description: 'In memory of the martyrs of the University of Chittagong branch.' },
    title: 'In memory of our martyrs',
    ayah: 'And do not say of those who are killed in the way of Allah that they are dead. Rather, they are alive, but you do not perceive it.',
    ref: 'Surah Al-Baqarah, verse 154',
    constellation: 'The names of the martyrs set out like stars; the full list follows',
    list: 'List of martyrs',
    shaheed: 'Shaheed',
    more: 'Read more',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/martyrs', T[lang].meta)
}

const W = 1000
const H = 420

function h(seed: string, n: number) {
  let x = 2166136261
  for (const ch of `${seed}:${n}`) x = Math.imul(x ^ ch.codePointAt(0)!, 16777619)
  return ((x >>> 0) % 10000) / 10000
}

/** Place stars on a loose golden-angle spiral across the band, nudged by each name so it is stable. */
function layout(martyrs: Martyr[]) {
  const n = martyrs.length
  const stars = martyrs.map((m, i) => {
    const t = (i + 0.5) / n
    const a = i * 2.39996
    const r = Math.sqrt(t)
    const x = W / 2 + Math.cos(a) * r * (W * 0.44) + (h(m.slug ?? m.name, 1) - 0.5) * 40
    const y = H / 2 + Math.sin(a) * r * (H * 0.38) + (h(m.slug ?? m.name, 2) - 0.5) * 30
    return { m, x, y, size: 2.6 + h(m.name, 3) * 2.2, delay: h(m.name, 4) * 6 }
  })
  // Faint lines to each star's nearest neighbour make the constellation.
  const lines: [number, number][] = []
  stars.forEach((s, i) => {
    let best = -1
    let bestD = Infinity
    stars.forEach((o, j) => {
      if (i === j) return
      const d = (s.x - o.x) ** 2 + (s.y - o.y) ** 2
      if (d < bestD) {
        bestD = d
        best = j
      }
    })
    if (best >= 0 && !lines.some(([a, b]) => (a === best && b === i) || (a === i && b === best))) lines.push([i, best])
  })
  return { stars, lines }
}

export default async function MartyrsPage() {
  const lang = await getLang()
  const t = T[lang]
  const martyrs = await getMartyrs(lang)
  if (martyrs.length === 0) notFound()
  const { stars, lines } = layout(martyrs)

  return (
    <div className="relative isolate overflow-hidden bg-[#020817] pb-20 text-white md:pb-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_20%,rgb(30_58_138/0.35),transparent_70%)]" />
      <header className="wrap pt-14 text-center md:pt-20">
        <h1 className="text-[2.2rem] font-bold text-white md:text-[3rem]">{t.title}</h1>
        <p lang="ar" dir="rtl" className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-quran)] text-[1.6rem] leading-[2.1] text-slate-200">
          وَلَا تَقُولُوا لِمَنْ يُقْتَلُ فِي سَبِيلِ اللَّهِ أَمْوَاتٌ بَلْ أَحْيَاءٌ وَلَكِنْ لَا تَشْعُرُونَ
        </p>
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-slate-300">
          {t.ayah}
          <span className="mt-1 block text-[0.9rem] text-slate-400">{t.ref}</span>
        </p>
      </header>

      <div className="wrap mt-10">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-5xl" role="img" aria-label={t.constellation}>
          <g stroke="rgb(148 163 184 / 0.18)" strokeWidth="1">
            {lines.map(([a, b]) => (
              <line key={`${a}-${b}`} x1={stars[a].x} y1={stars[a].y} x2={stars[b].x} y2={stars[b].y} />
            ))}
          </g>
          {stars.map((s) => (
            <a key={s.m.id} href={`#m-${s.m.slug ?? s.m.id}`} className="group outline-none">
              <circle cx={s.x} cy={s.y} r={s.size * 4} fill="rgb(191 219 254 / 0.08)" />
              <circle cx={s.x} cy={s.y} r={s.size} fill="#e0f2fe" className="memorial-star" style={{ animationDelay: `${s.delay}s` }} />
              <text
                lang={langAttr(lang, s.m.name)}
                x={s.x}
                y={s.y - s.size - 10}
                textAnchor="middle"
                className="fill-white text-[15px] opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {s.m.name}
              </text>
            </a>
          ))}
        </svg>
      </div>

      <section aria-labelledby="list" className="wrap mt-10 max-w-4xl">
        <h2 id="list" className="sr-only">
          {t.list}
        </h2>
        <ol className="grid gap-4">
          {martyrs.map((m) => {
            const img = pickImage(m.photo, 'thumb')
            const when = m.dateText || (m.date ? date(lang, m.date) : null)
            return (
              <li key={m.id} id={`m-${m.slug ?? m.id}`} className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
                <div className="flex gap-4">
                  {img && (
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                      <Image src={img.src} alt={m.name} fill sizes="80px" className="object-cover grayscale-[40%]" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-[1.3rem] font-bold text-white">
                      {t.shaheed} <span lang={langAttr(lang, m.name)}>{m.name}</span>
                    </h3>
                    {(when || m.affiliation || m.place) && (
                      <p className="mt-1 text-[0.95rem] text-slate-400">{[when, m.affiliation, m.place].filter(Boolean).join('। ')}</p>
                    )}
                    {m.summary && <p className="mt-2 leading-relaxed text-slate-300">{m.summary}</p>}
                  </div>
                </div>
                {m.bio && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-semibold text-sky-200">{t.more}</summary>
                    <RichText data={m.bio as never} className="prose-read prose-dark mt-4" />
                  </details>
                )}
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
