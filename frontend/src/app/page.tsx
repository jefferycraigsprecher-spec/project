import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Testimonials from '@/components/sections/Testimonials';
import PartnersCarousel from '@/components/sections/PartnersCarousel';
import Link from 'next/link';
import { Search, Clock, ArrowRight, Award, MapPin, Users } from 'lucide-react';

const services = [
  {
    title: 'Air Freight',
    description: 'IATA-endorsed air forwarding for urgent, cross-border shipments with high visibility.',
    image: '/images/services/service1.jpg',
  },
  {
    title: 'Sea / Ocean Freight',
    description: 'FCL, LCL, and door-to-door ocean transport backed by professional port handling.',
    image: '/images/services/service2.jpg',
  },
  {
    title: 'Road Transportation',
    description: 'National and regional transport with reliable last-mile delivery coverage.',
    image: '/images/services/service3.jpg',
  },
  {
    title: 'Diplomatic Logistics',
    description: 'Secure and discreet handling for sensitive materials, documents, and diplomatic cargo.',
    image: '/images/services/service4.jpg',
  },
  {
    title: 'Warehousing',
    description: 'Flexible storage solutions with real-time inventory visibility and secure staging.',
    image: '/images/services/service5.jpg',
  },
  {
    title: 'Packaging & Storage',
    description: 'Protective packaging, consolidation, and cargo insurance for every shipment type.',
    image: '/images/services/service6.jpg',
  },
];

const highlights = [
  {
    icon: MapPin,
    title: 'Global Coverage',
    detail: 'US, Europe, and worldwide freight lanes with trusted partner networks.',
  },
  {
    icon: Clock,
    title: 'Express Delivery',
    detail: 'Rapid transit options for time-sensitive parcels and urgent cargo.',
  },
  {
    icon: Award,
    title: 'Proven Reliability',
    detail: 'Industry-leading performance and secure handling for every shipment.',
  },
  {
    icon: Users,
    title: '24/7 Support',
    detail: 'Dedicated logistics support and customer service around the clock.',
  },
];

export default function MidwestHome() {
  return (
    <div className="bg-slate-950 text-white font-sans">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover hero-video"
            src="/videos/airplane_takeoff.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-poster.png"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-slate-950/60 to-black/75 overlay" />
          <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-32">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-100">
                Fastest & Reliable Courier Service
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
                Ship smarter with a trusted logistics partner for air, sea, road and secure delivery.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-200 sm:text-xl">
                Global freight management, transparent tracking, and dependable delivery built for modern shipping teams.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/track" className="inline-flex items-center justify-center rounded-full bg-brand-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400">
                  Track Shipment
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
                  Get a Quote
                </Link>
              </div>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Deliveries per year', value: '101,273+' },
                { label: 'Countries served', value: '160+' },
                { label: 'On-time rate', value: '99.8%' },
                { label: '24/7 support', value: 'Always' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-300">{item.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-24 px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-white/95 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-slate-900/5 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
              <div>
                <p className="section-subtitle text-brand-600">Track & Trace Your Shipment</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                  Get real-time updates on every milestone.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  Enter your tracking number to see the latest location, delivery ETA, and status updates from dispatch to destination.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter tracking number"
                    className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <button className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/20 hover:bg-brand-500">
                    <Search className="mr-2 h-4 w-4" />
                    Track
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle text-brand-600">Our Services</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Comprehensive logistics for every cargo type.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 mx-auto max-w-2xl">
              From diplomatic secure shipments to warehousing and express transport, our courier services are equipped for global freight operations.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-6 overflow-hidden rounded-2xl h-40">
                  <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-600">
                  Learn More <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners Carousel */}
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PartnersCarousel />
          </div>
        </section>

        <section className="bg-slate-950 px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="section-subtitle text-brand-400">Why Choose Us</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">A trusted partner for fast, secure and visible courier services.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              We combine modern fleet operations, intelligent tracking, and professional handling to give you confidence at every shipment stage.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {highlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <div key={highlight.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left shadow-sm backdrop-blur-xl">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{highlight.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{highlight.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Testimonials />

      <Footer />
    </div>
  );
}
