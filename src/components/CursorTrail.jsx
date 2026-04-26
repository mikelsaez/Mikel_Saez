import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './CursorTrail.css'

export default function CursorTrail() {
  const glowRef  = useRef(null)
  const dotRef   = useRef(null)
  const path1Ref = useRef(null)
  const path2Ref = useRef(null)

  useEffect(() => {
    const NP     = 28
    const ptdata = []
    let   idleTimer

    const glow = glowRef.current
    const dot  = dotRef.current
    const p1   = path1Ref.current
    const p2   = path2Ref.current

    // ── quickSetters: fastest way to move elements on mousemove ─────────────
    // GSAP manages x/y & scale separately so they compose correctly in the
    // transform matrix — no more "stuck glow" bug.
    const setGlowX = gsap.quickSetter(glow, 'x', 'px')
    const setGlowY = gsap.quickSetter(glow, 'y', 'px')
    const setDotX  = gsap.quickSetter(dot,  'x', 'px')
    const setDotY  = gsap.quickSetter(dot,  'y', 'px')

    // Half-sizes for centering (glow=520px, dot=5px)
    const GLOW_HALF = 260
    const DOT_HALF  = 2.5

    // ── Trail helpers ────────────────────────────────────────────────────────
    const redraw = () => {
      if (ptdata.length < 2) return
      p2.setAttribute('stroke-width', (ptdata.length / NP) * 5.5)
      const d = 'M' + ptdata.map(([x, y]) => `${x},${y}`).join(' L')
      p1.setAttribute('d', d)
      p2.setAttribute('d', d)
    }

    const shrink = () => {
      if (ptdata.length > 1) { ptdata.shift(); redraw() }
    }

    // ── Mouse handler ────────────────────────────────────────────────────────
    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY

      // Move glow & dot — GSAP x/y, offset so they centre on cursor
      setGlowX(x - GLOW_HALF)
      setGlowY(y - GLOW_HALF)
      setDotX(x - DOT_HALF)
      setDotY(y - DOT_HALF)

      // Trail data
      ptdata.push([x, y])
      if (ptdata.length > NP) shrink()
      redraw()

      // Moving state: dot shrinks slightly, glow expands
      gsap.to(dot,  { scale: 0.5, opacity: 0.6, duration: 0.12, overwrite: true })
      gsap.to(glow, { scale: 1.2, duration: 0.25, overwrite: true })

      // Reset to idle state after 120ms of no movement
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        gsap.to(dot,  { scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out', overwrite: true })
        gsap.to(glow, { scale: 1, duration: 0.55, ease: 'power2.out', overwrite: true })
      }, 120)
    }

    document.addEventListener('mousemove', onMove)
    gsap.ticker.fps(60)
    gsap.ticker.add(shrink)

    return () => {
      document.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(shrink)
      clearTimeout(idleTimer)
    }
  }, [])

  return (
    <>
      {/* Soft spotlight glow blob */}
      <div ref={glowRef} className="ct-glow" />

      {/* Visible centre dot — always present */}
      <div ref={dotRef} className="ct-dot" />

      {/* Light trail SVG */}
      <svg className="cursor-trail" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ct-glow-f" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1.3 0.1 0   0 0
                      0.9 0.8 0   0 0
                      0   0   0.3 0 0
                      0   0   0   1 0"
              result="tinted" />
            <feMerge>
              <feMergeNode in="tinted" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ct-goo-f" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8"
              result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>

        <path ref={path1Ref} fill="none" stroke="#c4a96a"
          strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          filter="url(#ct-glow-f)" opacity="0.82" />

        <path ref={path2Ref} fill="none" stroke="rgba(245,240,228,0.72)"
          strokeLinecap="round" strokeLinejoin="round"
          filter="url(#ct-goo-f)" />
      </svg>
    </>
  )
}
