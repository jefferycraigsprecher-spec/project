'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, PackageSearch, ShieldCheck, Clock3, Truck } from 'lucide-react'

const normalizeTrackingCode = (raw = '') => {
  const value = String(raw || '').trim().toUpperCase().replace(/\s+/g, '')
  if (!value) return ''
  if (value.startsWith('MSC-')) return value
  return `MSC-${value}`
}

export default function TrackingSection() {
  const [trackingId, setTrackingId] = useState('')
  const router = useRouter()

  const handleTrack = () => {
    const normalized = normalizeTrackingCode(trackingId)
    if (normalized && normalized !== 'MSC-') router.push(`/track?id=${normalized}`)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 md:p-12">
            <div className="hero-stripe absolute inset-0 opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.28),_transparent_28%),linear-gradient(135deg,#0f172a_0%,#111827_55%,#0b1120_100%)]" />
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-500" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr,0.85fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-brand-100">
                  <PackageSearch className="h-3.5 w-3.5" />
                  Real-Time Tracking
                </div>
                <h2 className="mt-4 font-display text-3xl md:text-4xl text-white uppercase">Track & Trace Your Shipment</h2>
                <p className="mt-4 text-sm leading-7 text-gray-200 md:text-base">
                  Enter your tracking number to get real-time updates on your package, including current location, route progress, and delivery status.
                </p>

                <div className="mt-6 text-center">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID or code"
                    className="inline-block w-[250px] rounded-[1rem] border border-white/10 bg-white px-5 py-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  />
                  <button
                    onClick={handleTrack}
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-[1rem] bg-gradient-to-r from-brand-500 to-amber-300 px-6 py-4 font-display font-semibold uppercase tracking-[0.2em] text-slate-950 transition-all duration-200 hover:brightness-105"
                  >
                    <Search className="h-4 w-4" />
                    Track Now
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-gray-300 sm:text-left">
                  Example format: <span className="font-mono text-brand-200">MSC-4F8A2B1C9D</span>. The prefix is optional.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { icon: ShieldCheck, label: 'Secure Visibility' },
                  { icon: Clock3, label: 'Live Status Updates' },
                  { icon: Truck, label: 'Fast Delivery Routing' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-brand-300" />
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

