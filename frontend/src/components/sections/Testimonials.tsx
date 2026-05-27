import React from 'react'

const reviews = [
  {
    quote:
      "Given my past experiences with other logistics companies, I can say without exception that the services provided by Midwest Shipment greatly exceed industry standards.",
    avatar: '/images/testimonials/avatar1.jpg',
    name: 'Midwest Shipment Client',
    role: 'Logistics Manager',
  },
  {
    quote:
      "More than once, Midwest Shipment has 'saved the day', delivering our cargo on time with short notice. They have won my gratitude and loyalty with their 'can do' approach.",
    avatar: '/images/testimonials/avatar2.jpg',
    name: 'Midwest Shipment Client',
    role: 'Operations Lead',
  },
  {
    quote:
      "I am very pleased with the service provided by Midwest Shipment. Their communication is outstanding and we get a high level of service.",
    avatar: '/images/testimonials/avatar3.jpg',
    name: 'Midwest Shipment Client',
    role: 'Supply Chain Coordinator',
  },
]

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <p className="section-subtitle text-brand-600">What Our Clients Say</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Hear from satisfied customers</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {reviews.map((r, i) => (
          <blockquote key={i} className="rounded-[1.5rem] border border-gray-100 bg-white p-6 text-left shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <img src={r.avatar} alt={`avatar-${i}`} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-navy-900">{r.name}</p>
                <p className="text-sm text-gray-500">{r.role}</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-gray-700">“{r.quote}”</p>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
