import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ProjectsSection.css'

const stats = [
  { value: 24,    display: '24',   label: 'ACTIVE PROJECTS', decimals: 0 },
  { value: 18,    display: '18',   label: 'COUNTRIES',       decimals: 0 },
  { value: 12,    display: '12',   label: 'YEARS ACTIVE',    decimals: 0 },
  { value: 4.2,   display: '4.2M', label: 'HECTARES',        decimals: 1, suffix: 'M' },
]

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
        <span className="label anim">PROJECTS IN GROWTH</span>
        <h2 className="projects__heading anim">
          Ideas need <em>fertile ground</em><br />to grow
        </h2>
        <p className="projects__para anim">
          Every initiative begins as an idea. Some remain concepts. Others take root, connect
          people and grow into real change. I help institutions turn complex ideas into initiatives
          that connect places, people, policies and reimagine territories through innovation.
        </p>
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
