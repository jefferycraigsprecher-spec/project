'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Testimonials from '@/components/sections/Testimonials'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import api from '@/lib/api'
import { STATUS_LABELS, SERVICE_LABELS, formatDate, formatDateTime } from '@/lib/utils'
import { AlertCircle, CalendarDays, Clock3, MapPin, Package, Search, ShieldCheck, UserRound } from 'lucide-react'
import type { Shipment, TrackingEvent } from '@/types'

const statusFlow = [
  'processing',
  'picked_up',
  'in_transit',
  'customs_clearance',
  'arrived_at_facility',
  'out_for_delivery',
  'delivered',
]

function TrackingContent() {
  const searchParams = useSearchParams()
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '')
  const [customer, setCustomer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ shipment: Shipment; events: TrackingEvent[] } | null>(null)

  const activeIndex = useMemo(() => {
    if (!result?.shipment.status) return 0
    if (result.shipment.status === 'failed_delivery') return statusFlow.indexOf('out_for_delivery')
    return Math.max(0, statusFlow.indexOf(result.shipment.status))
  }, [result])

  const handleTrack = async (id = trackingId) => {
    const code = id.trim().toUpperCase()
    const customerKey = customer.trim()

    if (!code || !customerKey) {
      setError('Enter your tracking code and recipient email or phone number.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await api.get(`/shipments/track/${code}`, { params: { customer: customerKey } })
      setResult({ shipment: res.data.shipment, events: res.data.events || [] })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Tracking details were not found.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) setTrackingId(id.toUpperCase())
  }, [searchParams])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 py-14 text-white">
          <div className="mx-auto max-w-5xl px-4">
            <div className="max-w-3xl">
              <p className="section-subtitle text-brand-300">Secure shipment lookup</p>
              <h1 className="mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">Track your package</h1>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Use the tracking code and the recipient email or phone number on the shipment to view current status, location, delivery estimate, and timeline history.
              </p>
            </div>

            <div className="mt-8 grid gap-3 bg-white p-3 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.75)] md:grid-cols-[1fr_1fr_auto]">
              <input
                value={trackingId}
                onChange={(event) => setTrackingId(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleTrack()}
                placeholder="Tracking code"
                className="min-h-12 border border-slate-200 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-brand-500"
              />
              <input
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleTrack()}
                placeholder="Recipient email or phone"
                className="min-h-12 border border-slate-200 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-brand-500"
              />
              <button onClick={() => handleTrack()} disabled={loading} className="btn-primary justify-center px-8">
                <Search className="h-4 w-4" />
                {loading ? 'Searching' : 'Track'}
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          {loading && <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}

          {error && (
            <div className="border border-red-200 bg-red-50 p-5 text-red-700">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Tracking unavailable</p>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-50 p-3 text-brand-600">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Tracking code</p>
                        <p className="mt-1 font-mono text-xl font-bold text-navy-900">{result.shipment.tracking_id}</p>
                      </div>
                    </div>
                    <StatusBadge status={result.shipment.status} />
                  </div>

                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute left-3 right-3 top-4 h-0.5 bg-gray-200" />
                      <div
                        className="absolute left-3 top-4 h-0.5 bg-brand-500 transition-all"
                        style={{ width: `${(activeIndex / (statusFlow.length - 1)) * 100}%`, maxWidth: 'calc(100% - 1.5rem)' }}
                      />
                      <div className="relative grid grid-cols-4 gap-3 md:grid-cols-7">
                        {statusFlow.map((status, index) => {
                          const active = index <= activeIndex
                          return (
                            <div key={status} className="flex flex-col items-center gap-2">
                              <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                {index + 1}
                              </div>
                              <span className={`text-center text-[0.65rem] font-bold uppercase tracking-[0.12em] ${active ? 'text-brand-700' : 'text-gray-400'}`}>
                                {STATUS_LABELS[status]}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="border border-gray-100 bg-white p-5">
                    <CalendarDays className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Delivery estimate</p>
                    <p className="mt-1 font-semibold text-navy-900">{formatDate(result.shipment.estimated_delivery || null)}</p>
                  </div>
                  <div className="border border-gray-100 bg-white p-5">
                    <MapPin className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Current location</p>
                    <p className="mt-1 font-semibold text-navy-900">{result.shipment.current_location || 'Location pending'}</p>
                  </div>
                  <div className="border border-gray-100 bg-white p-5">
                    <ShieldCheck className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Service</p>
                    <p className="mt-1 font-semibold text-navy-900">{SERVICE_LABELS[result.shipment.service_type]}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-gray-100 bg-white p-5">
                  <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-navy-900">
                    <UserRound className="h-4 w-4 text-brand-500" />
                    Sender
                  </h2>
                  <p className="mt-4 font-semibold text-navy-900">{result.shipment.sender_name}</p>
                  <p className="mt-1 text-sm text-gray-600">{result.shipment.sender_city}, {result.shipment.sender_country}</p>
                </div>
                <div className="border border-gray-100 bg-white p-5">
                  <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-navy-900">
                    <MapPin className="h-4 w-4 text-brand-500" />
                    Recipient
                  </h2>
                  <p className="mt-4 font-semibold text-navy-900">{result.shipment.recipient_name}</p>
                  <p className="mt-1 text-sm text-gray-600">{result.shipment.recipient_city}, {result.shipment.recipient_country}</p>
                </div>
              </div>

              <div className="border border-gray-100 bg-white p-6">
                <h2 className="font-display text-lg uppercase tracking-wide text-navy-900">Shipment timeline</h2>
                <div className="mt-6 space-y-5">
                  {result.events.length === 0 ? (
                    <p className="text-sm text-gray-500">No timeline events have been added yet.</p>
                  ) : (
                    result.events.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${index === 0 ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <Clock3 className="h-4 w-4" />
                        </div>
                        <div className="border-b border-gray-100 pb-5 last:border-b-0">
                          <p className="font-semibold text-navy-900">{event.status}</p>
                          {event.location && <p className="mt-1 text-sm text-gray-500">{event.location}</p>}
                          {event.description && <p className="mt-2 text-sm leading-6 text-gray-600">{event.description}</p>}
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{formatDateTime(event.event_time)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Testimonials />

      <Footer />
    </>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>}>
      <TrackingContent />
    </Suspense>
  )
}
