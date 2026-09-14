import { useEffect, useMemo, useState } from 'react'
import './LogoCarousel.css'
import RichText from './RichText'
import useLocale from '../i18n/useLocale'

const CHUNK_SIZE = 4
const AUTO_INTERVAL = 4500

function chunkLogos(logos) {
  const slides = []
  for (let index = 0; index < logos.length; index += CHUNK_SIZE) {
    slides.push(logos.slice(index, index + CHUNK_SIZE))
  }
  return slides.length ? slides : [[]]
}

export default function LogoCarousel() {
  const { content: localizedContent } = useLocale()
  const { partners: content, ui } = localizedContent
  const slides = useMemo(() => chunkLogos(content.logos), [content.logos])
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = ({ matches }) => setReducedMotion(matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (paused || reducedMotion || slides.length <= 1) return undefined
    const timer = window.setInterval(
      () => setCurrent((index) => (index + 1) % slides.length),
      AUTO_INTERVAL,
    )
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, slides.length])

  const safeCurrent = current % slides.length
  const next = () => setCurrent((index) => (index + 1) % slides.length)
  const previous = () => setCurrent((index) => (index - 1 + slides.length) % slides.length)

  return (
    <section
      className="logos"
      aria-label={ui.partnerLogos}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="logos__header">
        <span className="label">{content.tag}</span>
        <RichText as="h2" className="logos__heading">{content.heading}</RichText>
      </div>

      <div
        className="logos__track"
        key={safeCurrent}
        aria-live={paused ? 'polite' : 'off'}
        aria-atomic="true"
      >
        {slides[safeCurrent].map((logo) => (
          <div className="logos__item" key={logo.image}>
            <img
              src={logo.image}
              alt={logo.alt}
              loading="lazy"
              className={logo.className || ''}
            />
          </div>
        ))}
      </div>

      <div className="logos__controls" role="group" aria-label={ui.carouselControls}>
        <button className="logos__prev" onClick={previous} aria-label={ui.previousSlide}>
          ←
        </button>

        <div className="logos__dots" role="group" aria-label={ui.slideIndicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              aria-current={index === safeCurrent ? 'true' : undefined}
              aria-label={ui.slideOf
                .replace('{current}', index + 1)
                .replace('{total}', slides.length)}
              className={`logos__dot ${index === safeCurrent ? 'logos__dot--active' : ''}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>

        <button className="logos__next" onClick={next} aria-label={ui.nextSlide}>
          →
        </button>
      </div>
    </section>
  )
}
