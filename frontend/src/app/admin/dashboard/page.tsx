'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BarChart3, CheckCircle2, Clock3, Plus, ShieldCheck, Truck, AlertTriangle, RefreshCw } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import type { DashboardStats, Shipment } from '@/types'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recent, setRecent] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      try {
        const res = await api.get('/shipments/stats/dashboard')
        if (!active) return

        setStats(res.data.stats)
        setRecent(res.data.recent || [])
      } catch (error) {
        toast.error('Unable to load dashboard data.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()
    return () => {
      active = false
    }
  }, [])

  const deliveryRate = useMemo(() => {
    if (!stats || stats.total === 0) return 0
    return Math.round((stats.delivered / stats.total) * 100)
  }, [stats])

  const atRisk = stats ? stats.failed_delivery + stats.customs_clearance : 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-subtitle">Operations Command Center</p>
            <h1 className="section-title text-3xl md:text-4xl">Admin dashboard</h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Monitor shipment performance, review support activity, and keep your logistics workflow moving with one secure view.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/shipments" className="btn-secondary">
              View shipments <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="card p-8 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total shipments</p>
                    <p className="mt-3 text-3xl font-bold text-navy-900">{stats?.total ?? 0}</p>
                  </div>
                  <div className="rounded-full bg-brand-50 p-3 text-brand-500">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Today</p>
                    <p className="mt-3 text-3xl font-bold text-navy-900">{stats?.today ?? 0}</p>
                  </div>
                  <div className="rounded-full bg-blue-50 p-3 text-blue-500">
                    <Clock3 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">In transit</p>
                    <p className="mt-3 text-3xl font-bold text-navy-900">{stats?.in_transit ?? 0}</p>
                  </div>
                  <div className="rounded-full bg-purple-50 p-3 text-purple-500">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Delivered</p>
                    <p className="mt-3 text-3xl font-bold text-navy-900">{stats?.delivered ?? 0}</p>
                  </div>
                  <div className="rounded-full bg-green-50 p-3 text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="section-subtitle">Live performance</p>
                    <h2 className="text-2xl font-bold text-navy-900">Shipment health snapshot</h2>
                  </div>
                  <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">
                    {deliveryRate}% delivery rate
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-none border border-gray-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Processing</p>
                    <p className="mt-2 text-2xl font-bold text-navy-900">{stats?.processing ?? 0}</p>
                  </div>
                  <div className="rounded-none border border-gray-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Customs</p>
                    <p className="mt-2 text-2xl font-bold text-navy-900">{stats?.customs_clearance ?? 0}</p>
                  </div>
                  <div className="rounded-none border border-gray-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">At risk</p>
                    <p className="mt-2 text-2xl font-bold text-navy-900">{atRisk}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-none bg-navy-900 p-4 text-white">
                  <div className="flex items-center gap-2 text-sm text-brand-200">
                    <ShieldCheck className="w-4 h-4" />
                    Secure admin session is active and synced.
                  </div>
                  <p className="mt-3 text-sm text-gray-200">
                    All admin activity routes are protected by JWT authentication, and sensitive shipment updates are scoped to your signed-in role.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="card p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-brand-50 p-3 text-brand-500">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Quick actions</p>
                      <h2 className="text-xl font-bold text-navy-900">Recent workflow</h2>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Link href="/admin/shipments" className="flex items-center justify-between rounded-none border border-gray-200 p-3 text-sm font-semibold text-navy-900 hover:border-brand-500">
                      <span>Review shipment queue</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/admin/messages" className="flex items-center justify-between rounded-none border border-gray-200 p-3 text-sm font-semibold text-navy-900 hover:border-brand-500">
                      <span>Open support center</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h2 className="text-lg font-bold text-navy-900">Priority alert</h2>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Keep an eye on shipments in <strong>customs clearance</strong> or <strong>failed delivery</strong> states to prevent service delays.
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="section-subtitle">Latest shipments</p>
                  <h2 className="text-2xl font-bold text-navy-900">Most recent activity</h2>
                </div>
                <Link href="/admin/shipments" className="btn-outline">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-[0.15em]">
                      <th className="py-3 pr-4">Tracking</th>
                      <th className="py-3 pr-4">Recipient</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 pr-4">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-gray-500">No recent shipments available.</td>
                      </tr>
                    ) : (
                      recent.map((shipment) => (
                        <tr key={shipment.id} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 pr-4 font-semibold text-navy-900">{shipment.tracking_id}</td>
                          <td className="py-3 pr-4">
                            <div className="font-semibold text-navy-900">{shipment.recipient_name}</div>
                            <div className="text-xs text-gray-500">{shipment.recipient_city}</div>
                          </td>
                          <td className="py-3 pr-4"><StatusBadge status={shipment.status} size="sm" /></td>
                          <td className="py-3 pr-4 text-gray-600">{formatDateTime(shipment.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
