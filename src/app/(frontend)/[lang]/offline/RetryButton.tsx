'use client'

import { useLang } from '@/i18n/LangProvider'

export function RetryButton() {
  const lang = useLang()
  return (
    <button type="button" onClick={() => location.reload()} className="btn btn-gradient">
      {lang === 'en' ? 'Try again' : 'আবার চেষ্টা করুন'}
    </button>
  )
}
