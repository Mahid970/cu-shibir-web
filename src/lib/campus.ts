/**
 * University of Chittagong: faculties, departments, halls and sessions.
 * Taken from the legacy cushibir.org forms, which cite the official directories
 * (cu.ac.bd/faculty-dept-inst, cu.ac.bd/residence-halls). Shared by the forms, the CMS and the campus guide.
 */

export type Option = { value: string; label: string }
export type Faculty = { value: string; label: string; departments: Option[] }

export const FACULTIES: Faculty[] = [
  {
    value: 'arts',
    label: 'কলা ও মানববিদ্যা অনুষদ',
    departments: [
      { value: 'bangla', label: 'বাংলা বিভাগ' },
      { value: 'english', label: 'ইংরেজি বিভাগ' },
      { value: 'history', label: 'ইতিহাস বিভাগ' },
      { value: 'philosophy', label: 'দর্শন বিভাগ' },
      { value: 'islamic_history_culture', label: 'ইসলামের ইতিহাস ও সংস্কৃতি বিভাগ' },
      { value: 'arabic', label: 'আরবি বিভাগ' },
      { value: 'islamic_studies', label: 'ইসলামী স্টাডিজ বিভাগ' },
      { value: 'dramatics', label: 'নাট্যকলা বিভাগ' },
      { value: 'persian_language_literature', label: 'ফারসি ভাষা ও সাহিত্য বিভাগ' },
      { value: 'pali', label: 'পালি বিভাগ' },
      { value: 'sanskrit', label: 'সংস্কৃত বিভাগ' },
      { value: 'music', label: 'সংগীত বিভাগ' },
      { value: 'bangladesh_studies', label: 'বাংলাদেশ স্টাডিজ বিভাগ' },
      { value: 'modern_languages', label: 'ইনস্টিটিউট অব মডার্ন ল্যাঙ্গুয়েজেস' },
      { value: 'fine_arts', label: 'ইনস্টিটিউট অব ফাইন আর্টস' },
    ],
  },
  {
    value: 'science',
    label: 'বিজ্ঞান অনুষদ',
    departments: [
      { value: 'physics', label: 'পদার্থবিদ্যা বিভাগ' },
      { value: 'chemistry', label: 'রসায়ন বিভাগ' },
      { value: 'mathematics', label: 'গণিত বিভাগ' },
      { value: 'statistics', label: 'পরিসংখ্যান বিভাগ' },
      { value: 'applied_chemistry_chemical_engineering', label: 'ফলিত রসায়ন ও কেমিকৌশল বিভাগ' },
      { value: 'forestry_environmental_sciences', label: 'ইনস্টিটিউট অব ফরেস্ট্রি অ্যান্ড এনভায়রনমেন্টাল সায়েন্সেস' },
      { value: 'jnicar', label: 'জামাল নজরুল ইসলাম সেন্টার ফর অ্যাডভান্সড রিসার্চ' },
    ],
  },
  {
    value: 'business',
    label: 'ব্যবসায় প্রশাসন অনুষদ',
    departments: [
      { value: 'accounting', label: 'অ্যাকাউন্টিং বিভাগ' },
      { value: 'management', label: 'ম্যানেজমেন্ট বিভাগ' },
      { value: 'finance', label: 'ফাইন্যান্স বিভাগ' },
      { value: 'marketing', label: 'মার্কেটিং বিভাগ' },
      { value: 'human_resource_management', label: 'হিউম্যান রিসোর্স ম্যানেজমেন্ট বিভাগ' },
      { value: 'banking_insurance', label: 'ব্যাংকিং অ্যান্ড ইন্স্যুরেন্স বিভাগ' },
      { value: 'cucba', label: 'চট্টগ্রাম ইউনিভার্সিটি সেন্টার ফর বিজনেস অ্যাডমিনিস্ট্রেশন' },
    ],
  },
  {
    value: 'social_sciences',
    label: 'সামাজিক বিজ্ঞান অনুষদ',
    departments: [
      { value: 'economics', label: 'অর্থনীতি বিভাগ' },
      { value: 'political_science', label: 'রাষ্ট্রবিজ্ঞান বিভাগ' },
      { value: 'sociology', label: 'সমাজবিজ্ঞান বিভাগ' },
      { value: 'public_administration', label: 'লোক প্রশাসন বিভাগ' },
      { value: 'anthropology', label: 'নৃবিজ্ঞান বিভাগ' },
      { value: 'international_relations', label: 'আন্তর্জাতিক সম্পর্ক বিভাগ' },
      { value: 'communication_journalism', label: 'যোগাযোগ ও সাংবাদিকতা বিভাগ' },
      { value: 'criminology_police_science', label: 'ক্রিমিনোলজি অ্যান্ড পুলিশ সায়েন্স বিভাগ' },
      { value: 'development_studies', label: 'ডেভেলপমেন্ট স্টাডিজ বিভাগ' },
    ],
  },
  { value: 'law', label: 'আইন অনুষদ', departments: [{ value: 'law', label: 'আইন বিভাগ' }] },
  {
    value: 'biological_sciences',
    label: 'জীববিজ্ঞান অনুষদ',
    departments: [
      { value: 'zoology', label: 'প্রাণিবিদ্যা বিভাগ' },
      { value: 'botany', label: 'উদ্ভিদবিদ্যা বিভাগ' },
      { value: 'geography_environmental_studies', label: 'ভূগোল ও পরিবেশবিদ্যা বিভাগ' },
      { value: 'biochemistry_molecular_biology', label: 'বায়োকেমিস্ট্রি অ্যান্ড মলিকুলার বায়োলজি বিভাগ' },
      { value: 'microbiology', label: 'মাইক্রোবায়োলজি বিভাগ' },
      { value: 'soil_science', label: 'মৃত্তিকা বিজ্ঞান বিভাগ' },
      { value: 'genetic_engineering_biotechnology', label: 'জেনেটিক ইঞ্জিনিয়ারিং অ্যান্ড বায়োটেকনোলজি বিভাগ' },
      { value: 'psychology', label: 'মনোবিজ্ঞান বিভাগ' },
      { value: 'pharmacy', label: 'ফার্মেসি বিভাগ' },
    ],
  },
  {
    value: 'engineering',
    label: 'প্রকৌশল অনুষদ',
    departments: [
      { value: 'computer_science_engineering', label: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ' },
      { value: 'electrical_electronic_engineering', label: 'ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং বিভাগ' },
    ],
  },
  {
    value: 'education',
    label: 'শিক্ষা অনুষদ',
    departments: [
      { value: 'physical_education_sports_science', label: 'শারীরিক শিক্ষা ও ক্রীড়াবিজ্ঞান বিভাগ' },
      { value: 'education_research', label: 'ইনস্টিটিউট অব এডুকেশন অ্যান্ড রিসার্চ' },
    ],
  },
  {
    value: 'marine_sciences_fisheries',
    label: 'মেরিন সায়েন্সেস ও ফিশারিজ অনুষদ',
    departments: [
      { value: 'marine_sciences', label: 'মেরিন সায়েন্সেস বিভাগ' },
      { value: 'oceanography', label: 'ওশানোগ্রাফি বিভাগ' },
      { value: 'fisheries', label: 'ফিশারিজ বিভাগ' },
    ],
  },
  {
    value: 'medicine',
    label: 'মেডিসিন অনুষদ',
    departments: [
      { value: 'paediatrics', label: 'পেডিয়াট্রিকস বিভাগ' },
      { value: 'community_ophthalmology', label: 'ইনস্টিটিউট অব কমিউনিটি অফথ্যালমোলজি' },
    ],
  },
]

export const DEPARTMENTS: Option[] = FACULTIES.flatMap((f) => f.departments)

export const HALLS: Option[] = [
  { value: 'alaol', label: 'আলাওল হল' },
  { value: 'af_rahman', label: 'এ. এফ. রহমান হল' },
  { value: 'shahjalal', label: 'শাহজালাল হল' },
  { value: 'suhrawardy', label: 'সোহরাওয়ার্দী হল' },
  { value: 'shah_amanat', label: 'শাহ আমানত হল' },
  { value: 'shamsun_nahar', label: 'শামসুন নাহার হল' },
  { value: 'shaheed_abdur_rab', label: 'শহীদ আবদুর রব হল' },
  { value: 'pritilata', label: 'প্রীতিলতা হল' },
  { value: 'deshnetri_khaleda_zia', label: 'দেশনেত্রী বেগম খালেদা জিয়া হল' },
  { value: 'masterda_surja_sen', label: 'মাস্টারদা সূর্য সেন হল' },
  { value: 'shaheed_farhad_hossain', label: 'শহীদ ফরহাদ হোসেন হল' },
  { value: 'bijoy_24', label: 'বিজয় ২৪ হল' },
  { value: 'nawab_faizunnesa', label: 'নবাব ফয়জুন্নেসা হল' },
  { value: 'atish_dipangkar', label: 'অতীশ দীপঙ্কর হল' },
  { value: 'shilpi_rashid_chowdhury_hostel', label: 'শিল্পী রশিদ চৌধুরী হোস্টেল' },
]

/** Students who live off campus pick this instead of a hall. */
export const NON_RESIDENT: Option = { value: 'non_resident', label: 'হলে থাকি না (অনাবাসিক)' }

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
    return { value, label: bnDigits(value) }
  })
}

export const labelOf = (options: Option[], value: string | null | undefined) =>
  options.find((o) => o.value === value)?.label ?? value ?? ''
