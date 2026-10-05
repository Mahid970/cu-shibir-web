/**
 * The branch's history, stop by stop along the shuttle-train rail on the About page.
 * Sources: the plan's research notes (§1) — shibir.org.bd, Prothom Alo, TBS, Bangla Tribune,
 * Desh Rupantor and Daily Sangram. Ask the branch to confirm names and dates before launch (plan §11).
 */
import type { Locale } from '@/i18n/config'
import { num } from '@/i18n/format'

type L = Record<Locale, string>

/** One station as the timeline shows it, already in the page's language. */
export type Stop = { year: string; date?: string; title: string; text: string; tone: string }

const HISTORY: { year: number | string | L; date?: L; title: L; text: L; tone: string }[] = [
  {
    year: 1977,
    date: { bn: '৬ ফেব্রুয়ারি', en: '6 February' },
    title: { bn: 'যাত্রা শুরু', en: 'The journey begins' },
    text: {
      bn: 'ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় মসজিদে বাংলাদেশ ইসলামী ছাত্রশিবির প্রতিষ্ঠিত হয়।',
      en: 'Bangladesh Islami Chhatrashibir is founded at the Central Mosque of the University of Dhaka.',
    },
    tone: '#6ea0ff',
  },
  {
    year: 1981,
    title: { bn: 'চাকসুতে পূর্ণ প্যানেল', en: 'A full panel at CUCSU' },
    text: {
      bn: 'চট্টগ্রাম বিশ্ববিদ্যালয় কেন্দ্রীয় ছাত্র সংসদ নির্বাচনে সমর্থিত প্যানেলের পূর্ণ জয়। ভিপি জসিম উদ্দিন সরকার, জিএস আবদুল গাফফার।',
      en: 'The panel it backed wins every post in the Chittagong University Central Students’ Union election. VP Jasim Uddin Sarkar, GS Abdul Gaffar.',
    },
    tone: '#00fbee',
  },
  {
    year: '1988–2014',
    title: { bn: 'শহীদি কাফেলা', en: 'Ten martyrs' },
    text: {
      bn: '১৯৮৮ থেকে ২০১৪ সালের মধ্যে ছাত্রলীগ, বাম ছাত্রসংগঠন ও জাতীয় ছাত্রসমাজের হামলায় চবিকে ঘিরে শিবিরের ১০ জন জনশক্তি শাহাদাত বরণ করেন।',
      en: 'Between 1988 and 2014, ten Shibir members were killed around the campus in attacks by Chhatra League, left-wing student groups and Jatiya Chhatra Samaj.',
    },
    tone: '#fca5a5',
  },
  {
    year: 2014,
    title: { bn: 'স্বৈরাচারের নিপীড়ন', en: 'Under the dictatorship' },
    text: {
      bn: 'ছাত্রলীগের সন্ত্রাসী আক্রমণ ও হত্যাযজ্ঞের কারণে শাখাকে ক্যাম্পাস ত্যাগ করতে হয়।',
      en: 'Chhatra League’s armed attacks and killings force the branch off campus.',
    },
    tone: '#94a3b8',
  },
  {
    year: 2024,
    date: { bn: '৫ আগস্ট', en: '5 August' },
    title: { bn: 'আবার প্রকাশ্যে', en: 'In the open again' },
    text: {
      bn: 'জুলাই বিপ্লবে চট্টগ্রামে নেতৃত্ব দেয় চবি শিবির। গণঅভ্যুত্থানের পর শাখা আবার প্রকাশ্যে কার্যক্রম শুরু করে।',
      en: 'In the July Revolution, CU Shibir leads the movement in Chattogram. After the uprising the branch works in the open again.',
    },
    tone: '#00fb97',
  },
  {
    year: 2025,
    date: { bn: '১৫ অক্টোবর', en: '15 October' },
    title: { bn: 'চাকসুতে ২৪/২৬', en: '24 of 26 at CUCSU' },
    text: {
      bn: '৩৫ বছর পর অনুষ্ঠিত চাকসু নির্বাচনে সম্প্রীতির শিক্ষার্থী জোট ২৬টি পদের ২৪টিতে জয়ী। ভিপি ইব্রাহীম হোসেন রনি, জিএস সাঈদ বিন হাবিব।',
      en: 'In the first CUCSU election in 35 years, Sompritir Shikkharthi Jot wins 24 of the 26 posts. VP Ibrahim Hossain Rony, GS Saeed Bin Habib.',
    },
    tone: '#fbc900',
  },
  {
    year: { bn: 'বর্তমান', en: 'Today' },
    title: { bn: 'শিক্ষার্থীদের পাশে', en: 'Beside the students' },
    text: {
      bn: '৫ আগস্টের পর ক্যাম্পাসে শিক্ষার্থীবান্ধব শতাধিক কার্যক্রম, আর শিক্ষার্থীদের অধিকার আদায়ে সর্বদা সরব।',
      en: 'More than a hundred programmes for students on campus since 5 August, and always speaking up for students’ rights.',
    },
    tone: '#f9a8d4',
  },
]

export const historyStops = (lang: Locale): Stop[] =>
  HISTORY.map((s) => ({
    year: typeof s.year === 'object' ? s.year[lang] : num(lang, s.year),
    date: s.date?.[lang],
    title: s.title[lang],
    text: s.text[lang],
    tone: s.tone,
  }))
