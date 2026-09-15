import { useEffect, useRef, useState } from 'react'
import './HeroSection.css'
import RichText from './RichText'
import useLocale from '../i18n/useLocale'
import { LOCALES } from '../i18n/locales'

const NAV_ITEMS = [
  { key: 'work', href: '#expertise' },
  { key: 'map', href: '#world-map' },
  { key: 'about', href: '#about' },
  { key: 'contact', href: '#contact' },
]

function getFocusableElements(container) {
  return [...container.querySelectorAll('a[href], button:not([disabled])')]
}

export default function HeroSection() {
  const { content: localizedContent, locale, setLocale } = useLocale()
  const { hero: content, ui } = localizedContent
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return undefined

    const menu = menuRef.current
    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    getFocusableElements(menu)[0]?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusableElements(menu)
      const first = focusable[0]
      const last = focusable.at(-1)

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      trigger?.focus()
    }
  }, [menuOpen])

  const switchLanguageLabel = (language) => ui.switchLanguage.replace('{language}', language)
  const closeMenu = () => setMenuOpen(false)
  const handleLanguageChange = (code) => {
    setLocale(code)
    closeMenu()
  }

  const renderLanguageSwitcher = (className) => (
    <div
      className={`${className} notranslate`}
      role="group"
      aria-label={ui.languageSelection}
      translate="no"
    >
      {LOCALES.map(({ code, shortLabel }, index) => (
        <span key={code}>
          <button
            className={`hero__lang-btn ${locale === code ? 'hero__lang-btn--active' : ''}`}
            onClick={() => handleLanguageChange(code)}
            aria-pressed={locale === code}
            aria-label={switchLanguageLabel(ui.languageNames[code])}
            lang={code}
          >
            {shortLabel}
          </button>
          {index < LOCALES.length - 1 && (
            <span className="hero__lang-sep" aria-hidden="true">|</span>
          )}
        </span>
      ))}
    </div>
  )

  return (
    <section className="hero" id="hero" aria-label={ui.heroLabel}>
      <nav className="hero__nav" aria-label={ui.mainNavigation}>
        {NAV_ITEMS.map(({ key, href }) => (
          <a className="hero__nav-link" href={href} key={key}>{ui.nav[key]}</a>
        ))}

        {renderLanguageSwitcher('hero__lang-switcher')}

        <button
          ref={triggerRef}
          className={`hero__hamburger ${menuOpen ? 'hero__hamburger--open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? ui.closeMenu : ui.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && (
        <>
          <div
            id="mobile-menu"
            ref={menuRef}
            className="hero__mobile-menu hero__mobile-menu--open"
            role="dialog"
            aria-modal="true"
            aria-label={ui.navigationMenu}
          >
            <nav className="hero__mobile-nav" aria-label={ui.mainNavigation}>
              {NAV_ITEMS.map(({ key, href }) => (
                <a key={key} className="hero__mobile-link" href={href} onClick={closeMenu}>
                  {ui.nav[key]}
                </a>
              ))}
            </nav>
            {renderLanguageSwitcher('hero__mobile-lang')}
          </div>
          <button
            className="hero__backdrop"
            onClick={closeMenu}
            aria-label={ui.closeMenu}
            tabIndex={-1}
          />
        </>
      )}

      <div className="hero__content">
        <p className="hero__subtitle">{content.subtitle}</p>
        <RichText as="h1" className="hero__heading">{content.heading}</RichText>
        <a className="hero__discover" href="#intro" aria-label={ui.discoverMore}>
          <span>{content.discoverText}</span>
          <span className="hero__discover-line" aria-hidden="true" />
        </a>
      </div>

      <div className="hero__footer" aria-label={ui.quickStatistics}>
        {content.stats.map((stat, index) => (
          <div
            className={`hero__stat ${index === 1 ? 'hero__stat--center' : ''} ${index === 2 ? 'hero__stat--right' : ''}`}
            key={stat.label}
          >
            <span className="hero__stat-label">{stat.label}</span>
            <RichText as="span" className="hero__stat-value">{stat.value}</RichText>
          </div>
        ))}
      </div>
    </section>
  )
}
