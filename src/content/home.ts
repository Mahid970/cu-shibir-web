/**
 * Homepage copy that is not (yet) managed in the CMS, in Bangla and English. Every fact here
 * comes from the research notes in the plan (§1) or from posts already published on the site.
 */
import type { Locale } from '@/i18n/config'

type L<T = string> = Record<Locale, T>

/** The branch's story in five dates (verified in the plan's research, §1). */
export const MILESTONES: { year: number; label: L; color: string }[] = [
  { year: 1977, label: { bn: 'ঢাকায় ছাত্রশিবিরের প্রতিষ্ঠা', en: 'Chhatrashibir founded in Dhaka' }, color: 'text-[#6cc6ee]' },
  { year: 1981, label: { bn: 'চাকসুর পূর্ণ প্যানেলে জয়', en: 'Full panel wins CUCSU' }, color: 'text-aqua' },
  { year: 2024, label: { bn: 'এক যুগ পর আবার প্রকাশ্যে', en: 'Back in the open after a decade' }, color: 'text-mint' },
  { year: 2025, label: { bn: 'চাকসুতে ২৬ পদের ২৪টিতে জয়', en: '24 of 26 CUCSU posts won' }, color: 'text-glow' },
  { year: 2026, label: { bn: 'নতুন কমিটি, নতুন পথচলা', en: 'A new committee, a new start' }, color: 'text-[#ff9f5e]' },
]

/** Fallback for Site settings → stats (shown as floating badges on the hero photos). */
export const DEFAULT_STATS: L<{ value: number; suffix: string; label: string }[]> = {
  bn: [
    { value: 24, suffix: '/২৬', label: 'চাকসু ২০২৫-এ পদে জয়' },
    { value: 2500, suffix: '+', label: 'নবীন এসেছিল নবীনবরণে' },
  ],
  en: [
    { value: 24, suffix: '/26', label: 'CUCSU 2025 posts won' },
    { value: 2500, suffix: '+', label: 'freshers at our reception' },
  ],
}

/** Slogan and hero intro when Site settings has no English version yet. */
export const HERO_DEFAULTS: L<{ tagline: string; intro: string }> = {
  bn: { tagline: 'আমরা তরুণ, আমরাই পারি', intro: '' },
  en: {
    tagline: 'We are young, we can do it',
    intro: 'Beside the students of the University of Chittagong in class, in the halls, on the shuttle and in every movement, to build honest, skilled and patriotic citizens.',
  },
}

/** Member levels, in order. */
export const JOURNEY = [
  { title: { bn: 'কর্মী', en: 'Worker' }, text: { bn: 'কর্মী সিলেবাস ও নিয়মিত কার্যক্রম', en: 'Worker syllabus and regular activities' }, icon: 'book', bg: '#fdf3e7' },
  { title: { bn: 'সাথী', en: 'Associate' }, text: { bn: 'সাথী সিলেবাস ও শিক্ষা শিবির', en: 'Associate syllabus and training camps' }, icon: 'tent', bg: '#e8f6fa' },
  { title: { bn: 'সদস্য', en: 'Member' }, text: { bn: 'সদস্য সিলেবাস ও সর্বোচ্চ দায়িত্ব', en: 'Member syllabus and the highest responsibility' }, icon: 'medal', bg: '#e9f9ff' },
] as const

/** Student problems and what the branch did about them (each links to the record). */
export const PROBLEMS = [
  {
    tag: { bn: 'আবাসন', en: 'Housing' },
    tone: 'sky',
    problem: {
      bn: 'হলে পর্যাপ্ত সিট নেই। অনেক শিক্ষার্থীকে ক্যাম্পাসের বাইরে থেকে শাটলে যাতায়াত করতে হয়।',
      en: 'The halls do not have enough seats. Many students live off campus and travel in on the shuttle train.',
    },
    answer: {
      bn: 'শতভাগ আবাসন, আবাসন ভাতা এবং চাকসু ও সিনেট নির্বাচনসহ ৫ দফা দাবিতে সংবাদ সম্মেলন।',
      en: 'A press conference with five demands, including full residential seats, a housing allowance and CUCSU and Senate elections.',
    },
    href: '/news/shotbhag-abason-abason-bhata-chaksu-o-sinet-nirbachon-soh-5-dofa-dabi-ebong',
  },
  {
    tag: { bn: 'বিশুদ্ধ পানি', en: 'Drinking water' },
    tone: 'sand',
    problem: {
      bn: 'তীব্র গরমে ক্যাম্পাসের ব্যস্ত জায়গাগুলোতে খাবার পানির সংকট।',
      en: 'In the summer heat, the busiest spots on campus run short of drinking water.',
    },
    answer: { bn: 'শহীদ মীর মুগ্ধর নামে ক্যাম্পাসে ওয়াটার কর্নার স্থাপন।', en: 'A drinking-water corner on campus, named after Shaheed Mir Mugdho.' },
    href: '/news/shohid-mir-mugdhor-name-oyatar-kornar-sthapon-chobi-shibirer',
  },
  {
    tag: { bn: 'নবীন শিক্ষার্থী', en: 'New students' },
    tone: 'pink',
    problem: {
      bn: 'নতুন ক্যাম্পাস, নতুন শহর — প্রথম বর্ষে কোথায় কী, কার কাছে যাব বোঝা যায় না।',
      en: 'A new campus in a new city: in first year it is hard to know where things are and whom to ask.',
    },
    answer: {
      bn: 'আড়াই হাজারের বেশি নবীন নিয়ে ফ্রেশারস রিসিপশন ও ক্যারিয়ার গাইডলাইন প্রোগ্রাম ২০২৬।',
      en: 'Freshers’ Reception and Career Guideline Programme 2026, with more than 2,500 new students.',
    },
    href: '/news/freshers-reception-career-guideline-program-2026',
  },
] as const

