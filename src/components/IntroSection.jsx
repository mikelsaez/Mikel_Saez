import './IntroSection.css'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function IntroSection() {
  const { t } = useTranslation()
  const ref    = useRef(null)

  useEffect(() => {
    const el = ref.current
    gsap.fromTo(el.querySelectorAll('.anim'),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 78%' } }
    )
  }, [])

  return (
    <section className="intro" id="intro" ref={ref}>
      <div className="intro__inner">
        <h2 className="intro__heading anim">
          {t('intro.heading1')} <em>{t('intro.heading2')}</em> {t('intro.heading3')}
        </h2>
        <div className="intro__rule anim" />
        <p className="intro__para anim">{t('intro.para')}</p>
      </div>
    </section>
  )
}
