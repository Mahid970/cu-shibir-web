import { describe, expect, it } from 'vitest'

import { FAQS, FIVE_POINTS } from '@/content/home'
import { historyStops } from '@/content/history'
import { getLevel, levelItems, SYLLABUS_KEYS } from '@/content/syllabus'
import { alternates, cmsText, hasBangla, langAttr, localeOf, localePath, stripLocale } from '@/i18n/config'
import { DEPARTMENTS, HALLS } from '@/lib/campus'
import { personDetails, personName, personPosition } from '@/lib/people'
import { outletName } from '@/lib/press'

describe('language paths', () => {
  it.each([
    ['/', '/en'],
    ['/news', '/en/news'],
    ['/news?category=statement', '/en/news?category=statement'],
    ['/join#contact', '/en/join#contact'],
    ['/#faq', '/en#faq'],
  ])('%s ↔ %s', (bn, en) => {
    expect(localePath('en', bn)).toBe(en)
    expect(localePath('bn', en)).toBe(bn)
    expect(localePath('en', en)).toBe(en)
  })

  it('leaves external links and anchors alone', () => {
    expect(localePath('en', 'https://shibir.org.bd')).toBe('https://shibir.org.bd')
    expect(localePath('en', 'mailto:a@b.c')).toBe('mailto:a@b.c')
    expect(localePath('en', '#top')).toBe('#top')
    expect(localePath('en', '//cdn.example.com/x')).toBe('//cdn.example.com/x')
  })

  it('strips the internal /bn prefix and never mistakes /english for /en', () => {
    expect(stripLocale('/bn/about')).toBe('/about')
    expect(stripLocale('/bn')).toBe('/')
    expect(stripLocale('/english')).toBe('/english')
    expect(localeOf('/en/news')).toBe('en')
    expect(localeOf('/english')).toBe('bn')
  })

  it('builds hreflang alternates', () => {
    expect(alternates('en', '/about')).toEqual({
      canonical: '/en/about',
      languages: { 'bn-BD': '/about', en: '/en/about', 'x-default': '/about' },
    })
  })
})

describe('CMS text on English pages', () => {
  it('uses our English until the CMS has its own', () => {
    const fallback = { bn: 'আমরা তরুণ', en: 'We are young' }
    expect(cmsText('en', 'আমরা তরুণ, আমরাই পারি', fallback)).toBe('We are young')
    expect(cmsText('en', 'Written by the editor', fallback)).toBe('Written by the editor')
    expect(cmsText('bn', null, fallback)).toBe('আমরা তরুণ')
  })

  it('marks Bangla text on English pages only', () => {
    expect(hasBangla('চবি')).toBe(true)
    expect(langAttr('en', 'চবি ছাত্রশিবির')).toBe('bn')
    expect(langAttr('en', 'CU')).toBeUndefined()
    expect(langAttr('bn', 'চবি')).toBeUndefined()
  })
})

describe('translations are complete', () => {
  it('every syllabus line has English, and ticks are shared by both languages', () => {
    for (const key of SYLLABUS_KEYS) {
      const bn = getLevel(key, 'bn')!
      const en = getLevel(key, 'en')!
      expect(JSON.stringify(en)).not.toMatch(/[\u0980-\u09FF]/)
      expect(levelItems(en).map((x) => x.id)).toEqual(levelItems(bn).map((x) => x.id))
    }
  })

  it('homepage copy and history have both languages', () => {
    for (const p of FIVE_POINTS) expect([p.title.en, p.body.en, ...p.items.en].join(' ')).not.toMatch(/[\u0980-\u09FF]/)
    expect(FAQS.en).toHaveLength(FAQS.bn.length)
    expect(JSON.stringify(historyStops('en'))).not.toMatch(/[\u0980-\u09FF]/)
    expect(historyStops('bn')[0].year).toBe('১৯৭৭')
  })

  it('every department and hall has an English name', () => {
    for (const o of [...DEPARTMENTS, ...HALLS]) expect(o.en).toMatch(/^[\x20-\x7E’]+$/)
  })
})

describe('people and press in English', () => {
  it('names, positions and details', () => {
    expect(personName('সাঈদ বিন হাবিব', 'en')).toBe('Saeed Bin Habib')
    expect(personName('আব্দুল করিম', 'en')).toBe('Abdul Korim')
    expect(personName('Written In English', 'en')).toBe('Written In English')
    expect(personPosition('তথ্য ও প্রচার সম্পাদক', 'en')).toBe('Information and Publicity Secretary')
    expect(personDetails({ department: 'প্রাণিবিদ্যা', session: '২০-২১', hall: 'শহীদ আব্দুর রব হল' }, 'en')).toEqual([
      'Department of Zoology',
      'Session 20-21',
      'Shaheed Abdur Rab Hall',
    ])
  })

  it('newspaper names', () => {
    expect(outletName('কালবেলা', 'en')).toBe('Kalbela')
    expect(outletName('কালবেলা', 'bn')).toBe('কালবেলা')
    expect(outletName('DHAKA POST', 'en')).toBe('DHAKA POST')
  })
})