/** ৫ দফা কর্মসূচি with activities already carried out on campus. */
export const FIVE_POINTS = [
  {
    title: { bn: 'দাওয়াত', en: 'Dawah' },
    body: {
      bn: 'তরুণ ছাত্রসমাজের কাছে ইসলামের আহ্বান পৌঁছে দেওয়া এবং জীবনে তার অনুশীলনে উৎসাহিত করা।',
      en: 'Bringing the message of Islam to young students and encouraging them to live by it.',
    },
    items: {
      bn: ['নবীনবরণ ও ক্যারিয়ার গাইডলাইন প্রোগ্রাম', 'কুরআন অলিম্পিয়াড', 'আলোচনা সভা ও দোয়া মাহফিল'],
      en: ['Freshers’ reception and career guideline programme', 'Quran Olympiad', 'Discussions and dua mahfils'],
    },
    icon: 'megaphone',
    color: '#1c9bd6',
    ink: '#ffffff',
  },
  {
    title: { bn: 'সংগঠন', en: 'Organisation' },
    body: {
      bn: 'ইসলামী জীবনবিধান প্রতিষ্ঠার কাজে অংশ নিতে প্রস্তুত ছাত্রদের সংঘবদ্ধ করা।',
      en: 'Bringing together students who are ready to take part in establishing the Islamic way of life.',
    },
    items: {
      bn: ['হল ও অনুষদভিত্তিক কার্যক্রম', 'কর্মী থেকে সাথী ও সদস্য স্তরে মানোন্নয়ন', 'নিয়মিত সাংগঠনিক বৈঠক'],
      en: ['Work in every hall and faculty', 'Growing from worker to associate and member', 'Regular organisational meetings'],
    },
    icon: 'ballot',
    color: '#8fd3f7',
    ink: '#0a2233',
  },
  {
    title: { bn: 'প্রশিক্ষণ', en: 'Training' },
    body: {
      bn: 'জ্ঞান ও চরিত্রে গড়ে তুলে যোগ্য, দক্ষ কর্মী হিসেবে প্রস্তুত করা।',
      en: 'Building knowledge and character so that members grow into capable, skilled workers.',
    },
    items: {
      bn: ['সাথী শিক্ষা শিবির ২০২৬', 'সিলেবাসভিত্তিক পাঠচক্র', 'স্কিল ডেভেলপমেন্ট কার্যক্রম'],
      en: ['Associate training camp 2026', 'Study circles based on the syllabus', 'Skills development programmes'],
    },
    icon: 'cap',
    color: '#5cc8c0',
    ink: '#0a2233',
  },
  {
    title: { bn: 'শিক্ষা আন্দোলন ও ছাত্রসমস্যার সমাধান', en: 'Education movement and student welfare' },
    body: {
      bn: 'মূল্যবোধভিত্তিক শিক্ষাব্যবস্থার দাবি এবং শিক্ষার্থীদের প্রকৃত সমস্যা সমাধানে নেতৃত্ব।',
      en: 'Campaigning for value-based education and leading on the real problems students face.',
    },
    items: {
      bn: ['শতভাগ আবাসনের দাবিতে সংবাদ সম্মেলন', 'চাকসু ও সিনেট নির্বাচনের দাবি', 'নিরাপদ ক্যাম্পাসের দাবিতে বিক্ষোভ'],
      en: ['Press conference demanding housing for every student', 'Call for CUCSU and Senate elections', 'Protest for a safe campus'],
    },
    icon: 'book',
    color: '#0b6fa4',
    ink: '#ffffff',
  },
  {
    title: { bn: 'ইসলামী সমাজ বিনির্মাণ', en: 'Building an Islamic society' },
    body: {
      bn: 'শোষণ, নিপীড়ন ও সাংস্কৃতিক গোলামি থেকে মুক্ত একটি সমাজ গড়ার সার্বিক প্রচেষ্টা।',
      en: 'An all-round effort to build a society free from exploitation, oppression and cultural subjugation.',
    },
    items: {
      bn: ['শহীদ মীর মুগ্ধ ওয়াটার কর্নার', 'বৃক্ষরোপণ অভিযান ২০২৬', 'ইসলামী শিক্ষা দিবসে আলোচনা সভা'],
      en: ['Shaheed Mir Mugdho water corner', 'Tree-planting drive 2026', 'Discussion on Islamic Education Day'],
    },
    icon: 'seedling',
    color: '#ffc561',
    ink: '#0a2233',
  },
] as const

