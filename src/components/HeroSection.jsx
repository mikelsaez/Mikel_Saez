import { useState, useEffect, useRef } from 'react'
import './HeroSection.css'

const LANGS = ['EN', 'ES', 'EU']
const NAV_LINKS = [
  { label: 'WORK',    href: '#expertise' },
  { label: 'MAP',     href: '#world-map' },
  { label: 'ABOUT',   href: '#about' },
  { label: 'CONTACT', href: '#contact' },
]

/** Maps our display code to the BCP-47 code Google Translate expects */
const LANG_CODES = { EN: 'en', ES: 'es', EU: 'eu' }

function switchLang(code) {
  const langCode = LANG_CODES[code]
  if (typeof window.switchLanguage === 'function') {
    window.switchLanguage(langCode)
  } else {
    setTimeout(() => {
      if (typeof window.switchLanguage === 'function') window.switchLanguage(langCode)
    }, 800)
  }
}

export default function HeroSection() {
  const [activeLang, setActiveLang]   = useState('EN')
  const [menuOpen,   setMenuOpen]     = useState(false)
  const menuRef = useRef(null)

  const handleLangSwitch = (code) => {
    setActiveLang(code)
    switchLang(code)
  }

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <section className="hero" id="hero" aria-label="Hero — Mikel Saez de Vicuña">
      <div className="hero__video-wrap">
        <video autoPlay muted loop playsInline preload="auto" className="hero__video" aria-hidden="true">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero__overlay" aria-hidden="true" />

      {/* ── Desktop nav ───────────────────────────────────────────────────── */}
      <nav className="hero__nav" role="navigation" aria-label="Main navigation">
        <a className="hero__nav-link" href="#expertise">WORK</a>
        <a className="hero__nav-link" href="#world-map">MAP</a>
        <a className="hero__nav-link" href="#about">ABOUT</a>
        <a className="hero__nav-link" href="#contact">CONTACT</a>

        <div className="hero__lang-switcher" role="group" aria-label="Language selection">
          {LANGS.map((code, i) => (
            <span key={code}>
              <button
                className={`hero__lang-btn ${activeLang === code ? 'hero__lang-btn--active' : ''}`}
                onClick={() => handleLangSwitch(code)}
                aria-pressed={activeLang === code}
                aria-label={`Switch language to ${code}`}
              >
                {code}
              </button>
              {i < LANGS.length - 1 && <span className="hero__lang-sep" aria-hidden="true">|</span>}
            </span>
          ))}
        </div>

        {/* Hamburger — only visible on mobile */}
        <button
          className={`hero__hamburger ${menuOpen ? 'hero__hamburger--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`hero__mobile-menu ${menuOpen ? 'hero__mobile-menu--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav className="hero__mobile-nav">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} className="hero__mobile-link" href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>
        <div className="hero__mobile-lang" role="group" aria-label="Language selection">
          {LANGS.map((code, i) => (
            <span key={code}>
              <button
                className={`hero__lang-btn ${activeLang === code ? 'hero__lang-btn--active' : ''}`}
                onClick={() => { handleLangSwitch(code); closeMenu() }}
                aria-pressed={activeLang === code}
              >
                {code}
              </button>
              {i < LANGS.length - 1 && <span className="hero__lang-sep" aria-hidden="true">|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Backdrop — click to close */}
      {menuOpen && (
        <div className="hero__backdrop" aria-hidden="true" onClick={closeMenu} />
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="hero__content">
        <p className="hero__subtitle">TURNING COMPLEX AGENDAS INTO LIVING INITIATIVES</p>
        <h1 className="hero__heading">
          From local roots to <em>global<br />impact</em>
        </h1>
        <a className="hero__discover" href="#intro" aria-label="Discover more — scroll down">
          <span>DISCOVER</span>
          <span className="hero__discover-line" aria-hidden="true" />
        </a>
      </div>

      {/* ── Stat footer ───────────────────────────────────────────────────── */}
      <div className="hero__footer" aria-label="Quick statistics">
        <div className="hero__stat">
          <span className="hero__stat-label">BASED IN</span>
          <span className="hero__stat-value"><em>Basque Country</em></span>
        </div>
        <div className="hero__stat hero__stat--center">
          <span className="hero__stat-label">ACTIVE SINCE</span>
          <span className="hero__stat-value">2012</span>
        </div>
        <div className="hero__stat hero__stat--right">
          <span className="hero__stat-label">PROJECTS</span>
          <span className="hero__stat-value">55+</span>
        </div>
      </div>
    </section>
  )
}
