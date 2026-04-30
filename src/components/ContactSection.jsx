import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ContactSection.css'

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
        <h2 className="contact__heading anim">
          Let's cultivate <em>something<br />meaningful</em>
        </h2>
        <p className="contact__para anim">
          Open to collaboration on international initiatives, communication<br />
          strategy and sustainability projects.
        </p>
        <div className="contact__buttons anim">
          <a
            className="contact__btn"
            href="mailto:hello@mikelsaez.com"
            aria-label="Send an email"
          >
            EMAIL
          </a>
          <a
            className="contact__btn"
            href="https://www.linkedin.com/in/mikelvicuna/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit LinkedIn profile (opens in new tab)"
          >
            LINKEDIN
          </a>
        </div>
      </div>
      <footer className="contact__footer">
        <p>© 2026 Mikel Saez de Vicuna. All rights reserved.</p>
      </footer>
    </section>
  )
}
