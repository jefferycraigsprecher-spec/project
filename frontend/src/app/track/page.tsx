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
import TrackingResult from '@/components/TrackingResult'
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

    // UX: show immediate loading state and clear previous data/messages
    setLoading(true)
    setError('')
    setResult(null)

    // Fetch with a small retry/backoff strategy to handle transient network issues
    const maxAttempts = 3
    let attempt = 0
    let lastError: any = null

    while (attempt < maxAttempts) {
      try {
        attempt += 1
        const res = await api.get(`/shipments/track/${code}`)
        setResult({ shipment: res.data.shipment, events: res.data.events || [] })

        // Auto-scroll to results after data is loaded (improves perceived speed)
        setTimeout(() => {
          const resultsElement = document.getElementById('tracking-results')
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)

        lastError = null
        break
      } catch (err: any) {
        lastError = err
        // If client error (4xx) don't retry
        const status = err?.response?.status
        if (status && status >= 400 && status < 500) break

        // small backoff before retrying
        await new Promise((r) => setTimeout(r, 300 * attempt))
      }
    }

    if (lastError) {
      // Prefer backend message when available, otherwise a friendly fallback
      const backendMsg = lastError?.response?.data?.message
      setError(backendMsg || 'Tracking details were not found. Please verify the code and try again.')
    }

    setLoading(false)
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

          <div id="tracking-results">
            {trackingId && <TrackingResult trackingNumber={trackingId} initialData={result || undefined} />}
          </div>
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
