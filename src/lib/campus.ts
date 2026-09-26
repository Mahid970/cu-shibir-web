/**
 * University of Chittagong: faculties, departments, halls and sessions.
 * Taken from the legacy cushibir.org forms, which cite the official directories
 * (cu.ac.bd/faculty-dept-inst, cu.ac.bd/residence-halls). Shared by the forms, the CMS and the campus guide.
 */

import type { Locale } from '@/i18n/config'

/** `label` is Bangla (also what the CMS shows); `en` is the official English name. */
export type Option = { value: string; label: string; en: string }
export type Faculty = Option & { departments: Option[] }

export const FACULTIES: Faculty[] = [
  {
    value: 'arts',
    label: 'কলা ও মানববিদ্যা অনুষদ',
    en: 'Faculty of Arts and Humanities',
    departments: [
      { value: 'bangla', label: 'বাংলা বিভাগ', en: 'Department of Bangla' },
      { value: 'english', label: 'ইংরেজি বিভাগ', en: 'Department of English' },
      { value: 'history', label: 'ইতিহাস বিভাগ', en: 'Department of History' },
      { value: 'philosophy', label: 'দর্শন বিভাগ', en: 'Department of Philosophy' },
      { value: 'islamic_history_culture', label: 'ইসলামের ইতিহাস ও সংস্কৃতি বিভাগ', en: 'Department of Islamic History and Culture' },
      { value: 'arabic', label: 'আরবি বিভাগ', en: 'Department of Arabic' },
      { value: 'islamic_studies', label: 'ইসলামী স্টাডিজ বিভাগ', en: 'Department of Islamic Studies' },
      { value: 'dramatics', label: 'নাট্যকলা বিভাগ', en: 'Department of Dramatics' },
      { value: 'persian_language_literature', label: 'ফারসি ভাষা ও সাহিত্য বিভাগ', en: 'Department of Persian Language and Literature' },
      { value: 'pali', label: 'পালি বিভাগ', en: 'Department of Pali' },
      { value: 'sanskrit', label: 'সংস্কৃত বিভাগ', en: 'Department of Sanskrit' },
      { value: 'music', label: 'সংগীত বিভাগ', en: 'Department of Music' },
      { value: 'bangladesh_studies', label: 'বাংলাদেশ স্টাডিজ বিভাগ', en: 'Department of Bangladesh Studies' },
      { value: 'modern_languages', label: 'ইনস্টিটিউট অব মডার্ন ল্যাঙ্গুয়েজেস', en: 'Institute of Modern Languages' },
      { value: 'fine_arts', label: 'ইনস্টিটিউট অব ফাইন আর্টস', en: 'Institute of Fine Arts' },
    ],
  },
  {
    value: 'science',
    label: 'বিজ্ঞান অনুষদ',
    en: 'Faculty of Science',
    departments: [
      { value: 'physics', label: 'পদার্থবিদ্যা বিভাগ', en: 'Department of Physics' },
      { value: 'chemistry', label: 'রসায়ন বিভাগ', en: 'Department of Chemistry' },
      { value: 'mathematics', label: 'গণিত বিভাগ', en: 'Department of Mathematics' },
      { value: 'statistics', label: 'পরিসংখ্যান বিভাগ', en: 'Department of Statistics' },
      { value: 'applied_chemistry_chemical_engineering', label: 'ফলিত রসায়ন ও কেমিকৌশল বিভাগ', en: 'Department of Applied Chemistry and Chemical Engineering' },
      { value: 'forestry_environmental_sciences', label: 'ইনস্টিটিউট অব ফরেস্ট্রি অ্যান্ড এনভায়রনমেন্টাল সায়েন্সেস', en: 'Institute of Forestry and Environmental Sciences' },
      { value: 'jnicar', label: 'জামাল নজরুল ইসলাম সেন্টার ফর অ্যাডভান্সড রিসার্চ', en: 'Jamal Nazrul Islam Centre for Advanced Research' },
    ],
  },
  {
    value: 'business',
    label: 'ব্যবসায় প্রশাসন অনুষদ',
    en: 'Faculty of Business Administration',
    departments: [
      { value: 'accounting', label: 'অ্যাকাউন্টিং বিভাগ', en: 'Department of Accounting' },
      { value: 'management', label: 'ম্যানেজমেন্ট বিভাগ', en: 'Department of Management' },
      { value: 'finance', label: 'ফাইন্যান্স বিভাগ', en: 'Department of Finance' },
      { value: 'marketing', label: 'মার্কেটিং বিভাগ', en: 'Department of Marketing' },
      { value: 'human_resource_management', label: 'হিউম্যান রিসোর্স ম্যানেজমেন্ট বিভাগ', en: 'Department of Human Resource Management' },
      { value: 'banking_insurance', label: 'ব্যাংকিং অ্যান্ড ইন্স্যুরেন্স বিভাগ', en: 'Department of Banking and Insurance' },
      { value: 'cucba', label: 'চট্টগ্রাম ইউনিভার্সিটি সেন্টার ফর বিজনেস অ্যাডমিনিস্ট্রেশন', en: 'Chittagong University Centre for Business Administration' },
    ],
  },
  {
    value: 'social_sciences',
    label: 'সামাজিক বিজ্ঞান অনুষদ',
    en: 'Faculty of Social Sciences',
    departments: [
      { value: 'economics', label: 'অর্থনীতি বিভাগ', en: 'Department of Economics' },
      { value: 'political_science', label: 'রাষ্ট্রবিজ্ঞান বিভাগ', en: 'Department of Political Science' },
      { value: 'sociology', label: 'সমাজবিজ্ঞান বিভাগ', en: 'Department of Sociology' },
      { value: 'public_administration', label: 'লোক প্রশাসন বিভাগ', en: 'Department of Public Administration' },
      { value: 'anthropology', label: 'নৃবিজ্ঞান বিভাগ', en: 'Department of Anthropology' },
      { value: 'international_relations', label: 'আন্তর্জাতিক সম্পর্ক বিভাগ', en: 'Department of International Relations' },
      { value: 'communication_journalism', label: 'যোগাযোগ ও সাংবাদিকতা বিভাগ', en: 'Department of Communication and Journalism' },
      { value: 'criminology_police_science', label: 'ক্রিমিনোলজি অ্যান্ড পুলিশ সায়েন্স বিভাগ', en: 'Department of Criminology and Police Science' },
      { value: 'development_studies', label: 'ডেভেলপমেন্ট স্টাডিজ বিভাগ', en: 'Department of Development Studies' },
    ],
  },
  { value: 'law', label: 'আইন অনুষদ', en: 'Faculty of Law', departments: [{ value: 'law', label: 'আইন বিভাগ', en: 'Department of Law' }] },
  {
    value: 'biological_sciences',
    label: 'জীববিজ্ঞান অনুষদ',
    en: 'Faculty of Biological Sciences',
    departments: [
      { value: 'zoology', label: 'প্রাণিবিদ্যা বিভাগ', en: 'Department of Zoology' },
      { value: 'botany', label: 'উদ্ভিদবিদ্যা বিভাগ', en: 'Department of Botany' },
      { value: 'geography_environmental_studies', label: 'ভূগোল ও পরিবেশবিদ্যা বিভাগ', en: 'Department of Geography and Environmental Studies' },
      { value: 'biochemistry_molecular_biology', label: 'বায়োকেমিস্ট্রি অ্যান্ড মলিকুলার বায়োলজি বিভাগ', en: 'Department of Biochemistry and Molecular Biology' },
      { value: 'microbiology', label: 'মাইক্রোবায়োলজি বিভাগ', en: 'Department of Microbiology' },
      { value: 'soil_science', label: 'মৃত্তিকা বিজ্ঞান বিভাগ', en: 'Department of Soil Science' },
      { value: 'genetic_engineering_biotechnology', label: 'জেনেটিক ইঞ্জিনিয়ারিং অ্যান্ড বায়োটেকনোলজি বিভাগ', en: 'Department of Genetic Engineering and Biotechnology' },
      { value: 'psychology', label: 'মনোবিজ্ঞান বিভাগ', en: 'Department of Psychology' },
      { value: 'pharmacy', label: 'ফার্মেসি বিভাগ', en: 'Department of Pharmacy' },
    ],
  },
  {
    value: 'engineering',
    label: 'প্রকৌশল অনুষদ',
    en: 'Faculty of Engineering',
    departments: [
      { value: 'computer_science_engineering', label: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ', en: 'Department of Computer Science and Engineering' },
      { value: 'electrical_electronic_engineering', label: 'ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং বিভাগ', en: 'Department of Electrical and Electronic Engineering' },
    ],
  },
  {
    value: 'education',
    label: 'শিক্ষা অনুষদ',
    en: 'Faculty of Education',
    departments: [
      { value: 'physical_education_sports_science', label: 'শারীরিক শিক্ষা ও ক্রীড়াবিজ্ঞান বিভাগ', en: 'Department of Physical Education and Sports Science' },
      { value: 'education_research', label: 'ইনস্টিটিউট অব এডুকেশন অ্যান্ড রিসার্চ', en: 'Institute of Education and Research' },
    ],
  },
  {
    value: 'marine_sciences_fisheries',
    label: 'মেরিন সায়েন্সেস ও ফিশারিজ অনুষদ',
    en: 'Faculty of Marine Sciences and Fisheries',
    departments: [
      { value: 'marine_sciences', label: 'মেরিন সায়েন্সেস বিভাগ', en: 'Department of Marine Sciences' },
      { value: 'oceanography', label: 'ওশানোগ্রাফি বিভাগ', en: 'Department of Oceanography' },
      { value: 'fisheries', label: 'ফিশারিজ বিভাগ', en: 'Department of Fisheries' },
    ],
  },
  {
    value: 'medicine',
    label: 'মেডিসিন অনুষদ',
    en: 'Faculty of Medicine',
    departments: [
      { value: 'paediatrics', label: 'পেডিয়াট্রিকস বিভাগ', en: 'Department of Paediatrics' },
      { value: 'community_ophthalmology', label: 'ইনস্টিটিউট অব কমিউনিটি অফথ্যালমোলজি', en: 'Institute of Community Ophthalmology' },
    ],
  },
]

export const DEPARTMENTS: Option[] = FACULTIES.flatMap((f) => f.departments)

export const HALLS: Option[] = [
  { value: 'alaol', label: 'আলাওল হল', en: 'Alaol Hall' },
  { value: 'af_rahman', label: 'এ. এফ. রহমান হল', en: 'A. F. Rahman Hall' },
  { value: 'shahjalal', label: 'শাহজালাল হল', en: 'Shahjalal Hall' },
  { value: 'suhrawardy', label: 'সোহরাওয়ার্দী হল', en: 'Suhrawardy Hall' },
  { value: 'shah_amanat', label: 'শাহ আমানত হল', en: 'Shah Amanat Hall' },
  { value: 'shamsun_nahar', label: 'শামসুন নাহার হল', en: 'Shamsun Nahar Hall' },
  { value: 'shaheed_abdur_rab', label: 'শহীদ আবদুর রব হল', en: 'Shaheed Abdur Rab Hall' },
  { value: 'pritilata', label: 'প্রীতিলতা হল', en: 'Pritilata Hall' },
  { value: 'deshnetri_khaleda_zia', label: 'দেশনেত্রী বেগম খালেদা জিয়া হল', en: 'Deshnetri Begum Khaleda Zia Hall' },
  { value: 'masterda_surja_sen', label: 'মাস্টারদা সূর্য সেন হল', en: 'Masterda Surya Sen Hall' },
  { value: 'shaheed_farhad_hossain', label: 'শহীদ ফরহাদ হোসেন হল', en: 'Shaheed Farhad Hossain Hall' },
  { value: 'bijoy_24', label: 'বিজয় ২৪ হল', en: 'Bijoy 24 Hall' },
  { value: 'nawab_faizunnesa', label: 'নবাব ফয়জুন্নেসা হল', en: 'Nawab Faizunnesa Hall' },
  { value: 'atish_dipangkar', label: 'অতীশ দীপঙ্কর হল', en: 'Atish Dipankar Hall' },
  { value: 'shilpi_rashid_chowdhury_hostel', label: 'শিল্পী রশিদ চৌধুরী হোস্টেল', en: 'Shilpi Rashid Chowdhury Hostel' },
]

/** Students who live off campus pick this instead of a hall. */
export const NON_RESIDENT: Option = { value: 'non_resident', label: 'হলে থাকি না (অনাবাসিক)', en: 'I don’t live in a hall (non-resident)' }

const bnDigits = (s: string) => s.replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)])

/**
 * The most recent academic sessions, newest first ("2025-26" → "২০২৫-২৬"). Admission runs about a year
 * behind the session name: first-year classes of session 2025-26 begin around July 2026.
 */
export function recentSessions(now = new Date(), count = 8): Option[] {
  const startYear = now.getUTCMonth() >= 6 ? now.getUTCFullYear() - 1 : now.getUTCFullYear() - 2
  return Array.from({ length: count }, (_, i) => {
    const y = startYear - i
    const value = `${y}-${String((y + 1) % 100).padStart(2, '0')}`
    return { value, label: bnDigits(value), en: value }
  })
}

export const labelOf = (options: Option[], value: string | null | undefined) =>
  options.find((o) => o.value === value)?.label ?? value ?? ''

/** An option's name in the page's language. */
export const optionLabel = (option: Option, lang: Locale) => (lang === 'en' ? option.en : option.label)

/** Options for a form <select> in the page's language. */
export const localizeOptions = (options: Option[], lang: Locale) => options.map((o) => ({ value: o.value, label: optionLabel(o, lang) }))
