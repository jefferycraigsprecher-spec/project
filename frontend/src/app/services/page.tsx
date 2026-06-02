import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Testimonials from '@/components/sections/Testimonials';
import { ArrowRight, CheckCircle } from 'lucide-react';

const services = [
  {
    title: 'Air Freight',
    description: 'IATA-endorsed air forwarding for urgent, cross-border shipments with high visibility.',
    image: '/images/services/service1.jpg',
  },
  {
    title: 'Sea/Ocean Freight',
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

const benefits = [
  'Real-time tracking and proactive communication',
  'Custom handling for fragile and high-value freight',
  'Cross-border support for smooth customs movement',
  'Dedicated coordination for urgent and secure cargo',
];

export default function ServicesPage() {
  return (
    <div className="bg-slate-950 text-white font-sans">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Comprehensive Logistics Services
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From air freight to secure diplomatic handling, we deliver end-to-end logistics with visible control, dependable coordination, and polished execution.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-brand-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400">
                Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/track" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
                Track a Shipment
              </Link>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-white/95 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-slate-900/5 sm:p-10">
            <div className="max-w-3xl">
              <p className="text-brand-600 font-semibold uppercase tracking-widest mb-3">Why Choose Our Services</p>
              <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl mb-6">
                A polished logistics experience from planning to delivery.
              </h2>
              <p className="text-slate-600 leading-8 mb-8">
                Every shipment is managed with a unified approach — rapid coordination, clean communication, and real-time visibility. Whether you need a single leg or a fully integrated logistics program, we build the path around your cargo and timeline.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-600 shrink-0 mt-1" />
                    <p className="text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-brand-400 font-semibold uppercase tracking-widest mb-3">Our Services</p>
              <h2 className="text-4xl font-bold mb-6">Built for air, sea, road, secure, and storage logistics</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Each service is designed to support your cargo with clear communication, secure handling, and tailored dispatch support.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {services.map(({ image, title, description }) => (
                <div
                  key={title}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl backdrop-blur-xl"
                >
                  <div className="mb-6 overflow-hidden rounded-2xl h-40">
                    <img src={image} alt={title} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                  <p className="text-slate-300 text-sm leading-7 mb-6">{description}</p>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-900/50 px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-12 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold">Need a tailored logistics solution?</h2>
                <p className="text-brand-100 text-lg mt-2">Let's build the right plan for your cargo.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-brand-600 shadow-lg transition hover:bg-slate-100">
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Testimonials />

      <Footer />
    </div>
  );
}
