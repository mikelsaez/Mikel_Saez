import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.jsx'
import LocaleProvider from './i18n/LocaleProvider.jsx'
import { getInitialLocale, getLocaleFromPathname, getLocalePath } from './i18n/locales.js'

// ── Register GSAP plugins ONCE at the application root ───────────────────────
gsap.registerPlugin(ScrollTrigger)

if (!getLocaleFromPathname(window.location.pathname)) {
  window.history.replaceState({}, '', getLocalePath(getInitialLocale()))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
)
