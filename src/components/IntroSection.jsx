import './IntroSection.css'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function IntroSection() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('.anim'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 78%' } }
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section className="intro" id="intro" ref={ref}>
      <div className="intro__inner">
        <h2 className="intro__heading anim">
          Cultivating <em>Ideas</em> That Grow<br />Into Impact
        </h2>
        <div className="intro__rule anim" />
        <p className="intro__para anim">
          Reimagining complex ideas into initiatives that connect institutions, people and places.<br />
          From global agendas to tangible action.
        </p>
      </div>
    </section>
  )
}
