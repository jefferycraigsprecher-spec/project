"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Star } from 'lucide-react'
// @ts-ignore
import 'swiper/css'
// @ts-ignore
import 'swiper/css/pagination'

const reviews = [
  {
    quote:
      'Midwest Shipment delivered our most critical freight ahead of schedule. Their team coordinates every lane and the visibility is truly best-in-class.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    name: 'Olivia Harper',
    role: 'Logistics Manager',
  },
  {
    quote:
      'The service felt premium from the start. Our customs clearance and tracking experience is more efficient than any carrier we have worked with.',
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80',
    name: 'Ethan Brooks',
    role: 'Operations Director',
  },
  {
    quote:
      'Our shipments are now moving with more confidence and less risk. Midwest Shipment makes complex courier logistics feel simple.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    name: 'Sophia Patel',
    role: 'Supply Chain Lead',
  },
]

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="section-subtitle text-brand-400">Trusted by international partners</p>
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Customer testimonials from premium logistics clients</h2>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        autoplay={{ delay: 8500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="space-y-8"
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-10 shadow-2xl backdrop-blur-xl text-white">
              <div className="flex items-center gap-2 text-brand-300">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-8 text-lg leading-9 text-slate-100">
                “{review.quote}”
              </blockquote>
              <div className="mt-10 flex items-center gap-4">
                <img src={review.avatar} alt={review.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-white">{review.name}</p>
                  <p className="text-sm text-slate-400">{review.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