export const JOIN_STEPS = [
  {
    title: { bn: 'যোগাযোগ করো', en: 'Get in touch' },
    text: { bn: 'ফেসবুক পেজে মেসেজ দাও বা তোমার হল/বিভাগের দায়িত্বশীলকে জানাও।', en: 'Message our Facebook page, or tell the leader in your hall or department.' },
    color: '#5eead4',
  },
  {
    title: { bn: 'সমর্থক হও', en: 'Become a supporter' },
    text: { bn: 'সমর্থক ফরম পূরণ করো — শুধু প্রয়োজনীয় তথ্য, নিরাপদে সংরক্ষিত।', en: 'Fill in the supporter form: only what we need, stored securely.' },
    color: '#ffc561',
  },
  {
    title: { bn: 'প্রোগ্রামে এসো', en: 'Come to a programme' },
    text: { bn: 'পাঠচক্র, আলোচনা সভা আর ক্যাম্পাসের কর্মসূচিতে অংশ নাও।', en: 'Join study circles, discussions and our work on campus.' },
    color: '#4ade80',
  },
  {
    title: { bn: 'দায়িত্ব নাও', en: 'Take responsibility' },
    text: { bn: 'কর্মী সিলেবাস শুরু করো, শিক্ষার্থীদের পাশে দাঁড়াও।', en: 'Start the worker syllabus and stand by your fellow students.' },
    color: '#a78bfa',
  },
] as const

/** Student services (roadmap Phase 4). Entries with `href` are live; the rest are shown as upcoming. */
export const SERVICES = [
  {
    title: { bn: 'শাটল ট্রেনের সময়সূচি', en: 'Shuttle train timetable' },
    text: { bn: 'পরের ট্রেন কখন, কোন স্টেশন থেকে — এক নজরে।', en: 'When the next train leaves, and from which station, at a glance.' },
    theme: 'blue',
    icon: 'train',
    href: '/services/shuttle',
  },
  {
    title: { bn: 'নবীন গাইড ও ক্যাম্পাস ম্যাপ', en: 'Freshers’ guide and campus map' },
    text: { bn: 'হল, অনুষদ, মেডিকেল সেন্টার, মসজিদ — সব কোথায়।', en: 'Halls, faculties, the medical centre, mosques: where everything is.' },
    theme: 'teal',
    icon: 'cap',
    href: '/services/freshers',
  },
  {
    title: { bn: 'প্রশ্ন ব্যাংক', en: 'Question bank' },
    text: { bn: 'বিভাগ ও কোর্স অনুযায়ী আগের বছরের প্রশ্ন।', en: 'Past exam questions by department and course.' },
    theme: 'purple',
    icon: 'book',
    href: '/services/questions',
  },
  {
    title: { bn: 'রক্তদাতা নেটওয়ার্ক', en: 'Blood donor network' },
    text: { bn: 'জরুরি প্রয়োজনে রক্তদাতা খোঁজা, নম্বর প্রকাশ না করেই।', en: 'Find a blood donor in an emergency without publishing anyone’s number.' },
    theme: 'pink',
    icon: 'drop',
    href: '/services/blood',
  },
  {
    title: { bn: 'শিক্ষাবৃত্তি ও চিকিৎসা সহায়তা', en: 'Scholarships and medical aid' },
    text: { bn: 'অনলাইনে আবেদন আর ট্র্যাকিং কোড দিয়ে অগ্রগতি দেখা।', en: 'Apply online and follow your application with a tracking code.' },
    theme: 'orange',
    icon: 'medal',
    href: '/services/assistance',
  },
  {
    title: { bn: 'ছাত্র সমস্যা ডেস্ক', en: 'Student issues desk' },
    text: { bn: 'হল, পরিবহন, খাবার বা নিরাপত্তা — সমস্যা জানাও, সমাধান ট্র্যাক করো।', en: 'Halls, transport, food or safety: report a problem and follow the fix.' },
    theme: 'green',
    icon: 'megaphone',
    href: '/services/issues',
  },
] as const

