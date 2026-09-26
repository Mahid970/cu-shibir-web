/**
 * The branch's history, stop by stop along the shuttle-train rail on the About page.
 * Sources: the plan's research notes (§1) — shibir.org.bd, Prothom Alo, TBS, Bangla Tribune,
 * Desh Rupantor and Daily Sangram. Ask the branch to confirm names and dates before launch (plan §11).
 */
export type Stop = { year: string; date?: string; title: string; text: string; tone: string }

export const HISTORY: Stop[] = [
  {
    year: '১৯৭৭',
    date: '৬ ফেব্রুয়ারি',
    title: 'যাত্রা শুরু',
    text: 'ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় মসজিদে বাংলাদেশ ইসলামী ছাত্রশিবির প্রতিষ্ঠিত হয়।',
    tone: '#6ea0ff',
  },
  {
    year: '১৯৮১',
    title: 'চাকসুতে পূর্ণ প্যানেল',
    text: 'চট্টগ্রাম বিশ্ববিদ্যালয় কেন্দ্রীয় ছাত্র সংসদ নির্বাচনে সমর্থিত প্যানেলের পূর্ণ জয়। ভিপি জসিম উদ্দিন সরকার, জিএস আবদুল গাফফার।',
    tone: '#00fbee',
  },
  {
    year: '১৯৯০',
    title: 'শেষ চাকসু নির্বাচন',
    text: 'এরপর দীর্ঘ ৩৫ বছর চাকসু নির্বাচন হয়নি।',
    tone: '#a5b4fc',
  },
  {
    year: '২০১৪',
    title: 'কঠিন সময়',
    text: 'ক্যাম্পাসে শাখার প্রকাশ্য সাংগঠনিক কার্যক্রম বন্ধ হয়ে যায়।',
    tone: '#94a3b8',
  },
  {
    year: '২০২৪',
    date: '৫ আগস্ট',
    title: 'আবার প্রকাশ্যে',
    text: 'গণঅভ্যুত্থানের পর শাখা আবার প্রকাশ্যে কার্যক্রম শুরু করে। সেপ্টেম্বরে কমিটি পুনর্গঠিত হয়।',
    tone: '#00fb97',
  },
  {
    year: '২০২৫',
    date: '১৫ অক্টোবর',
    title: 'চাকসুতে ২৪/২৬',
    text: '৩৫ বছর পর অনুষ্ঠিত চাকসু নির্বাচনে সম্প্রীতির শিক্ষার্থী জোট ২৬টি পদের ২৪টিতে জয়ী। ভিপি ইব্রাহীম হোসেন রনি, জিএস সাঈদ বিন হাবিব।',
    tone: '#fbc900',
  },
  {
    year: '২০২৬',
    date: 'জুন',
    title: 'নতুন কার্যকরী পরিষদ',
    text: 'সভাপতি ইব্রাহীম হোসেন রনি ও সেক্রেটারি হাবিব উল্লাহ খালেদের নেতৃত্বে নতুন পথচলা।',
    tone: '#f9a8d4',
  },
]
