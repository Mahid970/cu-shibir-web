/**
 * English copy for /en. Facts match the Bangla pages and the plan's research notes (§1);
 * anything the branch publishes only in Bangla is linked, not translated here.
 */

export const EN = {
  name: 'Bangladesh Islami Chhatrashibir',
  branch: 'University of Chittagong branch',
  intro:
    'A student organisation at the University of Chittagong. We invite students to Islam, train them in knowledge and character, and stand with them on housing, transport, safety and the everyday problems of campus life.',
  who: [
    'Bangladesh Islami Chhatrashibir was founded on 6 February 1977 at the Central Mosque of the University of Dhaka. Its vision is to build honest, skilled and patriotic citizens for a prosperous Bangladesh.',
    'The University of Chittagong branch works among students of the university’s faculties, halls and hostels on a hill campus of about 2,300 acres at Hathazari, 22 km north of Chattogram city.',
  ],
  goal: 'To attain the pleasure of Allah by rebuilding every aspect of human life according to the guidance given by Allah and shown by the Messenger (peace be upon him).',
  vision: 'Honest, skilled and patriotic citizens for a prosperous Bangladesh.',
  milestones: [
    { year: 1977, label: 'Founded in Dhaka' },
    { year: 1981, label: 'Full panel wins the Chittagong University Central Students’ Union (CUCSU)' },
    { year: 2024, label: 'Open activity on campus again after more than a decade' },
    { year: 2025, label: 'Backed panel wins 24 of 26 CUCSU posts' },
    { year: 2026, label: 'New committee takes office' },
  ],
  programme: [
    { title: 'Dawah', text: 'Bringing the message of Islam to young students and encouraging them to practise it.' },
    { title: 'Organisation', text: 'Bringing together students who are ready to take part in establishing the Islamic way of life.' },
    { title: 'Training', text: 'Shaping knowledge and character so members grow into capable, skilled workers.' },
    { title: 'Education movement and student welfare', text: 'Campaigning for value-based education and leading on the real problems students face.' },
    { title: 'Building an Islamic society', text: 'Working for a society free of exploitation, oppression and cultural subjugation.' },
  ],
  work: [
    {
      topic: 'Housing',
      text: 'A press conference demanding full residential seats, a housing allowance, and CUCSU and Senate elections.',
      href: '/news/shotbhag-abason-abason-bhata-chaksu-o-sinet-nirbachon-soh-5-dofa-dabi-ebong',
    },
    {
      topic: 'Drinking water',
      text: 'A drinking-water corner on campus named after Shaheed Mir Mugdho, for the hottest and busiest spots.',
      href: '/news/shohid-mir-mugdhor-name-oyatar-kornar-sthapon-chobi-shibirer',
    },
    {
      topic: 'New students',
      text: 'A freshers’ reception and career guideline programme in 2026 attended by more than 2,500 new students.',
      href: '/news/freshers-reception-career-guideline-program-2026',
    },
  ],
  cucsu: {
    title: 'CUCSU election 2025',
    text: 'On 15 October 2025 the panel backed by the branch won 24 of the 26 posts of the Chittagong University Central Students’ Union, with a turnout of about 65 percent. Its manifesto set out 33 commitments on housing, the shuttle train, food, a safe and green campus, session jams, automation, research and careers, a women-friendly campus and welfare.',
  },
} as const

/** English titles for the committee's positions, used when the CMS has no English entry yet. */
const POSITIONS: Record<string, string> = {
  সভাপতি: 'President',
  সেক্রেটারি: 'Secretary',
  'মানব সম্পদ ব্যবস্থাপনা বিষয়ক সম্পাদক': 'Human Resource Management Secretary',
  'অফিস ও পরিকল্পনা সম্পাদক': 'Office and Planning Secretary',
  'বায়তুলমাল/অর্থ সম্পাদক': 'Finance Secretary',
  'আন্তর্জাতিক সম্পাদক': 'International Affairs Secretary',
  'ছাত্র অধিকার সম্পাদক': 'Student Rights Secretary',
  'সাহিত্য, সংস্কৃতি ও পাবলিক রিলেশন সম্পাদক': 'Literature, Culture and Public Relations Secretary',
  'আইন, ফাউন্ডেশন ও মাদ্রাসা সম্পাদক': 'Law, Foundation and Madrasa Affairs Secretary',
  'শিক্ষা সম্পাদক': 'Education Secretary',
  'স্কিল ডেভেলপমেন্ট এবং ব্যবসায় শিক্ষা সম্পাদক': 'Skills Development and Business Studies Secretary',
  'ক্রীড়া সম্পাদক': 'Sports Secretary',
  'তথ্য ও প্রচার সম্পাদক': 'Information and Publicity Secretary',
  'গবেষণা সম্পাদক': 'Research Secretary',
  'আইটি ও বিজ্ঞান সম্পাদক': 'IT and Science Secretary',
  'এইচআরডি ও পাঠাগার সম্পাদক': 'HRD and Library Secretary',
  'দাওয়াহ ও প্রকাশনা সম্পাদক': 'Dawah and Publications Secretary',
  'স্কুল ও কলেজ কার্যক্রম সম্পাদক': 'School and College Affairs Secretary',
}

// Keys are NFC-normalised so য়/ড় typed either way still match.
const POSITION_EN = new Map(Object.entries(POSITIONS).map(([bn, en]) => [bn.normalize('NFC'), en]))

export const positionEn = (bn: string) => POSITION_EN.get(bn.normalize('NFC')) ?? bn
