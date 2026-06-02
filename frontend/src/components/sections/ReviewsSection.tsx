import { Star } from 'lucide-react'

const reviews = [
  {
    avatar: '/images/testimonials/avatar4.jpg',
    name: 'Noah Walker',
    role: 'Logistics Manager',
    text: 'Midwest Shipment greatly exceeds industry standards with clear communication, reliable handling, and fast coordination.',
    rating: 5,
  },
  {
    avatar: '/images/testimonials/avatar5.jpg',
    name: 'Ava Morgan',
    role: 'Operations Director',
    text: 'More than once, Midwest Shipment has saved the day by delivering our cargo on time with short notice.',
    rating: 5,
  },
  {
    avatar: '/images/testimonials/avatar6.jpg',
    name: 'Liam Chen',
    role: 'Supply Chain Lead',
    text: 'Their communication is outstanding and the coordination is always reliable from pickup through delivery.',
    rating: 5,
  },
]

export default function ReviewsSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-3xl">
          <p className="section-subtitle">What Our Clients Say</p>
          <h2 className="mt-3 section-title text-navy-500">Trusted shipment visibility for customers who need confidence at every handoff.</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <div key={i} className="border border-gray-100 bg-white p-6 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt={`avatar-${i}`} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-navy-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-brand-500">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-gray-600">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
