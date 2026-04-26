import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ProjectsSection.css'
gsap.registerPlugin(ScrollTrigger)

export default function ProjectsSection() {
  const { t } = useTranslation()
  const ref    = useRef(null)

  useEffect(() => {
    const el = ref.current
    gsap.fromTo(el.querySelectorAll('.anim'),
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 75%' } }
    )
  }, [])

  const stats = [
    { value: '24',  labelKey: 'projects.stats.activeProjects' },
    { value: '18',  labelKey: 'projects.stats.countries' },
    { value: '12',  labelKey: 'projects.stats.yearsActive' },
    { value: '4.2M',labelKey: 'projects.stats.hectares' },
  ]

  return (
    <section className="projects" id="projects" ref={ref}>
      <div className="projects__top">
        <span className="label anim">{t('projects.label')}</span>
        <h2 className="projects__heading anim">
          {t('projects.heading1')} <em>{t('projects.heading2')}</em><br />{t('projects.heading3')}
        </h2>
        <p className="projects__para anim">{t('projects.para')}</p>
      </div>

      <div className="projects__divider anim" />

      <div className="projects__stats anim">
        {stats.map(({ value, labelKey }, i) => (
          <div className="projects__stat" key={labelKey}>
            {i > 0 && <div className="projects__stat-sep" />}
            <span className="projects__stat-value">{value}</span>
            <span className="projects__stat-label">{t(labelKey)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
