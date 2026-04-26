import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import es from './locales/es.json'
import eu from './locales/eu.json'

i18n
  .use(LanguageDetector)       // reads localStorage / navigator.language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      eu: { translation: eu },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'eu'],
    // LanguageDetector order: URL path first, then localStorage, then browser
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupLocalStorage: 'i18n_lang',
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,   // React already handles XSS
    },
  })

export default i18n
