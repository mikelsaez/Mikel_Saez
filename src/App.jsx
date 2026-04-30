import CursorTrail from './components/CursorTrail'
import HeroSection from './components/HeroSection'
import IntroSection from './components/IntroSection'
import ProjectsSection from './components/ProjectsSection'
import ExpertiseSection from './components/ExpertiseSection'
import WorldMapSection from './components/WorldMapSection'
import AboutSection from './components/AboutSection'
import ImpactSection from './components/ImpactSection'
import LogoCarousel from './components/LogoCarousel'
import ContactSection from './components/ContactSection'
import Tree from './components/Tree'

export default function App() {
  return (
    <>
      <CursorTrail />
      <div className="hero-intro-wrapper">
        <div className="hero-bg">
          <div className="hero-bg__sticky">
            <video autoPlay muted loop playsInline preload="auto" className="hero-bg__video" aria-hidden="true">
              <source src="/hero-bg.mp4" type="video/mp4" />
            </video>
            <div className="hero-bg__overlay" aria-hidden="true" />
          </div>
        </div>
        <HeroSection />
        <IntroSection />
      </div>
      <ProjectsSection />
      <ExpertiseSection />
      <WorldMapSection />
      <AboutSection />
      <ImpactSection />
      <LogoCarousel />
      <ContactSection />
      <Tree />
    </>
  )
}
