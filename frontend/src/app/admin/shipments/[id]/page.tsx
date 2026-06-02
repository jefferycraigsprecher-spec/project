'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusOptions = ['pending', 'shipment_created', 'processing', 'picked_up', 'in_transit', 'at_sorting_facility', 'customs_clearance', 'out_for_delivery', 'delivered', 'failed_delivery', 'on_hold', 'returned']
const priorityOptions = ['low', 'normal', 'high', 'urgent']
const serviceOptions = ['standard', 'express', 'overnight', 'freight']

const currencyIcons: Record<string, string> = {
  USD: 'USD $',
  EUR: 'EUR €',
  GBP: 'GBP £',
  NGN: 'NGN ₦',
}

const getCurrencyIcon = (currency: string) => currencyIcons[currency] || `${currency} ¤`

export default function ShipmentDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [shipment, setShipment] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [media, setMedia] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [eventForm, setEventForm] = useState({ status: 'in_transit', location: '', remarks: '', admin_notes: '', event_date: '', event_time: '', event_ampm: 'AM' })
  const [form, setForm] = useState<Record<string, any>>({})

  const apiBase = useMemo(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    return apiUrl.replace('/api', '')
  }, [])

  const loadShipment = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/shipments/${params.id}`)
      const data = res.data
      setShipment(data.shipment)
      setEvents(data.events || [])
      setMedia(data.media || [])
      setLogs(data.logs || [])
      const parsedParcelItems = data.shipment.parcel_items
        ? typeof data.shipment.parcel_items === 'string'
          ? JSON.parse(data.shipment.parcel_items)
          : data.shipment.parcel_items
        : []

      setForm({
        order_id: data.shipment.order_id || '',
        tracking_number: data.shipment.tracking_id || '',
        sender_name: data.shipment.sender_name || '',
        sender_email: data.shipment.sender_email || '',
        sender_phone: data.shipment.sender_phone || '',
        sender_address: data.shipment.sender_address || '',
        sender_city: data.shipment.sender_city || '',
        sender_state: data.shipment.sender_state || '',
        sender_country: data.shipment.sender_country || 'USA',
        sender_zip: data.shipment.sender_zip || '',
        recipient_name: data.shipment.recipient_name || '',
        recipient_email: data.shipment.recipient_email || '',
        recipient_phone: data.shipment.recipient_phone || '',
        recipient_address: data.shipment.recipient_address || '',
        recipient_city: data.shipment.recipient_city || '',
        recipient_state: data.shipment.recipient_state || '',
        recipient_country: data.shipment.recipient_country || 'USA',
        recipient_zip: data.shipment.recipient_zip || '',
        shipment_cost: data.shipment.shipment_cost ?? '',
        clearance_cost: data.shipment.clearance_cost ?? '',
        total_amount: data.shipment.total_amount ?? '',
        payment_status: data.shipment.payment_status || 'pending',
        currency: data.shipment.currency || 'USD',
        parcel_quantity: data.shipment.parcel_quantity ?? '',
        parcel_product: data.shipment.parcel_product || '',
        parcel_status: data.shipment.parcel_status || '',
        parcel_description: data.shipment.parcel_description || '',
        
        parcel_items: parsedParcelItems,
        description: data.shipment.description || '',
        weight: data.shipment.weight ?? '',
        weight_unit: data.shipment.weight_unit || 'lbs',
        dimensions: data.shipment.dimensions || '',
        package_type: data.shipment.package_type || '',
        declared_value: data.shipment.declared_value ?? '',
        service_type: data.shipment.service_type || 'standard',
        status: data.shipment.status || 'processing',
        priority: data.shipment.priority || 'normal',
        ship_date: data.shipment.ship_date ? data.shipment.ship_date.split('T')[0] : '',
        estimated_delivery: data.shipment.estimated_delivery ? data.shipment.estimated_delivery.split('T')[0] : '',
        current_location: data.shipment.current_location || '',
        notes: data.shipment.notes || '',
        admin_notes: data.shipment.admin_notes || '',
      })
    } catch (error) {
      toast.error('Unable to load shipment details.')
      router.push('/admin/shipments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShipment()
  }, [params.id])

  const handleFormChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateParcelItem = (index: number, field: string, value: string) => {
    setForm((current) => {
      const items = Array.isArray(current.parcel_items) ? [...current.parcel_items] : []
      const existing = items[index] || {}
      items[index] = { ...existing, [field]: value }
      return { ...current, parcel_items: items }
    })
  }

  const addParcelItem = () => {
    setForm((current) => ({
      ...current,
      parcel_items: [
        ...(Array.isArray(current.parcel_items) ? current.parcel_items : []),
        {
          qty: 1,
          product: '',
          description: '',
          weight: '',
          declared_value: '',
          currency: current.currency || 'USD',
        },
      ],
    }))
  }

  const removeParcelItem = (index: number) => {
    setForm((current) => {
      const items = Array.isArray(current.parcel_items) ? [...current.parcel_items] : []
      items.splice(index, 1)
      return { ...current, parcel_items: items }
    })
  }

  const parcelQuantityTotal = Array.isArray(form.parcel_items)
    ? form.parcel_items.reduce((sum: number, item: any) => sum + (Number(item.qty) || 0), 0)
    : 0

  const parcelWeightTotal = Array.isArray(form.parcel_items)
    ? form.parcel_items.reduce((sum: number, item: any) => sum + (Number(item.weight) || 0), 0)
    : 0

  const totalDeclaredValue = Array.isArray(form.parcel_items)
    ? form.parcel_items.reduce((sum: number, item: any) => sum + (Number(item.declared_value) || 0), 0)
    : 0

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    try {
      await api.put(`/shipments/${params.id}`, {
        ...form,
        weight: form.weight ? Number(form.weight) : null,
        declared_value: form.declared_value ? Number(form.declared_value) : null,
        shipment_cost: form.shipment_cost ? Number(form.shipment_cost) : null,
        clearance_cost: form.clearance_cost ? Number(form.clearance_cost) : null,
        total_amount: form.total_amount ? Number(form.total_amount) : null,
        parcel_quantity: form.parcel_quantity ? Number(form.parcel_quantity) : null,
        parcel_items: form.parcel_items || null,
      })
      toast.success('Shipment updated successfully.')
      await loadShipment()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update shipment.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      // Convert 12-hour format with AM/PM to 24-hour format
      let [hours, minutes] = eventForm.event_time.split(':').map(Number)
      if (eventForm.event_ampm === 'PM' && hours !== 12) {
        hours += 12
      } else if (eventForm.event_ampm === 'AM' && hours === 12) {
        hours = 0
      }
      const timeIn24Hour = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      const combinedDateTime = `${eventForm.event_date}T${timeIn24Hour}:00`

      await api.post(`/shipments/${params.id}/events`, {
        status: eventForm.status,
        location: eventForm.location || null,
        remarks: eventForm.remarks || null,
        admin_notes: eventForm.admin_notes || null,
        event_time: combinedDateTime || null,
      })
      toast.success('Tracking event added.')
      setEventForm((current) => ({ ...current, admin_notes: '', event_date: '', event_time: '', event_ampm: 'AM' }))
      await loadShipment()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to add event.')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Select a file before uploading.')
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', selectedFile)
      if (caption) fd.append('caption', caption)
      await api.post(`/shipments/${params.id}/media`, fd)
      toast.success('Media uploaded.')
      setSelectedFile(null)
      setCaption('')
      await loadShipment()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to upload media.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMedia = async (mediaId: number) => {
    try {
      await api.delete(`/shipments/${params.id}/media/${mediaId}`)
      toast.success('Media deleted.')
      await loadShipment()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to delete media.')
    }
  }

  const locationOptions = [
    `Pickup - ${form.sender_address || form.sender_city || 'Origin location'}`,
    'Transit - Origin sorting facility',
    'Transit - In transit to destination',
    'Transit - Local delivery hub',
    `Out for delivery - ${form.recipient_city || 'Recipient city'}`,
    `Recipient address - ${form.recipient_address || form.recipient_city || 'Destination'}`,
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {loading ? (
          <div className="card p-8 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : shipment ? (
          <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-subtitle">Shipment detail</p>
                <h1 className="section-title text-3xl">{shipment.tracking_id}</h1>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                  <StatusBadge status={shipment.status} size="sm" />
                  <span>Created {formatDateTime(shipment.created_at)}</span>
                </div>
              </div>
              <button onClick={() => router.push('/admin/shipments')} className="btn-outline">
                Back to shipments
              </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="card p-5">
                <form onSubmit={handleSave} className="space-y-6">
                  <section>
                    <h2 className="text-lg font-bold text-navy-900">Shipment Information</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="label">Tracking number</span>
                        <input readOnly value={form.tracking_number || ''} className="input-field bg-slate-100" />
                      </label>
                      <label className="block">
                        <span className="label">Order ID</span>
                        <input readOnly value={form.order_id || ''} className="input-field bg-slate-100" />
                      </label>
                      <label className="block">
                        <span className="label">Service type</span>
                        <select value={form.service_type} onChange={(e) => handleFormChange('service_type', e.target.value)} className="input-field">
                          {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                      <label className="block">
                        <span className="label">Priority</span>
                        <select value={form.priority} onChange={(e) => handleFormChange('priority', e.target.value)} className="input-field">
                          {priorityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                      <label className="block">
                        <span className="label">Status</span>
                        <select value={form.status} onChange={(e) => handleFormChange('status', e.target.value)} className="input-field">
                          {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </label>
                      <label className="block">
                        <span className="label">Current location</span>
                        <input value={form.current_location || ''} onChange={(e) => handleFormChange('current_location', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Ship date</span>
                        <input type="date" value={form.ship_date || ''} onChange={(e) => handleFormChange('ship_date', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Estimated delivery</span>
                        <input type="date" value={form.estimated_delivery || ''} onChange={(e) => handleFormChange('estimated_delivery', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Weight</span>
                        <input type="number" value={form.weight ?? ''} onChange={(e) => handleFormChange('weight', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Weight unit</span>
                        <select value={form.weight_unit || 'lbs'} onChange={(e) => handleFormChange('weight_unit', e.target.value)} className="input-field">
                          <option value="lbs">lbs</option>
                          <option value="kg">kg</option>
                        </select>
                      </label>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold text-navy-900">Shipping Charges</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="label">Payment status</span>
                        <select value={form.payment_status || 'pending'} onChange={(e) => handleFormChange('payment_status', e.target.value)} className="input-field">
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="partially_paid">Partially paid</option>
                          <option value="refunded">Refunded</option>
                          <option value="to_pay">To pay</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="label">Currency</span>
                        <select value={form.currency || 'USD'} onChange={(e) => handleFormChange('currency', e.target.value)} className="input-field">
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="NGN">NGN</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="label">Shipment cost</span>
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-600">{getCurrencyIcon(form.currency || 'USD')}</span>
                          <input type="number" step="0.01" value={form.shipment_cost ?? ''} onChange={(e) => handleFormChange('shipment_cost', e.target.value)} className="input-field pl-10" />
                        </div>
                      </label>
                      <label className="block">
                        <span className="label">Clearance cost</span>
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-600">{getCurrencyIcon(form.currency || 'USD')}</span>
                          <input type="number" step="0.01" value={form.clearance_cost ?? ''} onChange={(e) => handleFormChange('clearance_cost', e.target.value)} className="input-field pl-10" />
                        </div>
                      </label>
                      <label className="block">
                        <span className="label">Total amount</span>
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-600">{getCurrencyIcon(form.currency || 'USD')}</span>
                          <input type="number" step="0.01" value={form.total_amount ?? ''} onChange={(e) => handleFormChange('total_amount', e.target.value)} className="input-field pl-10" />
                        </div>
                      </label>
                      <label className="block">
                        <span className="label">Parcel quantity</span>
                        <input type="number" min="1" value={form.parcel_quantity ?? ''} onChange={(e) => handleFormChange('parcel_quantity', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Parcel product</span>
                        <input value={form.parcel_product || ''} onChange={(e) => handleFormChange('parcel_product', e.target.value)} className="input-field" />
                      </label>
                    </div>
                    <div className="mt-6 rounded-3xl border border-slate-300 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold text-navy-900">Parcel Details</h3>
                          <p className="text-sm text-slate-600">Edit parcel product, description, quantity, weight, and declared value.</p>
                        </div>
                        <button type="button" onClick={addParcelItem} className="btn-outline">
                          Add parcel item
                        </button>
                      </div>
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm">
                          <thead>
                            <tr>
                              <th className="border p-3 text-left">Product</th>
                              <th className="border p-3 text-left">Description</th>
                              <th className="border p-3 text-left">Qty</th>
                              <th className="border p-3 text-left">Weight</th>
                              <th className="border p-3 text-left">Declared value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(form.parcel_items) && form.parcel_items.length > 0 ? (
                              form.parcel_items.map((item: any, index: number) => (
                                <tr key={index} className="even:bg-slate-100">
                                  <td className="border p-2">
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        className="input-field"
                                        value={item.product ?? ''}
                                        onChange={(e) => updateParcelItem(index, 'product', e.target.value)}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeParcelItem(index)}
                                        className="text-xs font-semibold text-red-600"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </td>
                                  <td className="border p-2">
                                    <input
                                      type="text"
                                      className="input-field"
                                      value={item.description ?? ''}
                                      onChange={(e) => updateParcelItem(index, 'description', e.target.value)}
                                    />
                                  </td>
                                  <td className="border p-2">
                                    <input
                                      type="number"
                                      min="1"
                                      className="input-field"
                                      value={item.qty ?? ''}
                                      onChange={(e) => updateParcelItem(index, 'qty', e.target.value)}
                                    />
                                  </td>
                                  <td className="border p-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="input-field"
                                      value={item.weight ?? ''}
                                      onChange={(e) => updateParcelItem(index, 'weight', e.target.value)}
                                    />
                                  </td>
                                  <td className="border p-2">
                                    <div className="grid gap-2">
                                      <div className="flex items-center gap-2">
                                        <select
                                          className="input-field w-32"
                                          value={item.currency || form.currency || 'USD'}
                                          onChange={(e) => updateParcelItem(index, 'currency', e.target.value)}
                                        >
                                          <option value="USD">USD $</option>
                                          <option value="EUR">EUR €</option>
                                          <option value="GBP">GBP £</option>
                                          <option value="NGN">NGN ₦</option>
                                        </select>
                                        <input
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          className="input-field"
                                          value={item.declared_value ?? ''}
                                          onChange={(e) => updateParcelItem(index, 'declared_value', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td className="border p-4 text-center" colSpan={5}>
                                  No parcel items added.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold text-navy-900">Shipper Information</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="label">Sender name</span>
                        <input value={form.sender_name || ''} onChange={(e) => handleFormChange('sender_name', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Sender email</span>
                        <input type="email" value={form.sender_email || ''} onChange={(e) => handleFormChange('sender_email', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Sender phone</span>
                        <input value={form.sender_phone || ''} onChange={(e) => handleFormChange('sender_phone', e.target.value)} className="input-field" />
                      </label>
                      <label className="block md:col-span-2">
                        <span className="label">Sender address</span>
                        <input value={form.sender_address || ''} onChange={(e) => handleFormChange('sender_address', e.target.value)} className="input-field" />
                      </label>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold text-navy-900">Consignee Information</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="label">Recipient name</span>
                        <input value={form.recipient_name || ''} onChange={(e) => handleFormChange('recipient_name', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Recipient email</span>
                        <input type="email" value={form.recipient_email || ''} onChange={(e) => handleFormChange('recipient_email', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Recipient phone</span>
                        <input value={form.recipient_phone || ''} onChange={(e) => handleFormChange('recipient_phone', e.target.value)} className="input-field" />
                      </label>
                      <label className="block md:col-span-2">
                        <span className="label">Recipient address</span>
                        <input value={form.recipient_address || ''} onChange={(e) => handleFormChange('recipient_address', e.target.value)} className="input-field" />
                      </label>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold text-navy-900">Delivery Confirmation</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="label">Actual delivery date</span>
                        <input type="date" value={form.actual_delivery ? form.actual_delivery.split('T')[0] : ''} onChange={(e) => handleFormChange('actual_delivery', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Delivery notes</span>
                        <textarea value={form.notes || ''} onChange={(e) => handleFormChange('notes', e.target.value)} className="input-field min-h-24" />
                      </label>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold text-navy-900">Admin notes</h2>
                    <div className="mt-4">
                      <label className="block">
                        <span className="label">Admin notes</span>
                        <textarea value={form.admin_notes || ''} onChange={(e) => handleFormChange('admin_notes', e.target.value)} className="input-field min-h-24" />
                      </label>
                    </div>
                  </section>

                  <div className="flex flex-wrap gap-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                      {saving ? 'Saving...' : 'Save shipment'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-6">
                <div className="card p-5">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-navy-900">Tracking update</h2>
                  </div>
                  <form onSubmit={handleAddEvent} className="mt-4 space-y-3">
                    <label className="block">
                      <span className="label">Tracking ID</span>
                      <input readOnly value={shipment.tracking_id || ''} className="input-field bg-slate-100" />
                    </label>
                    <label className="block">
                      <span className="label">Shipment Status</span>
                      <select value={eventForm.status} onChange={(e) => setEventForm((current) => ({ ...current, status: e.target.value }))} className="input-field">
                        {statusOptions.map((option) => <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="label">Current Location</span>
                      <select value={eventForm.location} onChange={(e) => setEventForm((current) => ({ ...current, location: e.target.value }))} className="input-field">
                        <option value="">Select a route location</option>
                        <option value={`Country route - ${form.sender_country || 'Origin country'} → ${form.recipient_country || 'Destination country'}`}>{`Country route - ${form.sender_country || 'Origin'} → ${form.recipient_country || 'Destination'}`}</option>
                        <option value={`Pickup - ${form.sender_address || form.sender_city || 'Origin location'}`}>{`Pickup - ${form.sender_address || form.sender_city || 'Origin location'}`}</option>
                        <option value={`${form.sender_city || 'Origin city'} - Sorting and Processing`}>{`${form.sender_city || 'Origin city'} - Sorting and Processing`}</option>
                        <option value="Regional Hub - Package consolidation">Regional Hub - Package consolidation</option>
                        <option value="Transit Hub - Distribution center">Transit Hub - Distribution center</option>
                        <option value="Transit - In transit via air/ground">Transit - In transit via air/ground</option>
                        <option value="International route - Between countries">International route - Between countries</option>
                        <option value="Regional Distribution Center">Regional Distribution Center</option>
                        <option value="Local Delivery Hub - Final mile sort">Local Delivery Hub - Final mile sort</option>
                        <option value={`${form.recipient_city || 'Destination city'} - Delivery facility`}>{`${form.recipient_city || 'Destination city'} - Delivery facility`}</option>
                        <option value={`Out for delivery - ${form.recipient_city || 'Recipient city'}`}>{`Out for delivery - ${form.recipient_city || 'Recipient city'}`}</option>
                        <option value={`Recipient address - ${form.recipient_address || form.recipient_city || 'Destination'}`}>{`Recipient address - ${form.recipient_address || form.recipient_city || 'Destination'}`}</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="label">Update time</span>
                      <div className="grid gap-3 md:grid-cols-2">
                        <input type="date" value={eventForm.event_date} onChange={(e) => setEventForm((current) => ({ ...current, event_date: e.target.value }))} className="input-field" />
                        <input type="time" value={eventForm.event_time} onChange={(e) => setEventForm((current) => ({ ...current, event_time: e.target.value }))} className="input-field" />
                      </div>
                    </label>
                    <label className="block">
                      <span className="label">Remarks / Notes</span>
                      <textarea value={eventForm.remarks} onChange={(e) => setEventForm((current) => ({ ...current, remarks: e.target.value }))} className="input-field min-h-24" />
                    </label>
                    <button type="submit" className="btn-secondary w-full justify-center">Save update</button>
                  </form>
                </div>

                <div className="card p-5">
                  <h2 className="text-lg font-bold text-navy-900">Upload media</h2>
                  <div className="mt-4 space-y-3">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-brand-500 file:text-white"
                    />
                    <input
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Caption (optional)"
                      className="input-field"
                    />
                    <button onClick={handleUpload} disabled={uploading} className="btn-primary w-full justify-center">
                      {uploading ? 'Uploading...' : 'Upload file'}
                    </button>
                  </div>
                </div>

                <div className="card p-5">
                  <h2 className="text-lg font-bold text-navy-900">Shipment media</h2>
                  <div className="mt-4 space-y-4">
                    {media.length === 0 ? (
                      <p className="text-sm text-gray-500">No media attached yet.</p>
                    ) : (
                      media.map((item) => (
                        <div key={item.id} className="border border-gray-200 p-3">
                          {item.media_type === 'photo' ? (
                            <img src={`${apiBase}/uploads/photos/${item.filename}`} alt={item.caption || 'Shipment media'} className="w-full h-40 object-cover rounded-none" />
                          ) : (
                            <video controls src={`${apiBase}/uploads/videos/${item.filename}`} className="w-full h-40 object-cover rounded-none" />
                          )}
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-navy-900">{item.caption || 'Media item'}</p>
                              <p className="text-xs text-gray-500">{formatDateTime(item.uploaded_at)}</p>
                            </div>
                            <button onClick={() => handleDeleteMedia(item.id)} className="text-sm font-semibold text-red-600">Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="text-lg font-bold text-navy-900">Tracking history</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-[0.15em]">
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 pr-4">Location</th>
                      <th className="py-3 pr-4">Description</th>
                      <th className="py-3 pr-4">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-gray-500">No tracking events recorded.</td>
                      </tr>
                    ) : (
                      events.map((event) => (
                        <tr key={event.id} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 pr-4"><StatusBadge status={event.status.toLowerCase().replace(/ /g, '_')} size="sm" /></td>
                          <td className="py-3 pr-4">{event.location || 'N/A'}</td>
                          <td className="py-3 pr-4">{event.description || 'Status update'}</td>
                          <td className="py-3 pr-4">{formatDateTime(event.event_time)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="text-lg font-bold text-navy-900">Shipment activity logs</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-[0.15em]">
                      <th className="py-3 pr-4">Action</th>
                      <th className="py-3 pr-4">Details</th>
                      <th className="py-3 pr-4">Admin</th>
                      <th className="py-3 pr-4">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-gray-500">No activity logs recorded.</td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 pr-4 font-semibold text-navy-900">{String(log.action).replace(/_/g, ' ')}</td>
                          <td className="py-3 pr-4 text-gray-600">
                            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {})}
                          </td>
                          <td className="py-3 pr-4">{log.created_by_name || 'System'}</td>
                          <td className="py-3 pr-4">{formatDateTime(log.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  )
}
