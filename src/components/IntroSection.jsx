import './IntroSection.css'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import RichText from './RichText'
import useLocale from '../i18n/useLocale'

export default function IntroSection() {
  const ref = useRef(null)
  const { content: localizedContent } = useLocale()
  const content = localizedContent.intro

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
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
        <RichText as="h2" className="intro__heading anim">{content.heading}</RichText>
        <div className="intro__rule anim" />
        <RichText as="p" className="intro__para anim">{content.paragraph}</RichText>
      </div>
    </section>
  )
}
