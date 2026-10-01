import { Link } from '@/i18n/link'

import { syllabus } from '@/content/syllabus'
import { getLang } from '@/i18n/server'

/** The three levels as tabs (plain links: each level is its own page). */
export async function LevelNav({ active }: { active?: string }) {
  const lang = await getLang()
  return (
    <nav aria-label={lang === 'en' ? 'Syllabus levels' : 'সিলেবাসের স্তর'} className="mt-8 flex justify-center">
      <ul className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_4px_24px_rgb(11_31_51/0.06)] [scrollbar-width:none]">
        {syllabus(lang).map((l) => {
          const on = l.key === active
          return (
            <li key={l.key} className="shrink-0">
              <Link
                href={`/syllabus/${l.key}`}
                aria-current={on ? 'page' : undefined}
                className={`block rounded-full px-5 py-2 text-[0.98rem] font-bold transition-colors ${on ? 'bg-primary text-white shadow-[0_8px_18px_rgb(17_69_117/0.3)]' : 'bg-pale-2 text-ink hover:bg-pale-3'}`}
              >
                {l.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