export const FAQS: L<{ q: string; a: string }[]> = {
  bn: [
    {
      q: 'বাংলাদেশ ইসলামী ছাত্রশিবির কী?',
      a: '১৯৭৭ সালের ৬ ফেব্রুয়ারি ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় মসজিদে প্রতিষ্ঠিত একটি ছাত্রসংগঠন। সমৃদ্ধ বাংলাদেশ গড়ার লক্ষ্যে সৎ, দক্ষ ও দেশপ্রেমিক নাগরিক তৈরি করা এর স্বপ্ন।',
    },
    {
      q: 'সংগঠনের লক্ষ্য কী?',
      a: 'আল্লাহ প্রদত্ত ও রাসূল (সা.) প্রদর্শিত বিধান অনুযায়ী মানুষের সার্বিক জীবনের পুনর্বিন্যাস সাধন করে আল্লাহর সন্তুষ্টি অর্জন।',
    },
    {
      q: 'চট্টগ্রাম বিশ্ববিদ্যালয়ে শাখার পথচলা কেমন?',
      a: '১৯৮১ সালে চাকসুর পূর্ণ প্যানেলে জয়। দীর্ঘ এক যুগ প্রকাশ্য কার্যক্রম বন্ধ থাকার পর ২০২৪ সালে আবার প্রকাশ্যে। ২০২৫ সালের চাকসু নির্বাচনে সমর্থিত প্যানেল ২৬টি পদের ২৪টিতে জয়ী হয়।',
    },
    {
      q: 'কীভাবে যুক্ত হতে পারি?',
      a: 'ফেসবুক পেজে মেসেজ দাও অথবা তোমার হল বা বিভাগের দায়িত্বশীলের সাথে কথা বলো। অথবা এই ওয়েবসাইটের সমর্থক ফরম পূরণ করো।',
    },
    {
      q: 'ফরমে দেওয়া তথ্য কি গোপন থাকবে?',
      a: 'হ্যাঁ। ফরমে শুধু প্রয়োজনীয় তথ্য নেওয়া হয় এবং নাম ও যোগাযোগের তথ্য এনক্রিপ্ট করে রাখা হয়। দায়িত্বপ্রাপ্ত ছাড়া কেউ দেখতে পারেন না। বিস্তারিত গোপনীয়তা নীতিতে।',
    },
    {
      q: 'অভিযোগ, পরামর্শ বা এহতেসাব কোথায় জানাব?',
      a: 'ওয়েবসাইটের এহতেসাব ও পরামর্শ ফরমে লেখো (চাইলে নাম ছাড়াই), অথবা cuchhatrashibir@gmail.com ঠিকানায় ইমেইল করো। সংশ্লিষ্ট দায়িত্বশীল উত্তর দেবেন।',
    },
  ],
  en: [
    {
      q: 'What is Bangladesh Islami Chhatrashibir?',
      a: 'A student organisation founded on 6 February 1977 at the Central Mosque of the University of Dhaka. Its vision is to build honest, skilled and patriotic citizens for a prosperous Bangladesh.',
    },
    {
      q: 'What is the organisation’s goal?',
      a: 'To attain the pleasure of Allah by rebuilding every aspect of human life according to the guidance given by Allah and shown by the Messenger (peace be upon him).',
    },
    {
      q: 'What is the branch’s story at the University of Chittagong?',
      a: 'In 1981 its full panel won the Chittagong University Central Students’ Union (CUCSU). After more than a decade without open activity, the branch returned in 2024, and in the 2025 CUCSU election the panel it backed won 24 of the 26 posts.',
    },
    {
      q: 'How can I get involved?',
      a: 'Message our Facebook page or talk to the leader in your hall or department. Or fill in the supporter form on this website.',
    },
    {
      q: 'Will the information I give in a form stay private?',
      a: 'Yes. The forms ask only for what is needed, and names and contact details are stored encrypted. Only the people responsible can see them. The privacy policy has the details.',
    },
    {
      q: 'Where can I send a complaint, advice or ehtesab?',
      a: 'Use the ehtesab and advice form on this website (you can leave your name out), or email cuchhatrashibir@gmail.com. The leader concerned will reply.',
    },
  ],
}

export const CONTACT_TOPICS: L<string[]> = {
  bn: ['আবাসন ও হলের সমস্যা', 'শাটল ও পরিবহন', 'ক্যাম্পাসের নিরাপত্তা', 'একাডেমিক জটিলতা', 'পরামর্শ ও এহতেসাব'],
  en: ['Housing and hall problems', 'Shuttle and transport', 'Campus safety', 'Academic problems', 'Advice and ehtesab'],
}
