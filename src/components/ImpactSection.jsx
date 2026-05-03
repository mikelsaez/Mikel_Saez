import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ImpactSection.css'
import contentData from '../data/content.json'

const content = contentData.impact

export default function ImpactSection() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('.anim'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 78%' }
        }
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section className="impact" ref={ref} aria-label="Impact overview">
      <div className="impact__inner">
        <span className="label anim">{content.tag}</span>
        <h2 className="impact__heading anim" dangerouslySetInnerHTML={{ __html: content.heading }} />
        <div className="impact__paras">
          {content.paragraphs.map((p, i) => (
            <p className="impact__para anim" key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
