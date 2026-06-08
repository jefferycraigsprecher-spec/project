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
    <div className="md:bg-[#1a2338] bg-[#1a2338] text-white min-h-screen">
      <section className="hero px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{activeSlide.title}</h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">{activeSlide.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {activeSlide.primaryLink && activeSlide.primaryLabel && (
              <Link
                href={activeSlide.primaryLink}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-full text-lg font-medium"
              >
                {activeSlide.primaryLabel}
              </Link>
            )}
          </div>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">
          <img src={activeSlide.image} className="w-full rounded-2xl" alt="Air freight" />
        </div>
      </section>
    </div>
  )
}
