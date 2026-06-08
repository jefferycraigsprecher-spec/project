'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroVideoSlider from '@/components/sections/HeroVideoSlider'
import Testimonials from '@/components/sections/Testimonials'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import api from '@/lib/api'
import { STATUS_LABELS, SERVICE_LABELS, formatDate, formatDateTime, getTrackingDescription } from '@/lib/utils'
import { AlertCircle, CalendarDays, Clock3, MapPin, Package, Search, ShieldCheck, UserRound, Zap, DollarSign, Layers, Info } from 'lucide-react'
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

const normalizeTrackingCode = (raw = '') => {
  const value = String(raw || '').trim().toUpperCase().replace(/\s+/g, '')
  if (!value) return ''
  if (value.startsWith('MSC-')) return value
  return `MSC-${value}`
}

function TrackingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ shipment: Shipment; events: TrackingEvent[] } | null>(null)
  const [autoLoadKey, setAutoLoadKey] = useState('')

  const activeIndex = useMemo(() => {
    if (!result?.shipment?.status) return 0
    if (result.shipment.status === 'failed_delivery') return statusFlow.indexOf('out_for_delivery')
    return Math.max(0, statusFlow.indexOf(result.shipment.status))
  }, [result])

  const timelineEvents = useMemo(() => {
    if (!result) return []

    const shipment = result.shipment as any
    const currentLocation = shipment.current_location || shipment.currentLocation || ''
    const currentStatus = shipment.current_status || shipment.currentStatus || shipment.status || ''
    const lastUpdated = shipment.last_updated || shipment.lastUpdated || shipment.updated_at || shipment.updatedAt || shipment.created_at || shipment.createdAt || ''

    const updateEvent = currentLocation || currentStatus ? {
      id: 'shipment_update',
      status: 'Shipment status',
      location: currentLocation,
      description: currentStatus
        ? currentLocation
          ? `Current location: ${currentLocation}. Status: ${STATUS_LABELS[currentStatus] || currentStatus}.`
          : `Shipment status: ${STATUS_LABELS[currentStatus] || currentStatus}.`
        : currentLocation
          ? `Current location: ${currentLocation}.`
          : 'Latest shipment update from the shipment form.',
      event_time: lastUpdated,
    } : null

    const events = result.events || []
    const hasSameTopEvent = updateEvent && events.length > 0 && ((currentLocation && events[0].location === currentLocation) || (currentStatus && events[0].status === currentStatus))

    return updateEvent && !hasSameTopEvent ? [updateEvent, ...events] : events
  }, [result])

  const shipment = result?.shipment as any
  const trackingCode = shipment?.trackingNumber || shipment?.tracking_id || ''
  const estimatedDeliveryValue = shipment?.estimatedDelivery || shipment?.estimated_delivery || null
  const currentLocationValue = shipment?.currentLocation || shipment?.current_location || 'Location pending'
  const serviceTypeValue = shipment?.serviceType || shipment?.service_type
  const senderName = shipment?.senderName || shipment?.sender_name
  const senderAddress = shipment?.senderAddress || shipment?.sender_address
  const senderCity = shipment?.senderCity || shipment?.sender_city
  const senderState = shipment?.senderState || shipment?.sender_state
  const senderZip = shipment?.senderZip || shipment?.sender_zip
  const senderCountry = shipment?.senderCountry || shipment?.sender_country
  const recipientName = shipment?.recipientName || shipment?.recipient_name
  const recipientAddress = shipment?.recipientAddress || shipment?.recipient_address
  const recipientCity = shipment?.recipientCity || shipment?.recipient_city
  const recipientState = shipment?.recipientState || shipment?.recipient_state
  const recipientZip = shipment?.recipientZip || shipment?.recipient_zip
  const recipientCountry = shipment?.recipientCountry || shipment?.recipient_country
  const shipDateValue = shipment?.shipDate || shipment?.ship_date
  const actualDeliveryValue = shipment?.actualDelivery || shipment?.actual_delivery
  const createdAtValue = shipment?.createdAt || shipment?.created_at
  const estimatedDeliveryCardValue = shipment?.estimatedDelivery || shipment?.estimated_delivery
  const serviceTypeLabel = SERVICE_LABELS[serviceTypeValue] || ''

  const handleTrack = async (id = trackingId, updateUrl = true) => {
    const code = normalizeTrackingCode(id)

    if (!code || code === 'MSC-') {
      setError('Enter your tracking code.')
      return
    }

    if (updateUrl) {
      const query = new URLSearchParams()
      query.set('id', code)
      router.replace(`/track?${query.toString()}`)
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await api.get(`/shipments/track/${code}`)
      setResult({ shipment: res.data.shipment, events: res.data.events || [] })
      
      // Auto-scroll to results after data is loaded
      setTimeout(() => {
        const resultsElement = document.getElementById('tracking-results')
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Tracking details were not found.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = searchParams.get('id')
    const key = `${id || ''}`

    if (id) setTrackingId(id.toUpperCase())

    if (id && autoLoadKey !== key) {
      setAutoLoadKey(key)
      handleTrack(id, false)
    }
  }, [searchParams, autoLoadKey])

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
                Enter your tracking code to load shipment status instantly. Recipient email or phone is optional and can provide extra confirmation when available.
              </p>
            </div>

            <div className="mt-8 grid gap-3 bg-white p-3 shadow-[0_24px_70px_-45px_rgba(0,0,0,0.75)] md:grid-cols-[1fr_auto]">
              <input
                value={trackingId}
                onChange={(event) => setTrackingId(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleTrack()}
                placeholder="Tracking code or number"
                className="min-h-12 border border-slate-200 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-brand-500"
              />
              <button onClick={() => handleTrack()} disabled={loading} className="btn-primary justify-center px-8">
                <Search className="h-4 w-4" />
                {loading ? 'Searching' : 'Track'}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">Only the tracking code is required. The MSC- prefix is added automatically.</p>
          </div>
        </section>

        <HeroVideoSlider />

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
            <div id="tracking-results" className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-50 p-3 text-brand-600">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Tracking code</p>
                        <p className="mt-1 font-mono text-xl font-bold text-navy-900">{trackingCode}</p>
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

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="border border-gray-100 bg-white p-5">
                    <CalendarDays className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Current status</p>
                    <p className="mt-1 font-semibold text-navy-900">{STATUS_LABELS[shipment?.current_status || shipment?.currentStatus || shipment?.status] || 'Status pending'}</p>
                  </div>
                  <div className="border border-gray-100 bg-white p-5">
                    <MapPin className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Current location</p>
                    <p className="mt-1 font-semibold text-navy-900">{currentLocationValue}</p>
                  </div>
                  <div className="border border-gray-100 bg-white p-5">
                    <Clock3 className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Last updated</p>
                    <p className="mt-1 font-semibold text-navy-900">{shipment?.lastUpdated ? formatDateTime(shipment.lastUpdated) : formatDateTime(createdAtValue)}</p>
                  </div>
                  <div className="border border-gray-100 bg-white p-5">
                    <ShieldCheck className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">Service</p>
                    <p className="mt-1 font-semibold text-navy-900">{serviceTypeLabel}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-gray-100 bg-white p-5">
                  <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-navy-900">
                    <UserRound className="h-4 w-4 text-brand-500" />
                    Sender
                  </h2>
                  <p className="mt-4 font-semibold text-navy-900">{senderName}</p>
                  <p className="mt-1 text-sm text-gray-600">{senderAddress}</p>
                  <p className="mt-1 text-sm text-gray-600">{senderCity}, {senderState} {senderZip}, {senderCountry}</p>
                  {shipment?.sender_phone && <p className="mt-2 text-sm text-gray-500">📞 {shipment.sender_phone || shipment.senderPhone}</p>}
                  {shipment?.sender_email && <p className="mt-1 text-sm text-gray-500">✉ {shipment.sender_email || shipment.senderEmail}</p>}
                </div>
                <div className="border border-gray-100 bg-white p-5">
                  <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-navy-900">
                    <MapPin className="h-4 w-4 text-brand-500" />
                    Recipient
                  </h2>
                  <p className="mt-4 font-semibold text-navy-900">{recipientName}</p>
                  <p className="mt-1 text-sm text-gray-600">{recipientAddress}</p>
                  <p className="mt-1 text-sm text-gray-600">{recipientCity}, {recipientState} {recipientZip}, {recipientCountry}</p>
                  {shipment?.recipient_phone && <p className="mt-2 text-sm text-gray-500">📞 {shipment.recipient_phone || shipment.recipientPhone}</p>}
                  {shipment?.recipient_email && <p className="mt-1 text-sm text-gray-500">✉ {shipment.recipient_email || shipment.recipientEmail}</p>}
                </div>
              </div>

              <div className="border border-gray-100 bg-white p-6">
                <h2 className="font-display text-lg uppercase tracking-wide text-navy-900">Package details</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {(shipment.package_type || shipment.packageType) && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Package type</p>
                      <p className="mt-2 font-semibold text-navy-900">{shipment.package_type || shipment.packageType}</p>
                    </div>
                  )}
                  {shipment.description && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Contents</p>
                      <p className="mt-2 font-semibold text-navy-900">{shipment.description}</p>
                    </div>
                  )}
                  {shipment.weight && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Weight</p>
                      <p className="mt-2 font-semibold text-navy-900">{shipment.weight} {shipment.weight_unit || shipment.weightUnit}</p>
                    </div>
                  )}
                  {shipment.dimensions && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Dimensions</p>
                      <p className="mt-2 font-semibold text-navy-900">{shipment.dimensions}</p>
                    </div>
                  )}
                  {(shipment.declared_value || shipment.declaredValue) && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Declared value</p>
                      <p className="mt-2 font-semibold text-navy-900">${(shipment.declared_value || shipment.declaredValue).toFixed(2)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Priority</p>
                    <p className="mt-2 capitalize font-semibold text-navy-900">{shipment.priority}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 bg-white p-6">
                <h2 className="font-display text-lg uppercase tracking-wide text-navy-900">Shipment events timeline</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {createdAtValue && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Created</p>
                      <p className="mt-2 font-semibold text-navy-900">{formatDateTime(createdAtValue)}</p>
                    </div>
                  )}
                  {shipDateValue && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Shipped date</p>
                      <p className="mt-2 font-semibold text-navy-900">{formatDate(shipDateValue)}</p>
                    </div>
                  )}
                  {estimatedDeliveryCardValue && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Estimated delivery</p>
                      <p className="mt-2 font-semibold text-navy-900">{formatDate(estimatedDeliveryCardValue)}</p>
                    </div>
                  )}
                  {actualDeliveryValue && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Delivered</p>
                      <p className="mt-2 font-semibold text-navy-900">{formatDate(actualDeliveryValue)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-100 bg-white p-6">
                <div className="mt-6 space-y-5">
                  {timelineEvents.length === 0 ? (
                    <p className="text-sm text-gray-500">No timeline events have been added yet.</p>
                  ) : (
                    timelineEvents.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${index === 0 ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <Clock3 className="h-4 w-4" />
                        </div>
                        <div className="border-b border-gray-100 pb-5 last:border-b-0">
                          <p className="font-semibold text-navy-900">{event.status}</p>
                          {event.location && <p className="mt-1 text-sm text-gray-500">{event.location}</p>}
                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {event.description || getTrackingDescription(event.status)}
                          </p>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{formatDateTime(event.event_time)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border border-gray-100 bg-white p-6">
                <h2 className="font-display text-lg uppercase tracking-wide text-navy-900">Shipment documents</h2>
                <p className="mt-2 text-sm text-gray-600">View your shipment receipt or invoice for charges, fees, and delivery details.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={`/receipt?id=${trackingCode}`} className="btn-primary inline-flex items-center justify-center">
                    View receipt
                  </Link>
                  <Link href={`/invoice?id=${trackingCode}`} className="btn-secondary inline-flex items-center justify-center">
                    View invoice
                  </Link>
                </div>
              </div>

              {result.shipment.notes && (
                <div className="border border-amber-200 bg-amber-50 p-6">
                  <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-amber-900">
                    <Info className="h-5 w-5" />
                    Special notes
                  </h2>
                  <p className="mt-3 text-sm text-amber-800">{result.shipment.notes}</p>
                </div>
              )}
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
