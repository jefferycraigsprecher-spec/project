import React from 'react'

const reviews = [
  {
    quote:
      "Given my past experiences with other logistics companies, I can say without exception that the services provided by ZGG Shipping Logistics greatly exceed industry standards.",
    name: 'Monique Pete',
    role: 'Logistics Manager, Martrax Inc.',
  },
  {
    quote:
      "More than once, ZGG Shipping Logistics has 'saved the day', delivering our cargo on time with short notice. They have won my gratitude and loyalty with their 'can do' approach.",
    name: 'Steve Anderson',
    role: 'President/Owner, Duplication Factory',
  },
  {
    quote:
      "I am very pleased with the service provided by ZGG Shipping Logistics. Their communication is outstanding and we get a high level of service.",
    name: 'Cathy Beckman',
    role: 'Logistics Team, Oxea Chemicals',
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
        {reviews.map((r) => (
          <blockquote key={r.name} className="rounded-[1.5rem] border border-gray-100 bg-white p-6 text-left shadow-sm">
            <p className="text-sm leading-7 text-gray-700">“{r.quote}”</p>
            <footer className="mt-4">
              <p className="font-semibold text-navy-900">{r.name}</p>
              <p className="text-sm text-gray-500">{r.role}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
