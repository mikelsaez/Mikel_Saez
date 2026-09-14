export const DEFAULT_LOCALE = 'en'

export const LOCALES = [
  { code: 'en', shortLabel: 'EN' },
  { code: 'es', shortLabel: 'ES' },
  { code: 'eu', shortLabel: 'EU' },
]

const LOCALE_CODES = new Set(LOCALES.map(({ code }) => code))

export function normalizeLocale(value) {
  if (typeof value !== 'string') return null
  const locale = value.toLowerCase().split('-')[0]
  return LOCALE_CODES.has(locale) ? locale : null
}

export function getLocaleFromPathname(pathname) {
  const [firstSegment] = pathname.split('/').filter(Boolean)
  return normalizeLocale(firstSegment)
}

export function getInitialLocale() {
  const pathLocale = getLocaleFromPathname(window.location.pathname)
  if (pathLocale) return pathLocale

  try {
    return normalizeLocale(window.localStorage.getItem('site-locale')) || DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

export function getLocalePath(locale, hash = window.location.hash) {
  const safeLocale = normalizeLocale(locale) || DEFAULT_LOCALE
  return `/${safeLocale}/${hash || ''}`
}
