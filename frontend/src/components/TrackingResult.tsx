'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

type TimelineItem = {
  time?: string
  status?: string
  location?: string
  done?: boolean
}

type ShipmentShape = {
  trackingNumber?: string
  status?: string
  progress?: number
  estimatedDelivery?: string
  currentLocation?: string
  packageInfo?: {
    weight?: string
    dimensions?: string
    service?: string
  }
  timeline?: TimelineItem[]
}

export default function TrackingResult({ trackingNumber, initialData }: { trackingNumber: string; initialData?: { shipment?: any; events?: any[] } }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shipment, setShipment] = useState<ShipmentShape | null>(null)

  useEffect(() => {
    if (!trackingNumber) return

    let mounted = true
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      // If initial data is provided from the parent, use it and skip network fetch
      if (initialData?.shipment) {
        const data = initialData.shipment
        const normalized: ShipmentShape = {
          trackingNumber: data?.trackingNumber || data?.tracking_id || trackingNumber,
          status: (data?.status || data?.current_status || 'Pending') as string,
          progress: Math.min(100, Math.max(0, Number(data?.progress) || 0)),
          estimatedDelivery: data?.estimated_delivery || data?.estimatedDelivery || data?.estimatedDeliveryDate || '',
          currentLocation: data?.current_location || data?.currentLocation || data?.location || '',
          packageInfo: {
            weight: data?.weight ? `${data.weight} ${data.weight_unit || ''}`.trim() : data?.weight || data?.weight_unit || '',
            dimensions: data?.dimensions || data?.size || '',
            service: data?.service_type || data?.serviceType || '',
          },
          timeline: (initialData.events || []).map((e: any) => ({
            time: e.event_time || e.time || '',
            status: e.status || e.name || '',
            location: e.location || e.city || '',
            done: !!e.completed || !!e.done || false,
          })),
        }

        if (mounted) setShipment(normalized)
        if (mounted) setIsLoading(false)
        return
      }
      try {
        const res = await api.get(`/shipments/track/${trackingNumber}`)
        const data = res.data?.shipment || null
        if (!mounted) return

        // Normalize to the shape used by this component
        const normalized: ShipmentShape = {
          trackingNumber: data?.trackingNumber || data?.tracking_id || trackingNumber,
          status: (data?.status || data?.current_status || 'Pending') as string,
          progress: Math.min(100, Math.max(0, Number(data?.progress) || 0)),
          estimatedDelivery: data?.estimated_delivery || data?.estimatedDelivery || data?.estimatedDeliveryDate || '',
          currentLocation: data?.current_location || data?.currentLocation || data?.location || '',
          packageInfo: {
            weight: data?.weight ? `${data.weight} ${data.weight_unit || ''}`.trim() : data?.weight || data?.weight_unit || '',
            dimensions: data?.dimensions || data?.size || '',
            service: data?.service_type || data?.serviceType || '',
          },
          timeline: (res.data?.events || []).map((e: any) => ({
            time: e.event_time || e.time || '',
            status: e.status || e.name || '',
            location: e.location || e.city || '',
            done: !!e.completed || !!e.done || false,
          })),
        }

        setShipment(normalized)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load tracking details')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [trackingNumber, initialData])

  if (!trackingNumber) return null

  if (isLoading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>

  if (error) return (
    <div className="rounded-[2rem] border border-red-600 bg-red-950 p-5 text-red-100">{error}</div>
  )

  const s = shipment || {
    trackingNumber,
    status: 'Pending',
    progress: 0,
    estimatedDelivery: '',
    currentLocation: '',
    packageInfo: {},
    timeline: [],
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-emerald-400 text-sm font-medium">TRACKING NUMBER</p>
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{s.trackingNumber}</h2>
        </div>
        <div className="text-right">
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${s.status === 'delivered' || s.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
            {s.status}
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="h-3 bg-[var(--surface-strong)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
            style={{ width: `${s.progress || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
          <span>Origin</span>
          <span>Destination</span>
        </div>
      </div>

      <div className="bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl p-6 mb-8">
        <p className="text-[var(--text-muted)] text-sm">Estimated Delivery</p>
        <p className="text-4xl font-semibold text-[var(--text-primary)] mt-1">{s.estimatedDelivery || '—'}</p>
        <p className="text-emerald-400 mt-2">📍 {s.currentLocation || 'Location pending'}</p>
      </div>

      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Shipment Progress</h3>
        <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
          {(s.timeline || []).map((item, index) => (
            <div key={index} className="flex gap-6 relative">
              <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center border-2 ${item.done ? 'border-emerald-500 bg-emerald-900' : 'border-[var(--border)] bg-[var(--surface)]'}`}>
                {item.done ? '✓' : '○'}
              </div>
              <div className="flex-1 pt-2">
                <div className="flex justify-between">
                  <p className={`font-medium ${item.done ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                    {item.status}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">{item.time}</p>
                </div>
                <p className="text-[var(--text-muted)] text-sm">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl p-6 mb-8">
        <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Package Information</h3>
        <div className="grid grid-cols-2 gap-6 text-sm text-[var(--text-primary)]">
          <div>
            <p className="text-[var(--text-muted)]">Weight</p>
            <p className="font-medium">{s.packageInfo?.weight || '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)]">Dimensions</p>
            <p className="font-medium">{s.packageInfo?.dimensions || '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)]">Service Type</p>
            <p className="font-medium">{s.packageInfo?.service || '—'}</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl p-6 mb-8 h-80 flex items-center justify-center text-[var(--text-muted)]">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p>Interactive Map (Integrate Leaflet or Google Maps here)</p>
          <p className="text-sm">Current location: {s.currentLocation || '—'}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-[var(--text-primary)] text-[var(--bg)] font-semibold py-4 rounded-2xl hover:opacity-90 transition">Download Receipt</button>
        <button className="flex-1 border border-[var(--border)] font-semibold py-4 rounded-2xl hover:bg-[var(--surface)] transition">Contact Support</button>
      </div>
    </div>
  )
}
