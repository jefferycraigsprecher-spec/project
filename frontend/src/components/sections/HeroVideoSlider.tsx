'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Plane, Ship, Truck, FileText, Package, Clock, Globe } from 'lucide-react'

type Slide = {
  title: string
  subtitle?: string
  description?: string
  image: string
  video?: string
  primaryLabel?: string
  primaryLink?: string
  secondaryLabel?: string
  secondaryLink?: string
}

type Service = {
  title: string
  description: string
  image: string
  icon: any
  link?: string
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
    video: '/videos/hero.mp4',
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
  {
    title: 'Global logistics network you can trust.',
    subtitle: 'Connecting businesses worldwide with reliable, transparent shipping solutions across every continent.',
    description: 'Our extensive carrier partnerships and strategic hubs ensure your cargo reaches its destination safely and on schedule.',
    image: '/images/services/service3.jpg',
    primaryLabel: 'Explore network',
    primaryLink: '/services',
    secondaryLabel: 'Contact sales',
    secondaryLink: '/contact',
  },
]

const servicesBySlide: Service[][] = [
  [
    {
      title: 'Air Freight',
      description: 'Ultra-fast international shipping for time-sensitive cargo.',
      image: '/images/services/service1.jpg',
      icon: Plane,
      link: '/services',
    },
    {
      title: 'Sea Freight',
      description: 'Cost-effective FCL and LCL container solutions.',
      image: '/images/services/service2.jpg',
      icon: Ship,
      link: '/services',
    },
    {
      title: 'Road Freight',
      description: 'Flexible ground logistics with real-time tracking.',
      image: '/images/services/service3.jpg',
      icon: Truck,
      link: '/services',
    },
    {
      title: 'Customs Clearance',
      description: 'Expert documentation and compliance support.',
      image: '/images/services/service1.jpg',
      icon: FileText,
      link: '/services',
    },
  ],
  [
    {
      title: 'Warehousing',
      description: 'Climate-controlled facilities with inventory management.',
      image: '/images/services/service1.jpg',
      icon: Package,
      link: '/services',
    },
    {
      title: 'Logistics Network',
      description: 'Strategic hubs across continents for seamless distribution.',
      image: '/images/services/service2.jpg',
      icon: Globe,
      link: '/services',
    },
    {
      title: 'Same-Day Delivery',
      description: 'Premium express delivery for urgent shipments.',
      image: '/images/services/service3.jpg',
      icon: Truck,
      link: '/services',
    },
    {
      title: 'Live Tracking',
      description: 'Real-time visibility into every shipment milestone.',
      image: '/images/services/service1.jpg',
      icon: Package,
      link: '/track',
    },
  ],
  [
    {
      title: 'Specialized Handling',
      description: 'Professional care for sensitive and high-value cargo.',
      image: '/images/services/service1.jpg',
      icon: Package,
      link: '/services',
    },
    {
      title: 'Supply Chain',
      description: 'Integrated solutions from origin to destination.',
      image: '/images/services/service2.jpg',
      icon: Ship,
      link: '/services',
    },
    {
      title: 'Risk Management',
      description: 'Comprehensive insurance and liability coverage options.',
      image: '/images/services/service3.jpg',
      icon: FileText,
      link: '/services',
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer service team.',
      image: '/images/services/service1.jpg',
      icon: Clock,
      link: '/contact',
    },
  ],
  [
    {
      title: 'Global Reach',
      description: 'Connected network spanning all major trade routes.',
      image: '/images/services/service2.jpg',
      icon: Globe,
      link: '/services',
    },
    {
      title: 'Customs Solutions',
      description: 'Rapid clearance with expert regulatory guidance.',
      image: '/images/services/service3.jpg',
      icon: FileText,
      link: '/services',
    },
    {
      title: 'Cold Chain',
      description: 'Temperature-controlled logistics for perishables.',
      image: '/images/services/service1.jpg',
      icon: Truck,
      link: '/services',
    },
    {
      title: 'Consolidation',
      description: 'Cost-saving LCL grouping and optimization services.',
      image: '/images/services/service2.jpg',
      icon: Package,
      link: '/services',
    },
  ],
]

export default function HeroVideoSlider({ slides = defaultSlides }: HeroVideoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const activeSlide = slides[activeIndex] || defaultSlides[0]
  const activeServices = servicesBySlide[activeIndex] || servicesBySlide[0]
  const [videoSrc, setVideoSrc] = useState('/videos/airplane_takeoff.mp4')

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
    setAutoplayEnabled(false)
  }

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length)
    setAutoplayEnabled(false)
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
    setAutoplayEnabled(false)
  }

  useEffect(() => {
    if (!autoplayEnabled || isHovering) return

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [autoplayEnabled, isHovering, slides.length])

  useEffect(() => {
    if (autoplayEnabled || isHovering) return

    const timer = setTimeout(() => {
      setAutoplayEnabled(true)
    }, 15000)

    return () => clearTimeout(timer)
  }, [autoplayEnabled, isHovering])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/videos/hero.mp4', { method: 'HEAD' })
        if (mounted && res.ok) setVideoSrc('/videos/hero.mp4')
      } catch (e) {
        // ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [slides.length])

  return (
    <>
      <section
        className="relative w-full bg-[#0f1419] text-white overflow-hidden"
        role="region"
        aria-label="Hero carousel"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ minHeight: '100vh' }}
      >
        {/* Full-Screen Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1200 ${
                idx === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <video
                className="h-full w-full object-cover"
                src={slide.video ?? videoSrc}
                poster={slide.image}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ))}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/95 via-[#0f1419]/85 to-[#0f1419]/70" />

        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-3 md:p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-3 md:p-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-8 py-16">
          <div className="max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-snug mb-4 drop-shadow-lg">
              {activeSlide.title}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6 drop-shadow-md">
              {activeSlide.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              {activeSlide.primaryLink && activeSlide.primaryLabel && (
                <Link
                  href={activeSlide.primaryLink}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full text-base font-semibold transition-colors shadow-lg"
                >
                  {activeSlide.primaryLabel}
                </Link>
              )}
              {activeSlide.secondaryLink && activeSlide.secondaryLabel && (
                <Link
                  href={activeSlide.secondaryLink}
                  className="border-2 border-white hover:bg-white/10 px-6 py-3 rounded-full text-base font-semibold transition-all"
                >
                  {activeSlide.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-300 ${
                i === activeIndex ? 'w-8 h-3 bg-blue-400' : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              } rounded-full`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-8 z-20 text-sm font-semibold">
          {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      </section>

      {/* Service Cards Grid Section */}
      <section className="bg-[#111827] text-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {activeServices.map((service, idx) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.title}
                  href={service.link || '#'}
                  className={`group relative overflow-hidden rounded-lg backdrop-blur-md bg-white/8 border border-blue-500/30 p-5 md:p-6 transition-all duration-500 hover:bg-white/12 hover:border-blue-400/60 hover:shadow-xl transform hover:scale-105`}
                  style={{
                    transitionDelay: `${idx * 100}ms`,
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 to-slate-950/80" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="w-9 h-9 md:w-10 md:h-10 text-blue-400 flex-shrink-0" />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-sm md:text-base text-white/80 mb-4 flex-grow leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                      Learn more →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
