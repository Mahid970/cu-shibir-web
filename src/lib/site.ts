export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  name: 'বাংলাদেশ ইসলামী ছাত্রশিবির — চট্টগ্রাম বিশ্ববিদ্যালয়',
  shortName: 'চবি ছাত্রশিবির',
  nameEn: 'Bangladesh Islami Chhatrashibir — University of Chittagong',
  description:
    'বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয় শাখার অফিসিয়াল ওয়েবসাইট — সংবাদ, বিবৃতি, ইভেন্ট, শিক্ষার্থী সেবা ও দায়িত্বশীলবৃন্দ।',
  facebook: 'https://www.facebook.com/cushibir',
  email: 'cuchhatrashibir@gmail.com',
} as const

export const absoluteUrl = (path = '/') => new URL(path, SITE.url).toString()
