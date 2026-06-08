'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plane, Ship, Truck, FileText, Package, Clock } from 'lucide-react'

type Service = {
  title: string
  description: string
  image: string
  icon: any
  link?: string
}

const servicesBySlide: Service[][] = [
  [
    {
      title: 'Air Freight',
      description: 'Ultra-fast international shipping for time-sensitive cargo and urgent shipments.',
      image: '/images/services/service1.jpg',
      icon: Plane,
      link: '/services',
    },
    {
      title: 'Sea Freight',
      description: 'Cost-effective FCL and LCL container solutions for large-scale global trade.',
      image: '/images/services/service2.jpg',
      icon: Ship,
      link: '/services',
    },
    {
      title: 'Road Freight',
      description: 'Flexible ground logistics with real-time tracking and scheduling options.',
      image: '/images/services/service3.jpg',
      icon: Truck,
      link: '/services',
    },
    {
      title: 'Customs Clearance',
      description: 'Expedited customs handling with expert documentation and compliance.',
      image: '/images/services/service1.jpg',
      icon: FileText,
      link: '/services',
    },
  ],
  [
    {
      title: 'Warehousing',
      description: 'Climate-controlled facilities with inventory management and fulfillment.',
      image: '/images/services/service1.jpg',
      icon: Package,
      link: '/services',
    },
    {
      title: 'Storage Solutions',
      description: 'Secure storage with real-time inventory tracking and access.',
      image: '/images/services/service2.jpg',
      icon: Package,
      link: '/services',
    },
    {
      title: 'Express Delivery',
      description: 'Premium same-day and next-day delivery for critical shipments.',
      image: '/images/services/service3.jpg',
      icon: Truck,
      link: '/services',
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer service and shipment tracking available.',
      image: '/images/services/service1.jpg',
      icon: Clock,
      link: '/contact',
    },
  ],
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
      description: 'Cost-effective container solutions for global trade.',
      image: '/images/services/service2.jpg',
      icon: Ship,
      link: '/services',
    },
    {
      title: 'Road Transport',
      description: 'Flexible ground logistics with real-time tracking.',
      image: '/images/services/service3.jpg',
      icon: Truck,
      link: '/services',
    },
    {
      title: 'Customs Clearance',
      description: 'Expert documentation and regulatory compliance support.',
      image: '/images/services/service1.jpg',
      icon: FileText,
      link: '/services',
    },
  ],
  [
    {
      title: 'Global Network',
      description: 'Strategic partnerships across continents for seamless logistics.',
      image: '/images/services/service2.jpg',
      icon: Ship,
      link: '/services',
    },
    {
      title: 'Real-time Tracking',
      description: 'Live visibility into every shipment milestone and location.',
      image: '/images/services/service3.jpg',
      icon: Truck,
      link: '/track',
    },
    {
      title: 'Expert Handling',
      description: 'Professional care for sensitive and high-value cargo.',
      image: '/images/services/service1.jpg',
      icon: Package,
      link: '/services',
    },
    {
      title: 'Full Coverage',
      description: 'Complete logistics solutions from origin to final destination.',
      image: '/images/services/service2.jpg',
      icon: Clock,
      link: '/services',
    },
  ],
]

interface ServiceCardsGridProps {
  activeSlideIndex: number
}

export default function ServiceCardsGrid({ activeSlideIndex }: ServiceCardsGridProps) {
  const services = servicesBySlide[activeSlideIndex] || servicesBySlide[0]
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="bg-slate-950 text-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <Link
                key={service.title}
                href={service.link || '#'}
                className={`group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-6 md:p-8 transition-all duration-500 hover:bg-white/15 hover:border-white/40 hover:shadow-2xl transform hover:scale-105 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: mounted ? `${idx * 100}ms` : '0ms',
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
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-blue-400 flex-shrink-0" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-base md:text-lg text-white/85 mb-6 flex-grow leading-relaxed">
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
  )
}
