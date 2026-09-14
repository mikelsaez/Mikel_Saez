import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './ImpactSection.css'
import RichText from './RichText'
import useLocale from '../i18n/useLocale'

export default function ImpactSection() {
  const ref = useRef(null)
  const { content: localizedContent } = useLocale()
  const content = localizedContent.impact

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
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
    <section className="impact" ref={ref} aria-label={content.ariaLabel}>
      <div className="impact__inner">
        <span className="label anim">{content.tag}</span>
        <RichText as="h2" className="impact__heading anim">{content.heading}</RichText>
        <div className="impact__paras">
          {content.paragraphs.map((p, i) => (
            <p className="impact__para anim" key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
