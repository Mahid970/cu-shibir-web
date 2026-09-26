import { lang as rootLang } from 'next/root-params'

import { toLocale, type Locale } from './config'

/** Language of the page being rendered (Server Components only; the [lang] root segment). */
export async function getLang(): Promise<Locale> {
  return toLocale(await rootLang())
}
