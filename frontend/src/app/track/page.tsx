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
import { AlertCircle, CalendarDays, Clock3, MapPin, Package, Search, ShieldCheck, UserRound, Info } from 'lucide-react'
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

const parseTrackingInput = (raw = '') => {
  let value = String(raw || '').trim()
  if (!value) return ''

  if (/^(https?:)?\/\//i.test(value) || value.includes('://')) {
    try {
      const parsed = new URL(value)
      const idFromQuery = parsed.searchParams.get('id')
      if (idFromQuery) return idFromQuery.trim()

      const pathParts = parsed.pathname.split('/').filter(Boolean)
      if (pathParts.length > 0) {
        return pathParts[pathParts.length - 1].trim()
      }
    } catch (err) {
      // ignore invalid URLs and fall back to raw input
    }
  }

  const queryIdMatch = value.match(/[?&]id=([^&]+)/i)
  if (queryIdMatch) return queryIdMatch[1].trim()

  const trackingMatch = value.match(/(MSC-[A-Z0-9]+)|([0-9]{6,})/i)
  return trackingMatch ? trackingMatch[0].trim() : value
}

const normalizeTrackingCode = (raw = '') => {
  const candidate = parseTrackingInput(raw)
  if (!candidate) return ''

  const clean = String(candidate).trim().toUpperCase().replace(/\s+/g, '')
  if (!clean) return ''
  if (clean.startsWith('MSC-')) return clean
  return `MSC-${clean}`
}

function TrackingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trackingId, setTrackingId] = useState(() => normalizeTrackingCode(searchParams.get('id') || ''))
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

    setTrackingId(code)

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
    const normalizedId = normalizeTrackingCode(id || '')

    if (normalizedId) setTrackingId(normalizedId)

    if (normalizedId && autoLoadKey !== normalizedId) {
      setAutoLoadKey(normalizedId)
      handleTrack(normalizedId, false)
    }
  }, [searchParams, autoLoadKey])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg)]">
        <section className="py-14 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <p className="section-subtitle text-brand-300">Secure shipment lookup</p>
                <h1 className="font-display text-4xl uppercase tracking-wide md:text-5xl">Track your package</h1>
                <p className="max-w-2xl text-[var(--text-muted)] leading-8">
                  Enter your tracking code to load shipment status instantly. We fetch the latest package details from the backend and keep your shipment information clean, simple, and on-brand.
                </p>

                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
                  <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <input
                      value={trackingId}
                      onChange={(event) => setTrackingId(event.target.value)}
                      onKeyDown={(event) => event.key === 'Enter' && handleTrack()}
                      placeholder="Tracking code, number, or tracking link"
                      className="min-h-12 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 text-sm font-semibold text-[var(--text-primary)] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                    <button onClick={() => handleTrack()} disabled={loading} className="btn-primary justify-center rounded-3xl px-8">
                      <Search className="h-4 w-4" />
                      {loading ? 'Searching' : 'Track'}
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-[var(--text-muted)]">Only the tracking code is required. The MSC- prefix is added automatically.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-muted)]">Live updates</p>
                    <p className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">Real-time shipment visibility</p>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">See every milestone clearly and take action with confidence.</p>
                  </div>
                  <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-muted)]">Brand-aligned experience</p>
                    <p className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">Clean visuals and polished reports</p>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">A streamlined tracking page that matches the rest of your logistics brand.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-xl">
                  <img src="/images/service-right-1.jpg" alt="Logistics delivery" className="h-full w-full object-cover" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-muted)]">Global network</p>
                    <p className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">Worldwide shipping lanes</p>
                  </div>
                  <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-muted)]">Customer-first service</p>
                    <p className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">Fast response and premium care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HeroVideoSlider />

        <section className="mx-auto max-w-7xl px-4 py-10">
          {loading && <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>}

          {error && (
            <div className="rounded-[2rem] border border-red-600 bg-red-950 p-5 text-red-100">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">Tracking unavailable</p>
                  <p className="mt-1 text-sm text-red-100">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div id="tracking-results" className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">Tracking code</p>
                        <p className="mt-1 font-mono text-xl font-bold text-[var(--text-primary)]">{trackingCode}</p>
                      </div>
                    </div>
                    <StatusBadge status={result.shipment.status} />
                  </div>

                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute left-3 right-3 top-4 h-0.5 bg-white/10" />
                      <div
                        className="absolute left-3 top-4 h-0.5 bg-brand-500 transition-all"
                        style={{ width: `${(activeIndex / (statusFlow.length - 1)) * 100}%`, maxWidth: 'calc(100% - 1.5rem)' }}
                      />
                      <div className="relative grid grid-cols-4 gap-3 md:grid-cols-7">
                        {statusFlow.map((status, index) => {
                          const active = index <= activeIndex
                          return (
                            <div key={status} className="flex flex-col items-center gap-2">
                              <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-brand-500 text-white' : 'bg-white/10 text-[var(--text-muted)]'}`}>
                                {index + 1}
                              </div>
                              <span className={`text-center text-[0.65rem] font-bold uppercase tracking-[0.12em] ${active ? 'text-brand-400' : 'text-[var(--text-muted)]'}`}>
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
                  <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                    <CalendarDays className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">Current status</p>
                    <p className="mt-1 font-semibold text-[var(--text-primary)]">{STATUS_LABELS[shipment?.current_status || shipment?.currentStatus || shipment?.status] || 'Status pending'}</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                    <MapPin className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">Current location</p>
                    <p className="mt-1 font-semibold text-[var(--text-primary)]">{currentLocationValue}</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                    <Clock3 className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">Last updated</p>
                    <p className="mt-1 font-semibold text-[var(--text-primary)]">{shipment?.lastUpdated ? formatDateTime(shipment.lastUpdated) : formatDateTime(createdAtValue)}</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                    <ShieldCheck className="h-5 w-5 text-brand-500" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-muted)]">Service</p>
                    <p className="mt-1 font-semibold text-[var(--text-primary)]">{serviceTypeLabel}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-[var(--text-primary)]">
                    <UserRound className="h-4 w-4 text-brand-500" />
                    Sender
                  </h2>
                  <p className="mt-4 font-semibold text-[var(--text-primary)]">{senderName}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{senderAddress}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{senderCity}, {senderState} {senderZip}, {senderCountry}</p>
                  {shipment?.sender_phone && <p className="mt-2 text-sm text-[var(--text-muted)]">📞 {shipment.sender_phone || shipment.senderPhone}</p>}
                </div>
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-[var(--text-primary)]">
                    <MapPin className="h-4 w-4 text-brand-500" />
                    Recipient
                  </h2>
                  <p className="mt-4 font-semibold text-[var(--text-primary)]">{recipientName}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{recipientAddress}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{recipientCity}, {recipientState} {recipientZip}, {recipientCountry}</p>
                  {shipment?.recipient_phone && <p className="mt-2 text-sm text-[var(--text-muted)]">📞 {shipment.recipient_phone || shipment.recipientPhone}</p>}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <h2 className="font-display text-lg uppercase tracking-wide text-[var(--text-primary)]">Package details</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {(shipment.package_type || shipment.packageType) && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Package type</p>
                      <p className="mt-2 font-semibold text-[var(--text-primary)]">{shipment.package_type || shipment.packageType}</p>
                    </div>
                  )}
                  {shipment.description && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Contents</p>
                      <p className="mt-2 font-semibold text-[var(--text-primary)]">{shipment.description}</p>
                    </div>
                  )}
                  {shipment.weight && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Weight</p>
                      <p className="mt-2 font-semibold text-[var(--text-primary)]">{shipment.weight} {shipment.weight_unit || shipment.weightUnit}</p>
                    </div>
                  )}
                  {shipment.dimensions && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Dimensions</p>
                      <p className="mt-2 font-semibold text-[var(--text-primary)]">{shipment.dimensions}</p>
                    </div>
                  )}
                  {(shipment.declared_value || shipment.declaredValue) && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Declared value</p>
                      <p className="mt-2 font-semibold text-[var(--text-primary)]">${(shipment.declared_value || shipment.declaredValue).toFixed(2)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Priority</p>
                    <p className="mt-2 capitalize font-semibold text-[var(--text-primary)]">{shipment.priority}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <h2 className="font-display text-lg uppercase tracking-wide text-[var(--text-primary)]">Shipment events timeline</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {createdAtValue && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Created</p>
                      <p className="mt-2 font-semibold text-[var(--text-primary)]">{formatDateTime(createdAtValue)}</p>
                    </div>
                  )}
                  {shipDateValue && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Shipped date</p>
                      <p className="mt-2 font-semibold text-[var(--text-primary)]">{formatDate(shipDateValue)}</p>
                    </div>
                  )}
                  {estimatedDeliveryCardValue && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Estimated delivery</p>
                      <p className="mt-2 font-semibold text-[var(--text-primary)]">{formatDate(estimatedDeliveryCardValue)}</p>
                    </div>
                  )}
                  {actualDeliveryValue && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Delivered</p>
                      <p className="mt-2 font-semibold text-[var(--text-primary)]">{formatDate(actualDeliveryValue)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <div className="mt-6 space-y-5">
                  {timelineEvents.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)]">No timeline events have been added yet.</p>
                  ) : (
                    timelineEvents.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${index === 0 ? 'bg-brand-500 text-white' : 'bg-white/10 text-[var(--text-primary)]'}`}>
                          <Clock3 className="h-4 w-4" />
                        </div>
                        <div className="border-b border-[var(--border)] pb-5 last:border-b-0">
                          <p className="font-semibold text-[var(--text-primary)]">{event.status}</p>
                          {event.location && <p className="mt-1 text-sm text-[var(--text-muted)]">{event.location}</p>}
                          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                            {event.description || getTrackingDescription(event.status)}
                          </p>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{formatDateTime(event.event_time)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <h2 className="font-display text-lg uppercase tracking-wide text-[var(--text-primary)]">Shipment documents</h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">View your shipment receipt or invoice for charges, fees, and delivery details.</p>
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
                <div className="rounded-[2rem] border border-amber-600 bg-amber-950 p-6">
                  <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-amber-100">
                    <Info className="h-5 w-5 text-amber-300" />
                    Special notes
                  </h2>
                  <p className="mt-3 text-sm text-amber-200">{result.shipment.notes}</p>
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
