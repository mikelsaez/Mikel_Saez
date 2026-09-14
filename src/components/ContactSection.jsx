import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './ContactSection.css'
import RichText from './RichText'
import useLocale from '../i18n/useLocale'

export default function ContactSection() {
  const ref = useRef(null)
  const { content: localizedContent } = useLocale()
  const content = localizedContent.contact

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('.anim'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%' }
        }
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact__inner">
        <RichText as="h2" className="contact__heading anim">{content.heading}</RichText>
        <RichText as="p" className="contact__para anim">{content.paragraph}</RichText>
        <div className="contact__buttons anim">
          <a
            className="contact__btn"
            href={content.emailUrl}
            aria-label={content.emailAriaLabel}
          >
            {content.emailLabel}
          </a>
          <a
            className="contact__btn"
            href={content.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={content.linkedinAriaLabel}
          >
            {content.linkedinLabel}
          </a>
        </div>
      </div>
      <footer className="contact__footer">
        <p>{content.footerText}</p>
      </footer>
    </section>
  )
}
