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

const HISTORY: { year: number; date?: L; title: L; text: L; tone: string }[] = [
  {
    year: 1977,
    date: { bn: '৬ ফেব্রুয়ারি', en: '6 February' },
    title: { bn: 'যাত্রা শুরু', en: 'The journey begins' },
    text: {
      bn: 'ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় মসজিদে বাংলাদেশ ইসলামী ছাত্রশিবির প্রতিষ্ঠিত হয়।',
      en: 'Bangladesh Islami Chhatrashibir is founded at the Central Mosque of the University of Dhaka.',
    },
    tone: '#6cc6ee',
  },
  {
    year: 1981,
    title: { bn: 'চাকসুতে পূর্ণ প্যানেল', en: 'A full panel at CUCSU' },
    text: {
      bn: 'চট্টগ্রাম বিশ্ববিদ্যালয় কেন্দ্রীয় ছাত্র সংসদ নির্বাচনে সমর্থিত প্যানেলের পূর্ণ জয়। ভিপি জসিম উদ্দিন সরকার, জিএস আবদুল গাফফার।',
      en: 'The panel it backed wins every post in the Chittagong University Central Students’ Union election. VP Jasim Uddin Sarkar, GS Abdul Gaffar.',
    },
    tone: '#5fd4ff',
  },
  {
    year: 1990,
    title: { bn: 'শেষ চাকসু নির্বাচন', en: 'The last CUCSU election' },
    text: { bn: 'এরপর দীর্ঘ ৩৫ বছর চাকসু নির্বাচন হয়নি।', en: 'No CUCSU election was held for the next 35 years.' },
    tone: '#a5b4fc',
  },
  {
    year: 2014,
    title: { bn: 'কঠিন সময়', en: 'Hard times' },
    text: { bn: 'ক্যাম্পাসে শাখার প্রকাশ্য সাংগঠনিক কার্যক্রম বন্ধ হয়ে যায়।', en: 'The branch’s open organisational work on campus comes to a halt.' },
    tone: '#94a3b8',
  },
  {
    year: 2024,
    date: { bn: '৫ আগস্ট', en: '5 August' },
    title: { bn: 'আবার প্রকাশ্যে', en: 'In the open again' },
    text: {
      bn: 'গণঅভ্যুত্থানের পর শাখা আবার প্রকাশ্যে কার্যক্রম শুরু করে। সেপ্টেম্বরে কমিটি পুনর্গঠিত হয়।',
      en: 'After the mass uprising the branch resumes its work in the open. The committee is reorganised in September.',
    },
    tone: '#3ee0a4',
  },
  {
    year: 2025,
    date: { bn: '১৫ অক্টোবর', en: '15 October' },
    title: { bn: 'চাকসুতে ২৪/২৬', en: '24 of 26 at CUCSU' },
    text: {
      bn: '৩৫ বছর পর অনুষ্ঠিত চাকসু নির্বাচনে সম্প্রীতির শিক্ষার্থী জোট ২৬টি পদের ২৪টিতে জয়ী। ভিপি ইব্রাহীম হোসেন রনি, জিএস সাঈদ বিন হাবিব।',
      en: 'In the first CUCSU election in 35 years, Sompritir Shikkharthi Jot wins 24 of the 26 posts. VP Ibrahim Hossain Rony, GS Saeed Bin Habib.',
    },
    tone: '#ffc561',
  },
  {
    year: 2026,
    date: { bn: 'জুন', en: 'June' },
    title: { bn: 'নতুন কার্যকরী পরিষদ', en: 'A new executive committee' },
    text: {
      bn: 'সভাপতি ইব্রাহীম হোসেন রনি ও সেক্রেটারি হাবিব উল্লাহ খালেদের নেতৃত্বে নতুন পথচলা।',
      en: 'A new chapter led by President Ibrahim Hossain Rony and Secretary Habib Ullah Khaled.',
    },
    tone: '#ff9f5e',
  },
]

export const historyStops = (lang: Locale): Stop[] =>
  HISTORY.map((s) => ({ year: num(lang, s.year), date: s.date?.[lang], title: s.title[lang], text: s.text[lang], tone: s.tone }))
