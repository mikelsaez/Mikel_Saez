import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ProjectsSection.css'
import contentData from '../data/content.json'

const content = contentData.projects
const stats = content.stats

export default function ProjectsSection() {
  const ref      = useRef(null)
  const numRefs  = useRef([])
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    const el = ref.current
    const ctx = gsap.context(() => {
      // ── Heading + paragraph reveal ────────────────────────────────────────
      gsap.fromTo(el.querySelectorAll('.anim'),
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%' }
        }
      )

      // ── Stat count-up ─────────────────────────────────────────────────────
      const proxy = { value: 0 }
      stats.forEach((stat, i) => {
        const obj = { v: 0 }
        gsap.to(obj, {
          v: stat.value,
          duration: 1.8,
          ease: 'power2.out',
          delay: 0.3 + i * 0.12,
          scrollTrigger: { trigger: el, start: 'top 72%', once: true },
          onUpdate() {
            const el = numRefs.current[i]
            if (!el) return
            const rounded = stat.decimals
              ? obj.v.toFixed(stat.decimals)
              : Math.round(obj.v)
            el.textContent = rounded + (stat.suffix || '')
          },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section className="projects" id="projects" ref={ref}>
      <div className="projects__top">
        <span className="label anim">{content.tag}</span>
        <h2 className="projects__heading anim" dangerouslySetInnerHTML={{ __html: content.heading }} />
        <p className="projects__para anim">{content.paragraph}</p>
      </div>

      <div className="projects__divider anim" />

      <div className="projects__stats">
        {stats.map(({ label, display }, i) => (
          <div className="projects__stat" key={label}>
            {i > 0 && <div className="projects__stat-sep" aria-hidden="true" />}
            <span
              className="projects__stat-value"
              ref={el => (numRefs.current[i] = el)}
              aria-label={`${display} ${label.toLowerCase()}`}
            >
              {display}
            </span>
            <span className="projects__stat-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
