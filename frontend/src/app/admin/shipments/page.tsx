'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import type { Shipment } from '@/types'
import toast from 'react-hot-toast'

const statusOptions = ['all', 'processing', 'picked_up', 'in_transit', 'customs_clearance', 'arrived_at_facility', 'out_for_delivery', 'delivered', 'failed_delivery']

export default function AdminShipmentsPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [search, setSearch] = useState('')
  const [trackingLookup, setTrackingLookup] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm.trim())
      setPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setPage(1)
  }, [status])

  const fetchShipments = async () => {
    setLoading(true)
    try {
      const res = await api.get('/shipments', {
        params: {
          page,
          limit: 10,
          status: status === 'all' ? undefined : status,
          search,
        },
      })

      setShipments(res.data.shipments || [])
      setTotal(res.data.total || 0)
    } catch (error) {
      // If unauthenticated, the API interceptor will redirect to login.
      // Avoid showing a brief error toast in that case.
      // @ts-ignore
      if (error?.response?.status === 401) return
      toast.error('Unable to load shipments.')
    } finally {
      setLoading(false)
    }
  }

  const handleLookupTracking = async () => {
    const trackingId = trackingLookup.trim()
    if (!trackingId) {
      toast.error('Enter a tracking ID to open a shipment.')
      return
    }

    setLookupLoading(true)
    try {
      const result = await api.get(`/shipments/tracking/${encodeURIComponent(trackingId)}`)
      const shipmentId = result.data.shipment?.id
      if (!shipmentId) {
        toast.error('Shipment not found.')
        return
      }
      router.push(`/admin/shipments/${shipmentId}`)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Shipment not found.')
    } finally {
      setLookupLoading(false)
    }
  }

  useEffect(() => {
    fetchShipments()
  }, [page, status, search])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-subtitle">Shipment operations</p>
            <h1 className="section-title text-3xl">Shipment manager</h1>
            <p className="mt-2 text-sm text-gray-600">View, filter, and manage all active and archived shipments from one secure dashboard.</p>
          </div>
          <button onClick={() => router.push('/admin/shipments/new')} className="btn-primary">
            <Plus className="w-4 h-4" /> Add shipment
          </button>
        </div>

        <div className="card p-4">
          <div className="grid gap-3 xl:grid-cols-[1fr_1fr_220px]">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tracking ID, sender, or recipient"
                className="input-field pl-10"
              />
            </label>
            <label className="block">
              <span className="label">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All statuses' : option.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-3">
              <label className="block">
                <span className="label">Open by tracking ID</span>
                <div className="flex gap-2">
                  <input
                    value={trackingLookup}
                    onChange={(e) => setTrackingLookup(e.target.value)}
                    placeholder="Enter tracking code"
                    className="input-field flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleLookupTracking()}
                  />
                  <button
                    type="button"
                    onClick={handleLookupTracking}
                    disabled={lookupLoading}
                    className="btn-secondary whitespace-nowrap"
                  >
                    {lookupLoading ? 'Opening...' : 'Open'}
                  </button>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-[0.15em]">
                      <th className="py-3 px-4">Tracking</th>
                      <th className="py-3 px-4">Sender</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          No shipments match your current filters.
                        </td>
                      </tr>
                    ) : (
                      shipments.map((shipment) => (
                        <tr key={shipment.id} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 px-4 font-semibold text-navy-900">{shipment.tracking_id}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-navy-900">{shipment.sender_name}</div>
                            <div className="text-xs text-gray-500">{shipment.sender_city}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-navy-900">{shipment.recipient_name}</div>
                            <div className="text-xs text-gray-500">{shipment.recipient_city}</div>
                          </td>
                          <td className="py-3 px-4 capitalize">{shipment.service_type.replace('_', ' ')}</td>
                          <td className="py-3 px-4"><StatusBadge status={shipment.status} size="sm" /></td>
                          <td className="py-3 px-4 text-gray-600">{formatDateTime(shipment.created_at)}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => router.push(`/admin/shipments/${shipment.id}`)}
                              className="text-brand-600 font-semibold hover:text-brand-700"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {shipments.length} of {total} shipments
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-600 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-600 disabled:opacity-40"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
