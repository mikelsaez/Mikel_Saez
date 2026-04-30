import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AboutSection.css'

const paras = [
  'The Basque Country has a strong sense of place. Mountains, forests and coastlines are not just scenery, but part of daily life and identity. That early connection to territory shaped how I see the world: local roots matter, but ideas travel.',
  'Curiosity about that wider world led me to study communication and international relations, exploring how narratives, institutions and cultures interact across borders.',
  'My career began in the private sector coordinating international initiatives and partnerships across Europe and global markets. Over time my work moved closer to sustainability, cities and international cooperation, leading to collaborations with organizations such as the Inter-American Development Bank and later the World Bank Group.',
  'Today my work focuses on helping institutions translate complex agendas into initiatives that people can understand, support and grow.',
]

export default function AboutSection() {
  const ref = useRef(null)

  useEffect(() => {
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
              src="https://saezdevicuna.eus/wp-content/uploads/2026/03/image.png"
              alt="Mikel Saez de Vicuña Blanco"
              loading="lazy"
            />
          </div>
        </div>

        <div className="about__content">
          <span className="label anim">ABOUT</span>
          <h2 className="about__heading anim">
            From Local Roots to <em>Global Impact</em>
          </h2>
          {paras.map((p, i) => (
            <p className="about__para anim" key={i}>{p}</p>
          ))}
          <a className="about__cta anim" href="#contact" aria-label="Contact — let's collaborate">
            LET'S COLLABORATE →
          </a>

          <div className="about__divider anim"></div>
          
          <div className="about__stats">
            <div className="about__stat anim">
              <span className="about__stat-num">18+</span>
              <span className="about__stat-label">COUNTRIES</span>
            </div>
            <div className="about__stat anim">
              <span className="about__stat-num">60+</span>
              <span className="about__stat-label">PROJECTS LED</span>
            </div>
            <div className="about__stat anim">
              <span className="about__stat-num">12</span>
              <span className="about__stat-label">YEARS ACTIVE</span>
            </div>
            <div className="about__stat anim">
              <span className="about__stat-num">UN</span>
              <span className="about__stat-label">COLLABORATOR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
