'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Slide = {
  title: string
  subtitle?: string
  description?: string
  image: string
  primaryLabel?: string
  primaryLink?: string
  secondaryLabel?: string
  secondaryLink?: string
}

type HeroVideoSliderProps = {
  slides?: Slide[]
}

const defaultSlides: Slide[] = [
  {
    title: 'Fast freight movement across air, sea and road.',
    subtitle: 'Real-time tracking, premium handling, and logistics support built for modern supply chains.',
    description: 'Move shipments with confidence using our secure carrier network, advanced tracking, and dedicated customer success team.',
    image: '/images/hero-poster.png',
    primaryLabel: 'Track your shipment',
    primaryLink: '/track',
    secondaryLabel: 'View services',
    secondaryLink: '/services',
  },
  {
    title: 'End-to-end warehousing and delivery solutions.',
    subtitle: 'From pickup to last-mile delivery, Midwest Shipment provides seamless logistics coverage for every cargo need.',
    description: 'Secure storage, intelligent routing, and proactive shipment communication help every package arrive on time.',
    image: '/images/services/service4.jpg',
    primaryLabel: 'Shipment services',
    primaryLink: '/services',
    secondaryLabel: 'Contact support',
    secondaryLink: '/contact',
  },
  {
    title: 'Premium cargo care for urgent and sensitive loads.',
    subtitle: 'Specialized handling, real-time updates, and customs support for high-value freight.',
    description: 'Delivering urgent shipments with the speed, visibility, and reliability your business expects.',
    image: '/images/services/service2.jpg',
    primaryLabel: 'Get a quote',
    primaryLink: '/contact',
    secondaryLabel: 'Why Midwest?',
    secondaryLink: '/about',
  },
]

export default function HeroVideoSlider({ slides = defaultSlides }: HeroVideoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = slides[activeIndex] || defaultSlides[0]

  const indicators = useMemo(
    () => slides.map((slide, index) => ({ index, title: slide.title })),
    [slides]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 8500)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Midwest Shipment</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{activeSlide.title}</h1>
              <p className="mt-6 max-w-2xl text-slate-200 leading-8">{activeSlide.subtitle}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {activeSlide.primaryLink && activeSlide.primaryLabel && (
                  <Link
                    href={activeSlide.primaryLink}
                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    {activeSlide.primaryLabel}
                  </Link>
                )}
                {activeSlide.secondaryLink && activeSlide.secondaryLabel && (
                  <Link
                    href={activeSlide.secondaryLink}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    {activeSlide.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Next-day delivery</p>
                <p className="mt-3 text-2xl font-bold text-white">1-2 days</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Covered routes</p>
                <p className="mt-3 text-2xl font-bold text-white">160+ countries</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Support</p>
                <p className="mt-3 text-2xl font-bold text-white">24/7 logistics care</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {indicators.map((indicator) => (
                <button
                  key={indicator.index}
                  type="button"
                  onClick={() => setActiveIndex(indicator.index)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${indicator.index === activeIndex ? 'bg-sky-500 text-white' : 'bg-white/10 text-slate-200 hover:bg-white/20'}`}
                >
                  {indicator.title}
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Featured route</p>
              <p className="mt-2 text-xl font-semibold text-white">Reliable pickup and delivery for every lane.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
