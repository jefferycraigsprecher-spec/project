import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Testimonials from '@/components/sections/Testimonials'
import HeroVideoSlider from '@/components/sections/HeroVideoSlider'
import { Search, ArrowRight, Truck, Ship, Warehouse, Globe, ShieldCheck, Package } from 'lucide-react'

const services = [
  {
    icon: Truck,
    title: 'Air & Road Freight',
    description: 'Seamless global freight movement with fast, efficient air and ground logistics.',
  },
  {
    icon: Ship,
    title: 'Ocean Freight',
    description: 'Reliable FCL and LCL ocean shipping supported by full customs and port management.',
  },
  {
    icon: Warehouse,
    title: 'Warehousing',
    description: 'Smart storage solutions with secure facilities and inventory visibility.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'A worldwide carrier network built for cross-border shipments and regional distribution.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Logistics',
    description: 'Protected handling for sensitive cargo, documents, and high-value freight.',
  },
  {
    icon: Package,
    title: 'Fulfillment & Packaging',
    description: 'Custom packaging, consolidation, and insured delivery for every shipment.',
  },
]

const stats = [
  { label: 'Delivered packages', value: '2.1M+' },
  { label: 'Trusted partners', value: '500+' },
  { label: 'Countries covered', value: '160+' },
  { label: 'Customer rating', value: '4.9/5' },
]

const trustItems = [
  {
    title: 'Accelerated dispatch',
    description: 'Intelligent routing and proactive coordination to move shipments faster.',
  },
  {
    title: 'Safe, compliant cargo',
    description: 'Insured, regulated handling for sensitive and high-value deliveries.',
  },
  {
    title: 'Enterprise visibility',
    description: 'Live tracking and transparent updates for every shipment milestone.',
  },
]

export default function MidwestHome() {
  return (
    <div className="bg-[var(--bg)] text-[var(--text-primary)] font-sans">
      <Navbar />

      <main>
        <HeroVideoSlider />

        <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-10 shadow-xl">
              <p className="section-subtitle text-brand-600">Reliable courier services</p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">A professional shipping experience built for brands and enterprise logistics.</h2>
              <p className="max-w-2xl text-[var(--text-muted)] leading-8">
                Midwest Shipment makes your cargo movement look premium from pickup through delivery. Our service model mirrors the consistency of top courier brands while using your own distinctive imagery.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Express shipping</p>
                  <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">Next-day delivery on select routes.</p>
                </div>
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Trusted operations</p>
                  <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">Track packages with real-time updates and alerts.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/track" className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-500">
                  Track Shipment
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-sm font-semibold text-[var(--text-primary)] transition hover:brightness-110">
                  Request a quote
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-xl">
              <img src="/images/service-right-1.jpg" alt="Courier delivery" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="bg-[var(--bg)]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-6">
                <p className="section-subtitle text-brand-600">Track with confidence</p>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">One dashboard for every package and every lane.</h2>
                <p className="text-[var(--text-muted)] leading-8">
                  Enter your tracking code below to get live updates, delivery estimates, and shipment details from our carrier network.
                </p>
                <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
                  <input
                    type="text"
                    placeholder="Enter tracking number"
                    className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <button className="inline-flex min-w-[170px] items-center justify-center rounded-3xl bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-500">
                    <Search className="mr-2 h-4 w-4" />
                    Track Now
                  </button>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-muted)]">{stat.label}</p>
                    <p className="mt-4 text-3xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="section-subtitle text-brand-600">Why choose Midwest</p>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Premium parcel care for every stage of your delivery.</h2>
                <p className="mt-4 text-slate-600 leading-8">
                  We combine high-touch customer service, secure handling, and intelligent routing so your shipments arrive on time with full visibility.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {trustItems.map((item) => (
                  <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-slate-600 leading-7">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div key={service.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400/30">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-3 text-slate-600 leading-7">{service.description}</p>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Testimonials />

      <Footer />
    </div>
  )
}
