import { useState, useEffect, useRef } from 'react'
import './LogoCarousel.css'

import contentData from '../data/content.json'

const content = contentData.partners

const chunkSize = 4;
const slides = [];
for (let i = 0; i < content.logos.length; i += chunkSize) {
  slides.push(content.logos.slice(i, i + chunkSize).map(logo => ({
    src: logo.image,
    alt: logo.alt,
    className: logo.className || ''
  })));
}
if (slides.length === 0) slides.push([])

const AUTO_INTERVAL = 4500

export default function LogoCarousel() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const goTo = (idx) => {
    if (fading) return
    setFading(true)
    setTimeout(() => {
      setCurrent(idx)
      setFading(false)
    }, 380)
  }

  const next = () => goTo((current + 1) % slides.length)
  const prev = () => goTo((current - 1 + slides.length) % slides.length)

  // Auto-play
  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(next, AUTO_INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [current, paused]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      className="logos"
      aria-label="Partner logos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="logos__header">
        <span className="label">{content.tag}</span>
        <h2 className="logos__heading" dangerouslySetInnerHTML={{ __html: content.heading }} />
      </div>

      <div
        className={`logos__track ${fading ? 'logos__track--fading' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {slides[current].map((logo, i) => (
          <div className="logos__item" key={i}>
            <img src={logo.src} alt={logo.alt} loading="lazy" className={logo.className} />
          </div>
        ))}
      </div>

      <div className="logos__controls" role="group" aria-label="Carousel controls">
        <button
          className="logos__prev"
          onClick={prev}
          aria-label="Previous slide"
        >
          ←
        </button>

        <div className="logos__dots" role="tablist" aria-label="Slide indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1} of ${slides.length}`}
              className={`logos__dot ${i === current ? 'logos__dot--active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button
          className="logos__next"
          onClick={next}
          aria-label="Next slide"
        >
          →
        </button>
      </div>
    </section>
  )
}
