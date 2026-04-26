import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ImpactSection.css'
gsap.registerPlugin(ScrollTrigger)

export default function ImpactSection() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    gsap.fromTo(el.querySelectorAll('.anim'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 78%' } }
    )
  }, [])

  return (
    <section className="impact" ref={ref}>
      <div className="impact__inner">
        <span className="label anim">IMPACT</span>
        <h2 className="impact__heading anim">
          Ideas that <em>took root</em>
        </h2>
        <p className="impact__para anim">
          Over the past decade I have worked across continents, sectors and institutions helping ideas grow into initiatives with real impact.
        </p>
        <p className="impact__para anim">
          From international platforms and global events to urban sustainability programs and institutional transformation projects, my role has focused on connecting strategy, communication and partnerships. Many of these initiatives have brought together public institutions, private sector actors and civil society organizations to translate complex agendas into collaborative action.
        </p>
      </div>
    </section>
  )
}
