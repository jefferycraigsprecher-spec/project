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
  { label: 'Global coverage', value: '160 countries' },
  { label: 'Customer rating', value: '4.9/5' },
]

const trustItems = [
  {
    title: 'Accelerated dispatch',
    description: 'Move faster with intelligent routing and proactive shipment coordination.',
  },
  {
    title: 'Safe, compliant cargo',
    description: 'Regulated, insured logistics for sensitive and high-value deliveries.',
  },
  {
    title: 'Enterprise-grade tracking',
    description: 'Live tracking and transparent updates for every leg of the journey.',
  },
]

export default function MidwestHome() {
  return (
    <div className="bg-slate-950 text-white font-sans">
      <Navbar />

      <main>
        <HeroVideoSlider />

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-0 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-5">
              <div className="relative overflow-hidden rounded-[2rem]">
                <video
                  className="h-full w-full object-cover"
                  src="/videos/airplane_takeoff.mp4"
                  poster="/images/hero-poster.png"
                  controls
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[1.75rem] border border-white/10 bg-black/50 p-6 backdrop-blur-xl text-white">
                  <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Hero Video</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A behind-the-scenes look at our logistics operations.</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                    Watch how Midwest Shipment keeps every package moving safely and on time with premium handling, real-time updates, and global network coordination.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950/80 shadow-inner">
                <img src="/images/hero-poster.png" alt="Logistics preview" className="h-64 w-full rounded-[1.75rem] object-cover" />
                <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Hero Image</p>
                  <p className="mt-2 text-lg font-semibold">A polished still frame from our logistics operations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
            <div>
              <p className="section-subtitle text-brand-400">Watch and discover</p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Closing the gap between shipping and visibility.</h2>
              <p className="mt-6 text-slate-300 leading-8">
                This hero section brings the energy to the page with a cinematic view of our transport and fulfillment workflow. It’s the perfect companion for the premium white card layout and fills the blank space with motion.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Fast Dispatch</p>
                <p className="mt-3 text-lg font-semibold text-white">Real-time cargo movement across air, sea, and road.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Secure Delivery</p>
                <p className="mt-3 text-lg font-semibold text-white">Premium protection and tracking for every package.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/about" className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-400">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/20">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[0.95fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <p className="section-subtitle">Track smarter</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Instant shipment tracking in one sleek dashboard.</h2>
              <p className="mt-6 max-w-2xl text-slate-300 leading-8">
                Enter your tracking number and get end-to-end visibility with the same premium logistics experience trusted by enterprise teams.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-5 py-4 text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button className="inline-flex min-w-[170px] items-center justify-center rounded-3xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-400">
                  <Search className="mr-2 h-4 w-4" />
                  Track Shipment
                </button>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{stat.label}</p>
                  <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
              <img src="/images/services/service-right-1.jpg" alt="Logistics overview" className="h-full min-h-[420px] w-full rounded-[1.75rem] object-cover" />
              <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-tr from-black/50 via-black/20 to-black/0" />
            </div>
            <div className="space-y-8">
              <div>
                <p className="section-subtitle text-brand-400">Why choose Midwest</p>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Modern logistics for brands that need speed and trust.</h2>
                <p className="mt-6 text-slate-300 leading-8">
                  We combine premium cargo handling, secure supply chain workflows, and transparent communication so your shipments move reliably from origin to destination.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {trustItems.map((item) => (
                  <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-slate-300 leading-7">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="section-subtitle text-brand-600">Services</p>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Built for air, sea, road, and secure cargo flows.</h2>
                <p className="mt-4 text-slate-300 leading-8">
                  Our platform helps teams manage complex logistics with speed, visibility, and premium support whenever it matters most.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {services.map((service) => {
                  const Icon = service.icon
                  return (
                    <div key={service.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-brand-400/30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-white">{service.title}</h3>
                      <p className="mt-3 text-slate-300 leading-7">{service.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="section-subtitle text-brand-600">Contact Midwest Shipment</p>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Reach our logistics team anytime.</h2>
                <p className="mt-4 text-slate-300 leading-8">
                  For quotes, tracking help, or urgent shipping questions, call or email our customer care specialists now.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-8 shadow-xl">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Customer Support</p>
                    <p className="mt-3 text-2xl font-semibold text-white">+1 (239) 746-8728</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Email</p>
                    <a href="mailto:info.midwestshipment@gmail.com" className="mt-3 block text-2xl font-semibold text-brand-500 hover:text-brand-400">
                      info.midwestshipment@gmail.com
                    </a>
                  </div>
                  <div className="rounded-[1.5rem] bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Need fast help?</p>
                    <p className="mt-3 text-slate-300 leading-7">
                      Available 24/7 for urgent imports, exports, customs support, and same-day cargo coordination.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Testimonials />

      <Footer />
    </div>
  )
}
