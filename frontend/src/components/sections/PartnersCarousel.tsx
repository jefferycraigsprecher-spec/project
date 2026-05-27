"use client"
import React, { useEffect, useRef, useState } from 'react'

const LOGOS = [
  '/images/partners/partner-01.png',
  '/images/partners/partner-02.png',
  '/images/partners/partner-03.png',
  '/images/partners/partner-04.png',
  '/images/partners/partner-05.png',
]

export default function PartnersCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)
  const rafRef = useRef<number | null>(null)
  const [paused, setPaused] = useState(false)

  const SPEED = 40 // px per second

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let last = performance.now()

    function step(now: number) {
      if (!track) return
      const dt = now - last
      last = now
      if (!paused && !isDragging.current) {
        track.scrollLeft += (SPEED * dt) / 1000
        // loop
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = track.scrollLeft - track.scrollWidth / 2
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [paused])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const track = trackRef.current
      if (!track) return
      if (e.key === 'ArrowLeft') track.scrollBy({ left: -200, behavior: 'smooth' })
      if (e.key === 'ArrowRight') track.scrollBy({ left: 200, behavior: 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function onPointerDown(e: React.PointerEvent) {
    const track = trackRef.current
    if (!track) return
    isDragging.current = true
    startX.current = e.clientX
    scrollStart.current = track.scrollLeft
    setPaused(true)
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    const track = trackRef.current
    if (!track || !isDragging.current) return
    const dx = e.clientX - startX.current
    track.scrollLeft = scrollStart.current - dx
  }

  function onPointerUp(e: React.PointerEvent) {
    isDragging.current = false
    setPaused(false)
    try { (e.target as Element).releasePointerCapture(e.pointerId) } catch {}
  }

  return (
    <div className="partner-marquee" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        ref={trackRef}
        className="flex gap-8 items-center overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="list"
        aria-label="Partner logos"
        style={{ whiteSpace: 'nowrap' }}
      >
        {[...LOGOS, ...LOGOS].map((src, i) => (
          <div key={`${src}-${i}`} style={{ flex: '0 0 auto' }} role="listitem">
            <img src={src} alt={`partner-${i}`} style={{ height: 48, display: 'block', opacity: 0.95 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
