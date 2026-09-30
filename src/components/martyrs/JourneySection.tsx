import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { getLang } from '@/i18n/server'
import { getMartyrs } from '@/lib/cms'
import { toStations } from '@/lib/martyrs'

import { ShaheedJourney } from './ShaheedJourney'

const T = copy(
  {
    eyebrow: 'শহীদি কাফেলা',
    title: 'আলোর মিছিল',
    lede: '১৯৮৮ থেকে ২০১৪: চট্টগ্রাম বিশ্ববিদ্যালয়ের শহীদদের পথ ধরে হাঁটুন। যেকোনো নামে ক্লিক করে পড়ুন তাঁর পুরো গল্প।',
    read: 'গল্পটি পড়ুন',
    count: (i: string, n: string) => `শহীদ ${i} / ${n}`,
    endTitle: 'এই কাফেলা থামেনি',
    endText: 'তাঁদের রক্তে ভেজা এই সবুজ ক্যাম্পাসে তাঁদের স্বপ্ন নিয়েই আমাদের পথচলা।',
    endLink: 'শহীদ স্মরণ',
  },
  {
    eyebrow: 'The caravan of martyrs',
    title: 'A procession of light',
    lede: '1988 to 2014: walk the path of the University of Chittagong’s martyrs. Open any name to read his whole story.',
    read: 'Read his story',
    count: (i: string, n: string) => `Martyr ${i} of ${n}`,
    endTitle: 'This caravan has not stopped',
    endText: 'On the green campus their blood soaked, we walk on with their dream.',
    endLink: 'In memory of our martyrs',
  },
)

/** The martyrs' journey with its words, for the home page (links on to /martyrs) or /martyrs itself. */
export async function JourneySection({ onMartyrsPage = false, id }: { onMartyrsPage?: boolean; id?: string }) {
  const lang = await getLang()
  const t = T[lang]
  const stations = toStations(await getMartyrs(lang), lang)
  if (stations.length === 0) return null
  const total = num(lang, stations.length)
  return (
    <ShaheedJourney
      id={id}
      stations={stations}
      labels={{
        eyebrow: t.eyebrow,
        title: t.title,
        lede: t.lede,
        read: t.read,
        counts: stations.map((_, i) => t.count(num(lang, i + 1), total)),
        endTitle: t.endTitle,
        endText: t.endText,
        endLink: onMartyrsPage ? undefined : t.endLink,
      }}
    />
  )
}
