import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import './HeroSection.css'

const LANGS = ['EN', 'ES', 'EU']

export default function HeroSection() {
  const { t, i18n } = useTranslation()
  const navigate     = useNavigate()
  const { lang }     = useParams()

  const switchLang = (code) => {
    const lc = code.toLowerCase()
    i18n.changeLanguage(lc)
    navigate(`/${lc}`, { replace: true })
  }

  const navLinks = [
    { key: 'nav.work',    href: '#expertise' },
    { key: 'nav.map',     href: '#world-map' },
    { key: 'nav.about',   href: '#about' },
    { key: 'nav.contact', href: '#contact' },
  ]

  return (
    <section className="hero" id="hero">
      <div className="hero__video-wrap">
        <video autoPlay muted loop playsInline preload="auto" className="hero__video">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero__overlay" />

      <nav className="hero__nav">
        {navLinks.map(({ key, href }) => (
          <a key={key} className="hero__nav-link" href={href}>{t(key)}</a>
        ))}

        {/* ── Language switcher ─────────────────────────────────────── */}
        <div className="hero__lang-switcher">
          {LANGS.map((code, i) => (
            <span key={code}>
              <button
                className={`hero__lang-btn ${lang?.toUpperCase() === code ? 'hero__lang-btn--active' : ''}`}
                onClick={() => switchLang(code)}
              >
                {code}
              </button>
              {i < LANGS.length - 1 && <span className="hero__lang-sep">|</span>}
            </span>
          ))}
        </div>
      </nav>

      <div className="hero__content">
        <p className="hero__subtitle">{t('hero.subtitle')}</p>
        <h1 className="hero__heading">
          {t('hero.heading1')} <em>{t('hero.heading2')}</em>
        </h1>
        <a className="hero__discover" href="#intro">
          <span>{t('hero.discover')}</span>
          <span className="hero__discover-line" />
        </a>
      </div>

      <div className="hero__footer">
        <div className="hero__stat">
          <span className="hero__stat-label">{t('hero.basedIn')}</span>
          <span className="hero__stat-value"><em>{t('hero.basedInValue')}</em></span>
        </div>
        <div className="hero__stat hero__stat--center">
          <span className="hero__stat-label">{t('hero.activeSince')}</span>
          <span className="hero__stat-value">2012</span>
        </div>
        <div className="hero__stat hero__stat--right">
          <span className="hero__stat-label">{t('hero.projects')}</span>
          <span className="hero__stat-value">55+</span>
        </div>
      </div>
    </section>
  )
}
