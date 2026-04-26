import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AboutSection.css'
gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const { t } = useTranslation()
  const ref    = useRef(null)
  const paras  = t('about.paras', { returnObjects: true })

  useEffect(() => {
    const el = ref.current
    gsap.fromTo(el.querySelectorAll('.anim'),
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 75%' } }
    )
    gsap.fromTo(el.querySelector('.about__photo'),
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' } }
    )
  }, [])

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about__inner">
        <div className="about__photo-col">
          <img
            className="about__photo"
            src="https://saezdevicuna.eus/wp-content/uploads/2026/03/image.png"
            alt="Mikel Saez de Vicuña Blanco"
          />
        </div>

        <div className="about__content">
          <span className="label anim">{t('about.label')}</span>
          <h2 className="about__heading anim">
            {t('about.heading1')} <em>{t('about.heading2')}</em>
          </h2>
          {Array.isArray(paras)
            ? paras.map((p, i) => <p className="about__para anim" key={i}>{p}</p>)
            : null}
          <a className="about__cta anim" href="#contact">{t('about.cta')}</a>
        </div>
      </div>
    </section>
  )
}
