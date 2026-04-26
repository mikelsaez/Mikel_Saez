import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ExpertiseSection.css'
gsap.registerPlugin(ScrollTrigger)

const cardDefs = [
  {
    num: '01', tag: 'SEEDS', descKey: 'expertise.cards.seeds',
    icon: (
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
        <circle cx="14" cy="10" r="9" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="14" y1="19" x2="14" y2="36" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="8"  y1="28" x2="14" y2="24" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    tags: ['Microsoft Mkt & Operations - Europe HQ', 'Iberia Airlines – Proudly Serving ARAEX Wines', 'Mercedes Benz Trophy – Villa Conchi Cava'],
  },
  {
    num: '02', tag: 'ROOTS', descKey: 'expertise.cards.roots',
    icon: (
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
        <line x1="14" y1="0"  x2="14" y2="16" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="14" y1="16" x2="6"  y2="28" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="14" y1="16" x2="22" y2="28" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="14" y1="22" x2="9"  y2="36" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="14" y1="22" x2="19" y2="36" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    tags: ['Wine Routes of the World, Publication – UN Tourism', 'Spanish Fine Wines Institute – ICEX', 'OECD Webinars'],
  },
  {
    num: '03', tag: 'GROWTH', descKey: 'expertise.cards.growth',
    icon: (
      <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
        <line x1="12" y1="36" x2="12" y2="12" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="12" y1="20" x2="4"  y2="10" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="12" y1="14" x2="20" y2="4"  stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="4"  cy="8"  r="3"   stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="20" cy="2"  r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="12" cy="20" r="3"   stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    tags: ['World Bank Workplace Standards – Change Management', 'Mission 300 - COMESA & WB Partnership Community of Practice'],
  },
  {
    num: '04', tag: 'TERRITORIES', descKey: 'expertise.cards.territories',
    icon: (
      <svg width="32" height="30" viewBox="0 0 32 30" fill="none">
        <rect x="2"  y="12" width="8" height="18" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="12" y="6"  width="8" height="24" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="22" y="16" width="8" height="14" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    tags: ['Vitoria-Gasteiz Urban Innovation 2030 Agenda', 'IDB Regional Housing Forum (Mexico)', 'IDB – U20 Brazil during G20, Mayors Summit'],
  },
  {
    num: '05', tag: 'CLIMATE', descKey: 'expertise.cards.climate',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12"  stroke="currentColor" strokeWidth="1.2"/>
        <ellipse cx="16" cy="16" rx="5" ry="12" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="4"  y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="7"  y1="9"  x2="25" y2="9"  stroke="currentColor" strokeWidth="1.2"/>
        <line x1="7"  y1="23" x2="25" y2="23" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    tags: ['COP16 Cali - Knowledge Platform', 'COP30 Belen - Amazonian Cities Network'],
  },
]

export default function ExpertiseSection() {
  const { t } = useTranslation()
  const ref    = useRef(null)

  useEffect(() => {
    const el = ref.current
    gsap.fromTo(el.querySelectorAll('.expertise__card'),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 72%' } }
    )
    gsap.fromTo(el.querySelectorAll('.expertise__header .anim'),
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' } }
    )
  }, [])

  return (
    <section className="expertise" id="expertise" ref={ref}>
      <div className="expertise__header">
        <span className="label anim">{t('expertise.label')}</span>
        <h2 className="expertise__heading anim">
          {t('expertise.heading1')} <em>{t('expertise.heading2')}</em>
        </h2>
      </div>

      <div className="expertise__divider" />

      <div className="expertise__grid">
        {cardDefs.map((card) => (
          <div className="expertise__card" key={card.num}>
            <div className="expertise__card-top">
              <span className="expertise__card-num">{card.num}</span>
              <div className="expertise__card-icon">{card.icon}</div>
            </div>
            <span className="expertise__card-tag">{card.tag}</span>
            <h3 className="expertise__card-title">{t(`${card.descKey}.title`)}</h3>
            <p className="expertise__card-desc">{t(`${card.descKey}.desc`)}</p>
            <ul className="expertise__card-tags">
              {card.tags.map((tag) => <li key={tag}>— {tag}</li>)}
            </ul>
            <span className="expertise__card-arrow">→</span>
          </div>
        ))}
      </div>
    </section>
  )
}
