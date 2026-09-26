import type { Locale } from '@/i18n/config'

/** How the outlets write their own names in English (press coverage is entered in Bangla). */
const OUTLETS_EN: Record<string, string> = {
  'প্রথম আলো': 'Prothom Alo',
  'যুগান্তর': 'Jugantor',
  'যুগান্তর নিউজ': 'Jugantor',
  'ইনকিলাব': 'Daily Inqilab',
  'কালবেলা': 'Kalbela',
  'সময়ের আলো': 'Shomoyer Alo',
  'দেশ রূপান্তর': 'Desh Rupantor',
  'নয়া দিগন্ত': 'Naya Diganta',
  'দৈনিক সংগ্রাম': 'Daily Sangram',
  'আমার দেশ': 'Amar Desh',
  'সমকাল': 'Samakal',
  'ইত্তেফাক': 'Ittefaq',
  'কালের কণ্ঠ': 'Kaler Kantho',
  'বাংলাদেশ প্রতিদিন': 'Bangladesh Pratidin',
  'মানবজমিন': 'Manab Zamin',
  'বাংলা ট্রিবিউন': 'Bangla Tribune',
  'ঢাকা পোস্ট': 'Dhaka Post',
  'জাগো নিউজ': 'Jago News',
  'রাইজিংবিডি': 'Risingbd',
  'আজকের পত্রিকা': 'Ajker Patrika',
  'দৈনিক আজাদী': 'Dainik Azadi',
  'পূর্বকোণ': 'Purbokone',
  'সুপ্রভাত বাংলাদেশ': 'Suprobhat Bangladesh',
}

const EN = new Map(Object.entries(OUTLETS_EN).map(([bn, en]) => [bn.normalize('NFC'), en]))

export const outletName = (outlet: string, lang: Locale) => (lang === 'en' ? (EN.get(outlet.normalize('NFC')) ?? outlet) : outlet)
