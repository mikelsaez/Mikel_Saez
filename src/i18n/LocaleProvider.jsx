import { useCallback, useEffect, useMemo, useState } from 'react'
import contentData from '../data/content.json'
import sharedData from '../data/shared.json'
import LocaleContext from './LocaleContext'
import {
  DEFAULT_LOCALE,
  getInitialLocale,
  getLocaleFromPathname,
  getLocalePath,
  normalizeLocale,
} from './locales'

const SITE_ORIGIN = 'https://saezdevicuna.eus'

function setMetaContent(selector, value) {
  const element = document.querySelector(selector)
  if (element && value) element.setAttribute('content', value)
}

function updateDocumentMetadata(locale, seo) {
  document.documentElement.lang = locale
  document.title = seo.title
  setMetaContent('meta[name="description"]', seo.description)
  setMetaContent('meta[property="og:title"]', seo.title)
  setMetaContent('meta[property="og:description"]', seo.description)
  setMetaContent('meta[property="og:url"]', `${SITE_ORIGIN}/${locale}/`)
  setMetaContent('meta[name="twitter:title"]', seo.title)
  setMetaContent('meta[name="twitter:description"]', seo.description)

  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.setAttribute('href', `${SITE_ORIGIN}/${locale}/`)
}

function mergeByKey(localizedItems, sharedItems) {
  const localizedByKey = new Map(localizedItems.map((item) => [item.key, item]))
  return sharedItems.map((sharedItem) => ({
    ...sharedItem,
    ...localizedByKey.get(sharedItem.key),
  }))
}

function buildLocalizedContent(locale) {
  const localized = contentData[locale] || contentData[DEFAULT_LOCALE]

  return {
    ...localized,
    about: {
      ...localized.about,
      image: sharedData.aboutImage,
    },
    worldMap: {
      ...localized.worldMap,
      pins: mergeByKey(localized.worldMap.pins, sharedData.projectPins),
    },
    partners: {
      ...localized.partners,
      logos: sharedData.partnerLogos,
    },
    contact: {
      ...localized.contact,
      ...sharedData.contact,
    },
  }
}

export default function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale)
  const content = useMemo(() => buildLocalizedContent(locale), [locale])

  const setLocale = useCallback((nextLocale, { replace = false } = {}) => {
    const normalized = normalizeLocale(nextLocale)
    if (!normalized) return

    const nextPath = getLocalePath(normalized)
    window.history[replace ? 'replaceState' : 'pushState']({}, '', nextPath)
    setLocaleState(normalized)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setLocaleState(getLocaleFromPathname(window.location.pathname) || DEFAULT_LOCALE)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('site-locale', locale)
    } catch {
      // Browsing still works when storage is unavailable.
    }

    updateDocumentMetadata(locale, content.seo)
  }, [content.seo, locale])

  const value = useMemo(() => ({ locale, setLocale, content }), [content, locale, setLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
