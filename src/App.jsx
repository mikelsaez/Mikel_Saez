import { useEffect } from 'react'
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import CursorTrail      from './components/CursorTrail'
import HeroSection      from './components/HeroSection'
import IntroSection     from './components/IntroSection'
import ProjectsSection  from './components/ProjectsSection'
import ExpertiseSection from './components/ExpertiseSection'
import WorldMapSection  from './components/WorldMapSection'
import AboutSection     from './components/AboutSection'
import ImpactSection    from './components/ImpactSection'
import LogoCarousel     from './components/LogoCarousel'
import ContactSection   from './components/ContactSection'

const SUPPORTED = ['en', 'es', 'eu']

/** Syncs the :lang URL segment → i18next on mount / param change */
function LangRoute() {
  const { lang } = useParams()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (SUPPORTED.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  if (!SUPPORTED.includes(lang)) {
    return <Navigate to="/en" replace />
  }

  return (
    <>
      <CursorTrail />
      <HeroSection />
      <IntroSection />
      <ProjectsSection />
      <ExpertiseSection />
      <WorldMapSection />
      <AboutSection />
      <ImpactSection />
      <LogoCarousel />
      <ContactSection />
    </>
  )
}

/** Redirects bare "/" to the stored / browser language */
function RootRedirect() {
  const { i18n } = useTranslation()
  const lang = SUPPORTED.includes(i18n.language) ? i18n.language : 'en'
  return <Navigate to={`/${lang}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<RootRedirect />} />
      <Route path="/:lang"    element={<LangRoute />} />
      <Route path="/:lang/*"  element={<LangRoute />} />
      {/* Catch-all → English */}
      <Route path="*"         element={<Navigate to="/en" replace />} />
    </Routes>
  )
}
