import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './AboutSection.css'
import RichText from './RichText'
import useLocale from '../i18n/useLocale'

export default function AboutSection() {
  const ref = useRef(null)
  const { content: localizedContent } = useLocale()
  const content = localizedContent.about
  const paras = content.paragraphs

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('.anim'),
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%' }
        }
      )
      gsap.fromTo(el.querySelector('.about__photo-frame'),
        { opacity: 0, x: -36 },
        {
          opacity: 1, x: 0, duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' }
        }
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about__inner">
        <div className="about__photo-col">
          <div className="about__photo-frame">
            <img
              className="about__photo"
              src={content.image}
              alt={content.imageAlt}
              loading="lazy"
            />
          </div>
        </div>

        <div className="about__content">
          <span className="label anim">{content.tag}</span>
          <RichText as="h2" className="about__heading anim">{content.heading}</RichText>
          {paras.map((p, i) => (
            <p className="about__para anim" key={i}>{p}</p>
          ))}
          <a className="about__cta anim" href="#contact" aria-label={content.ctaAriaLabel}>
            {content.ctaText}
          </a>

          <div className="about__divider anim"></div>
          
          <div className="about__stats">
            {content.stats.map((stat, i) => (
              <div className="about__stat anim" key={i}>
                <span className="about__stat-num">{stat.num}</span>
                <span className="about__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
