import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ContactSection.css'
import contentData from '../data/content.json'

const content = contentData.contact

export default function ContactSection() {
  const ref = useRef(null)

  useEffect(() => {
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
        <h2 className="contact__heading anim" dangerouslySetInnerHTML={{ __html: content.heading }} />
        <p className="contact__para anim" dangerouslySetInnerHTML={{ __html: content.paragraph }} />
        <div className="contact__buttons anim">
          <a
            className="contact__btn"
            href={content.emailUrl}
            aria-label="Send an email"
          >
            {content.emailLabel}
          </a>
          <a
            className="contact__btn"
            href={content.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit LinkedIn profile (opens in new tab)"
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
