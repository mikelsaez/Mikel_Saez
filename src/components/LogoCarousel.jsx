import { useState } from 'react'
import './LogoCarousel.css'

const slides = [
  [
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/04/logo1-edit.png', alt: 'BID - Banco Interamericano de Desarrollo' },
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/04/logo2-edit.png', alt: 'UN Tourism' },
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/04/logo3edit.png',  alt: 'The World Bank' },
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/04/logo4-edit.png', alt: 'UN-HABITAT' },
  ],
  [
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/04/logo5edit.png',  alt: 'Partner Logo 5' },
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/04/logo6edit.png',  alt: 'Partner Logo 6' },
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/04/logo7edit.png',  alt: 'Partner Logo 7' },
  ],
  [
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/03/descarga-2.png', alt: 'OECD' },
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/03/descarga-8.png', alt: 'Partner' },
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/03/descarga-11.png', alt: 'Partner' },
    { src: 'https://saezdevicuna.eus/wp-content/uploads/2026/03/descarga-10.png', alt: 'Partner' },
  ],
]

export default function LogoCarousel() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((c) => (c + 1) % slides.length)
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)

  return (
    <section className="logos">
      <div className="logos__track">
        {slides[current].map((logo, i) => (
          <div className="logos__item" key={i}>
            <img src={logo.src} alt={logo.alt} />
          </div>
        ))}
      </div>

      <div className="logos__controls">
        <button className="logos__prev" onClick={prev} aria-label="Previous">←</button>
        <span className="logos__counter">{current + 1} / {slides.length}</span>
        <button className="logos__next" onClick={next} aria-label="Next">→</button>
      </div>
    </section>
  )
}
