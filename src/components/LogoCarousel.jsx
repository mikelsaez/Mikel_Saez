import { useState, useEffect, useRef } from 'react'
import './LogoCarousel.css'

import logo1 from '../assets/img/logo1 new.png'
import logo2 from '../assets/img/logo2 new.png'
import logo3 from '../assets/img/logo3 new.png'
import logo4 from '../assets/img/logo4 new.png'
import logo5 from '../assets/img/logo5 new.png'
import logo6 from '../assets/img/logo6 new.png'
import logo7 from '../assets/img/logo7 new.png'
import logo8 from '../assets/img/logo8 new.png'
import logo9 from '../assets/img/logo9 new.png'
import logo10 from '../assets/img/logo10 new.png'
import logo11 from '../assets/img/logo11 new.png'
import logo12 from '../assets/img/logo12 new.png'

const slides = [
  [
    { src: logo1, alt: 'Partner 1' },
    { src: logo2, alt: 'Partner 2' },
    { src: logo3, alt: 'Partner 3' },
    { src: logo4, alt: 'Partner 4' },
  ],
  [
    { src: logo5, alt: 'Partner 5' },
    { src: logo6, alt: 'Partner 6' },
    { src: logo7, alt: 'Partner 7' },
    { src: logo8, alt: 'Partner 8' },
  ],
  [
    { src: logo9, alt: 'Partner 9' },
    { src: logo10, alt: 'Partner 10' },
    { src: logo11, alt: 'Partner 11' },
    { src: logo12, alt: 'Partner 12' },
  ]
]

const AUTO_INTERVAL = 4500

export default function LogoCarousel() {
  const [current,   setCurrent]   = useState(0)
  const [fading,    setFading]    = useState(false)
  const [paused,    setPaused]    = useState(false)
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
        <span className="label">PARTNERS</span>
        <h2 className="logos__heading">
          Organizations I have <em>worked with</em>
        </h2>
      </div>

      <div
        className={`logos__track ${fading ? 'logos__track--fading' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {slides[current].map((logo, i) => (
          <div className="logos__item" key={i}>
            <img src={logo.src} alt={logo.alt} loading="lazy" />
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
