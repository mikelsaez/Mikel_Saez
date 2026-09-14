import { lazy, Suspense, useState } from 'react'
import CursorTrail from './components/CursorTrail'
import HeroSection from './components/HeroSection'
import IntroSection from './components/IntroSection'
import ProjectsSection from './components/ProjectsSection'
import ExpertiseSection from './components/ExpertiseSection'
import AboutSection from './components/AboutSection'
import ImpactSection from './components/ImpactSection'
import LogoCarousel from './components/LogoCarousel'
import ContactSection from './components/ContactSection'
import Tree from './components/Tree'
import useLocale from './i18n/useLocale'

const WorldMapSection = lazy(() => import('./components/WorldMapSection'))

export default function App() {
  const { content } = useLocale()
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  return (
    <>
      <a className="skip-link" href="#main-content">{content.ui.skipToContent}</a>
      <CursorTrail />
      <main id="main-content">
        <div className="hero-intro-wrapper">
          <div className="hero-bg">
            <div className="hero-bg__sticky">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/hero-poster.webp"
                className="hero-bg__video"
                aria-hidden="true"
              >
                <source src="/hero-bg.mp4" type="video/mp4" />
              </video>
              <div className="hero-bg__overlay" aria-hidden="true" />
            </div>
          </div>
          <HeroSection />
          <IntroSection />
        </div>
        <ProjectsSection />
        <ExpertiseSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <Suspense fallback={<div id="world-map" className="map-fallback" role="status">{content.ui.mapLoading}</div>}>
          <WorldMapSection
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </Suspense>
        <AboutSection />
        <ImpactSection />
        <LogoCarousel />
        <ContactSection />
      </main>
      <Tree />
    </>
  )
}
