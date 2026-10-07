/**
 * The 24 CUCSU 2025 posts won by Sompritir Shikkharthi Jot, in the union's post order.
 * Sources: Bangla Wikipedia's results table (citing Jago News and BSS, 16 October 2025) and the
 * union's own site, cucsu.cu.ac.bd (English names, post titles, photos); votes from Prothom Alo.
 *
 * Portraits are 200px squares cropped from cucsu.cu.ac.bd at public/cucsu/<photo>.jpg; a card
 * without one (Akash Das, not on that site) shows the person's initial.
 */
import fs from 'node:fs'
import path from 'node:path'

import type { Locale } from '@/i18n/config'

type L = Record<Locale, string>

const MEMBER: L = { bn: 'সদস্য', en: 'Executive Member' }

const WINNERS: { name: L; post: L; photo: string }[] = [
  { photo: 'vp', name: { bn: 'ইব্রাহীম হোসেন রনি', en: 'Ibrahim Hossain Rony' }, post: { bn: 'সহ-সভাপতি (ভিপি)', en: 'Vice President (VP)' } },
  { photo: 'gs', name: { bn: 'সাঈদ বিন হাবিব', en: 'Saeed Bin Habib' }, post: { bn: 'সাধারণ সম্পাদক (জিএস)', en: 'General Secretary (GS)' } },
  { photo: 'liberation-war', name: { bn: 'মো. মোনায়েম শরীফ', en: 'Md Monayem Sharif' }, post: { bn: 'মুক্তিযুদ্ধ ও গণতান্ত্রিক আন্দোলন সম্পাদক', en: 'Freedom Fighter & Democratic Movement Secretary' } },
  { photo: 'law', name: { bn: 'মো. ফজলে রাব্বি তৌহিদ', en: 'Md Fazle Rabbi Tawhid' }, post: { bn: 'আইন ও মানবাধিকার বিষয়ক সম্পাদক', en: 'Law & Human Rights Secretary' } },
  { photo: 'health', name: { bn: 'আফনান হাসান ইমরান', en: 'Afnan Hasan Imran' }, post: { bn: 'স্বাস্থ্য সম্পাদক', en: 'Health Secretary' } },
  { photo: 'transport', name: { bn: 'মো. ইসহাক ভূঁঞা', en: 'Md Ishaq Bhuiyan' }, post: { bn: 'যোগাযোগ ও আবাসন সম্পাদক', en: 'Communication & Accommodation Secretary' } },
  { photo: 'transport-asst', name: { bn: 'ওবাইদুল সালমান', en: 'Obaidul Salman' }, post: { bn: 'সহ যোগাযোগ ও আবাসন সম্পাদক', en: 'Deputy Communication & Accommodation Secretary' } },
  { photo: 'science', name: { bn: 'মো. মাহবুবুর রহমান', en: 'Md Mahbubur Rahman' }, post: { bn: 'বিজ্ঞান ও তথ্যপ্রযুক্তি সম্পাদক', en: 'Science & IT Secretary' } },
  { photo: 'research', name: { bn: 'তানভীর আঞ্জুম শোভন', en: 'Tanvir Anjum Shovon' }, post: { bn: 'গবেষণা ও উদ্ভাবনী সম্পাদক', en: 'Research & Innovation Secretary' } },
  { photo: 'library', name: { bn: 'মাসুম বিল্লাহ', en: 'Masum Billah' }, post: { bn: 'পাঠাগার ও ক্যাফেটেরিয়া বিষয়ক সম্পাদক', en: 'Library & Cafeteria Affairs Secretary' } },
  { photo: 'social', name: { bn: 'তাহসিনা রহমান', en: 'Tahsina Rahman' }, post: { bn: 'সমাজসেবা ও পরিবেশ সম্পাদক', en: 'Social Welfare & Environmental Affairs Secretary' } },
  { photo: 'career', name: { bn: 'মেহেদী হাসান সোহান', en: 'Mehedi Hasan Shohan' }, post: { bn: 'ক্যারিয়ার ডেভেলপমেন্ট ও আন্তর্জাতিক সম্পাদক', en: 'Career Development & International Affairs Secretary' } },
  { photo: 'culture', name: { bn: 'হারেস মাতাব্বর', en: 'Hares Matabbar' }, post: { bn: 'সাহিত্য ও সাংস্কৃতিক সম্পাদক', en: 'Literature, Culture & Publication Secretary' } },
  { photo: 'culture-asst', name: { bn: 'জিহাদ হোসাইন', en: 'Zehad Hossain' }, post: { bn: 'সহ সাহিত্য ও সাংস্কৃতিক সম্পাদক', en: 'Deputy Literature, Culture & Publication Secretary' } },
  { photo: 'sports', name: { bn: 'মোহাম্মদ শাওন', en: 'Mohammad Shawon' }, post: { bn: 'খেলাধুলা ও ক্রীড়া সম্পাদক', en: 'Sports Secretary' } },
  { photo: 'women', name: { bn: 'নাহিমা আক্তার দীপা', en: 'Nahima Akter Dipa' }, post: { bn: 'ছাত্রী কল্যাণ সম্পাদক', en: 'Female Student Welfare Secretary' } },
  { photo: 'women-asst', name: { bn: 'জান্নাতুল ফেরদৌস রিতা', en: 'Jannatul Ferdause Rita' }, post: { bn: 'সহ ছাত্রী কল্যাণ সম্পাদক', en: 'Deputy Female Student Welfare Secretary' } },
  { photo: 'office', name: { bn: 'আব্দুল্লাহ আল নোমান', en: 'Abdullah Al Noman' }, post: { bn: 'দপ্তর সম্পাদক', en: 'Office Secretary' } },
  { photo: 'office-asst', name: { bn: 'জান্নাতুল আদন নুসরাত', en: 'Jannatul Adan Nusrat' }, post: { bn: 'সহ দপ্তর সম্পাদক', en: 'Deputy Office Secretary' } },
  { photo: 'member-1', name: { bn: 'জান্নাতুল ফেরদাউস সানজিদা', en: 'Jannatul Ferdaus Sanjida' }, post: MEMBER },
  { photo: 'member-2', name: { bn: 'আদনান শরীফ', en: 'Adnan Sharif' }, post: MEMBER },
  { photo: 'member-3', name: { bn: 'আকাশ দাশ', en: 'Akash Das' }, post: MEMBER },
  { photo: 'member-4', name: { bn: 'সালমান ফারসি', en: 'Salman Farshi' }, post: MEMBER },
  { photo: 'member-5', name: { bn: 'মো. সোহানুর রহমান', en: 'Md Sohanur Rahman' }, post: MEMBER },
]

/** Final central-union votes for the two top posts (Prothom Alo, 16 October 2025). */
export const TOP_VOTES = { vp: 7983, gs: 8031 }

const PUBLIC = path.join(process.cwd(), 'public')

/** Public URL of a file under public/, or undefined until someone adds it. */
function publicFile(rel: string): string | undefined {
  return fs.existsSync(path.join(PUBLIC, rel)) ? `/${rel}` : undefined
}

export type Winner = { name: string; post: string; photo?: string }

export function cucsuWinners(lang: Locale): Winner[] {
  return WINNERS.map((w) => ({ name: w.name[lang], post: w.post[lang], photo: publicFile(`cucsu/${w.photo}.jpg`) }))
}
