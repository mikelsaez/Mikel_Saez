import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ExpertiseSection.css'
import contentData from '../data/content.json'

const content = contentData.expertise

const ICONS = {
  'ECOSYSTEM': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12"  stroke="currentColor" strokeWidth="1.2"/>
      <ellipse cx="16" cy="16" rx="5" ry="12" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="4"  y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="7"  y1="9"  x2="25" y2="9"  stroke="currentColor" strokeWidth="1.2"/>
      <line x1="7"  y1="23" x2="25" y2="23" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  'TERRITORIES': (
    <svg width="32" height="30" viewBox="0 0 32 30" fill="none">
      <rect x="2"  y="12" width="8" height="18" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="12" y="6"  width="8" height="24" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="22" y="16" width="8" height="14" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  'SEEDS': (
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
      <circle cx="14" cy="10" r="9" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="14" y1="19" x2="14" y2="36" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="8"  y1="28" x2="14" y2="24" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  'ROOTS': (
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
      <line x1="14" y1="0"  x2="14" y2="16" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="14" y1="16" x2="6"  y2="28" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="14" y1="16" x2="22" y2="28" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="14" y1="22" x2="9"  y2="36" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="14" y1="22" x2="19" y2="36" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  'BLOOM': (
    <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
      <line x1="12" y1="36" x2="12" y2="12" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="12" y1="20" x2="4"  y2="10" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="12" y1="14" x2="20" y2="4"  stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="4"  cy="8"  r="3"   stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="20" cy="2"  r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="12" cy="20" r="3"   stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  'HARVEST': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6 28 L16 8 L26 28" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="9" y1="22" x2="23" y2="22" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="16" y1="8"  x2="16" y2="4"  stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="16" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

const cards = content.cards.map(card => ({
  ...card,
  icon: ICONS[card.tag]
}))

export default function ExpertiseSection() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const ctx = gsap.context(() => {
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
    }, el)
    return () => ctx.revert()
  }, [])

  const handleCardClick = () => {
    const mapSection = document.getElementById('world-map');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="expertise" id="expertise" ref={ref}>
      <div className="expertise__header">
        <span className="label anim">{content.tag}</span>
        <h2 className="expertise__heading anim" dangerouslySetInnerHTML={{ __html: content.heading }} />
      </div>

      <div className="expertise__divider" />

      <div className="expertise__grid">
        {cards.map((card) => (
          <div 
            className="expertise__card" 
            key={card.num} 
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if(e.key === 'Enter') handleCardClick(); }}
          >
            <div className="expertise__card-top">
              <span className="expertise__card-num">{card.num}</span>
              <div className="expertise__card-icon">{card.icon}</div>
            </div>
            <span className="expertise__card-tag">{card.tag}</span>
            <h3 className="expertise__card-title">{card.title}</h3>
            <p className="expertise__card-desc">{card.desc}</p>
            <ul className="expertise__card-tags">
              {card.tags.map((t) => <li key={t}>— {t}</li>)}
            </ul>
            <span className="expertise__card-arrow">→</span>
          </div>
        ))}
      </div>
    </section>
  )
}
