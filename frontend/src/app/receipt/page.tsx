'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import customerApi from '@/lib/customerApi'
import { ArrowLeft, Download, Printer, Eye, MapPin, Package, User, FileText } from 'lucide-react'
import Barcode from '@/components/ui/Barcode'
import ProfessionalStatusBadge from '@/components/ui/ProfessionalStatusBadge'
import Cookies from 'js-cookie'

type ReceiptItem = {
  quantity?: string | number
  product_name?: string
  product?: string
  status?: string
  description?: string
  shipping_cost?: string | number
  clearance_cost?: string | number
  total_cost?: string | number
}

type ReceiptData = {
  tracking_id?: string
  order_id?: string
  receiptDate: string
  sender_name?: string
  sender_address?: string
  sender_city?: string
  sender_state?: string
  sender_country?: string
  sender_phone?: string
  sender_email?: string
  recipient_name?: string
  recipient_address?: string
  recipient_city?: string
  recipient_state?: string
  recipient_country?: string
  recipient_phone?: string
  recipient_email?: string
  booking_mode?: string
  service_type?: string
  weight?: string | number
  weight_unit?: string
  dimensions?: string
  quantity?: string | number
  description?: string
  declared_value?: string | number
  shipping_cost?: string | number
  clearance_cost?: string | number
  base_fee?: string | number
  weight_charge?: string | number
  insurance?: string | number
  fuel_charge?: string | number
  customs?: string | number
  amount_paid?: string | number
  total_amount?: string | number
  payment_method?: string
  payment_status?: string
  card_last4?: string
  ship_date?: string
  estimated_delivery?: string
  current_location?: string
  status?: string
  parcel_items?: ReceiptItem[]
}

const defaultReceiptData: ReceiptData = {
  receiptDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  sender_name: 'Sender Name',
  sender_address: 'Sender Address',
  sender_city: '',
  sender_state: '',
  sender_country: '',
  sender_phone: '',
  sender_email: '',
  recipient_name: 'Recipient Name',
  recipient_address: 'Recipient Address',
  recipient_city: '',
  recipient_state: '',
  recipient_country: '',
  recipient_phone: '',
  recipient_email: '',
  booking_mode: 'ToPay',
  service_type: 'standard',
  weight: '0',
  weight_unit: 'lbs',
  dimensions: '',
  quantity: '1',
  description: '',
  declared_value: '0',
  shipping_cost: '0',
  clearance_cost: '0',
  base_fee: '0',
  weight_charge: '0',
  insurance: '0',
  fuel_charge: '0',
  customs: '0',
  amount_paid: '0',
  total_amount: '0',
  payment_method: 'Card',
  payment_status: 'pending',
  card_last4: '',
  ship_date: '',
  estimated_delivery: '',
  current_location: '',
  parcel_items: []
}

const formatCurrency = (value: string | number | undefined) => {
  const numeric = typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.-]+/g, ''))
      : NaN

  return Number.isFinite(numeric) ? `USD ${numeric.toFixed(2)}` : 'USD 0.00'
}

const safeText = (value: string | number | undefined, fallback = '—') =>
  value || value === 0 ? String(value) : fallback

const parseParcelItems = (items: any): ReceiptItem[] => {
  if (Array.isArray(items)) return items
  if (typeof items === 'string') {
    try {
      return JSON.parse(items)
    } catch {
      return []
    }
  }
  return []
}

const mapReceiptData = (raw: any): ReceiptData => ({
  tracking_id: raw.tracking_id || raw.orderId || raw.trackingNumber || '',
  receiptDate: raw.receiptDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  sender_name: raw.sender_name || raw.senderName || raw.sender?.name || defaultReceiptData.sender_name,
  sender_address: raw.sender_address || raw.sender?.address || defaultReceiptData.sender_address,
  sender_city: raw.sender_city || raw.sender?.city || '',
  sender_state: raw.sender_state || raw.sender?.state || '',
  sender_country: raw.sender_country || raw.sender?.country || '',
  sender_phone: raw.sender_phone || raw.sender?.phone || '',
  sender_email: raw.sender_email || raw.sender?.email || '',
  recipient_name: raw.recipient_name || raw.recipientName || raw.recipient?.name || defaultReceiptData.recipient_name,
  order_id: raw.order_id || raw.orderId || raw.order || '',
  recipient_address: raw.recipient_address || raw.recipient?.address || defaultReceiptData.recipient_address,
  recipient_city: raw.recipient_city || raw.recipient?.city || '',
  recipient_state: raw.recipient_state || raw.recipient?.state || '',
  recipient_country: raw.recipient_country || raw.recipient?.country || '',
  recipient_phone: raw.recipient_phone || raw.recipient?.phone || '',
  recipient_email: raw.recipient_email || raw.recipient?.email || '',
  booking_mode: raw.booking_mode || raw.bookingMode || defaultReceiptData.booking_mode,
  service_type: raw.service_type || raw.serviceType || defaultReceiptData.service_type,
  weight: raw.weight || raw.weight || defaultReceiptData.weight,
  weight_unit: raw.weight_unit || raw.weightUnit || defaultReceiptData.weight_unit,
  dimensions: raw.dimensions || defaultReceiptData.dimensions,
  quantity: raw.quantity || raw.qty || defaultReceiptData.quantity,
  description: raw.description || defaultReceiptData.description,
  declared_value: raw.declared_value || raw.declaredValue || defaultReceiptData.declared_value,
  shipping_cost: raw.shipment_cost || raw.shipping_cost || raw.shippingCost || defaultReceiptData.shipping_cost,
  clearance_cost: raw.clearance_cost || raw.clearanceCost || defaultReceiptData.clearance_cost,
  base_fee: raw.base_fee || raw.baseFee || defaultReceiptData.base_fee,
  weight_charge: raw.weight_charge || raw.weightCharge || defaultReceiptData.weight_charge,
  insurance: raw.insurance || raw.insuranceFee || raw.clearance_cost || defaultReceiptData.insurance,
  fuel_charge: raw.fuel_charge || raw.fuelCharge || defaultReceiptData.fuel_charge,
  customs: raw.customs || raw.customs_tax || raw.customsTax || defaultReceiptData.customs,
  amount_paid: raw.amount_paid || raw.amountPaid || defaultReceiptData.amount_paid,
  total_amount: raw.total_amount || raw.totalAmount || defaultReceiptData.total_amount,
  payment_method: raw.payment_method || raw.paymentMethod || defaultReceiptData.payment_method,
  payment_status: raw.payment_status || raw.paymentStatus || defaultReceiptData.payment_status,
  card_last4: raw.card_last4 || raw.cardLast4 || '',
  ship_date: raw.ship_date || raw.shipDate || '',
  estimated_delivery: raw.estimated_delivery || raw.estimatedDelivery || '',
  current_location: raw.current_location || raw.currentLocation || '',
  parcel_items: parseParcelItems(raw.parcel_items ?? raw.parcelItems),
})

function ReceiptContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/track')
    }
  }
  const [receiptData, setReceiptData] = useState<ReceiptData>(defaultReceiptData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getTrackingClient = () => {
    const customerToken = Cookies.get('msc_customer_token')
    const adminToken = Cookies.get('msc_admin_token')
    if (customerToken) return customerApi
    if (adminToken) return api
    return api
  }

  useEffect(() => {
    const loadReceipt = async () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem('msc_admin_receipt_data') || window.localStorage.getItem('msc_admin_invoice_data')
          if (stored) {
            setReceiptData(mapReceiptData(JSON.parse(stored)))
            setLoading(false)
            return
          }
        }

        const tracking = searchParams?.get('tracking')
        const shipmentId = searchParams?.get('id')

        const client = getTrackingClient()
        if (shipmentId) {
          const response = await client.get(`/shipments/${shipmentId}`)
          if (response.data?.shipment) {
            setReceiptData(mapReceiptData(response.data.shipment))
            setLoading(false)
            return
          }
        }

        if (tracking) {
          const response = await client.get(`/shipments/tracking/${tracking.toUpperCase()}`)
          if (response.data?.shipment) {
            setReceiptData(mapReceiptData(response.data.shipment))
            setLoading(false)
            return
          }
        }

        if (!tracking) {
          setErrorMessage('Receipt data is not available. Generate the receipt from the admin shipment creation page.')
        } else {
          setErrorMessage('Unable to find receipt for this tracking number. Make sure the tracking code is correct and try again.')
        }
        setLoading(false)
      } catch (error) {
        console.error('Failed to load receipt data', error)
        setErrorMessage('Unable to load receipt details. Please generate a receipt from the admin shipment creation page.')
      } finally {
        setLoading(false)
      }
    }

    loadReceipt()
  }, [searchParams])

  const paymentLabel = receiptData.payment_method && receiptData.payment_method !== 'pending'
    ? (receiptData.payment_method.toLowerCase().includes('card') && receiptData.card_last4
      ? `${receiptData.payment_method.split(' ')[0]} •••• ${receiptData.card_last4}`
      : receiptData.payment_method)
    : 'Not specified'

  const isPaid = receiptData.payment_status?.toLowerCase().includes('paid')
  const paymentLabelText = isPaid ? 'Paid' : 'Pending'
  const paymentLabelClass = isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
  const packageDimensions = receiptData.dimensions || '40cm × 30cm × 20cm'
  const packageWeight = receiptData.weight ? `${receiptData.weight} ${receiptData.weight_unit || 'KG'}` : '5.20 KG'
  const orderNumber = receiptData.order_id || `MWL-ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-1045`
  const shipmentStatus = receiptData.status ? receiptData.status.charAt(0).toUpperCase() + receiptData.status.slice(1) : 'Booked'

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default ?? html2pdfModule
      const element = document.getElementById('receipt')
      if (!element) return

      await html2pdf().set({
        margin: 0.2,
        filename: `Receipt_${receiptData.tracking_id || 'receipt'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], before: '.page-break-before', after: '.page-break-after', avoid: '.avoid-break' }
      } as any).from(element).save()
    } catch (error) {
      console.error('PDF generation failed', error)
      alert('Unable to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-slate-300 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading receipt details...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-900">Receipt Preview</h1>
                </div>
                <p className="text-sm text-slate-600">Midwest Logistics style receipt preview with shipment summary.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-semibold transition-colors disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          <div id="receipt" className="bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(15,23,42,0.14)] overflow-hidden">
            <div className="receipt-page page-one">
              <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 text-white px-8 py-10 sm:px-10 sm:py-12">
                <div className="grid gap-8 lg:grid-cols-[1.7fr_0.95fr] items-start">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-500 p-3 shadow-lg shadow-brand-600/30 shrink-0">
                        <Package className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-brand-100/80">Midwest Shipment Company</p>
                        <h2 className="text-3xl font-bold tracking-tight">Shipment Receipt</h2>
                        <p className="mt-2 max-w-xl text-sm text-brand-100/90 font-semibold tracking-wider">
                          -----FAST & RELIABLE DELIVERY -------
                        </p>
                        <p className="mt-3 text-xs text-brand-100/70">info.midwestshipment@gmail.com | +1 (239) 746-8728</p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.75rem] bg-slate-900/90 p-5 border border-slate-800">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Order ID</p>
                        <p className="text-base font-semibold text-white">{orderNumber}</p>
                      </div>
                      <div className="rounded-[1.75rem] bg-slate-900/90 p-5 border border-slate-800">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Tracking No.</p>
                        <p className="text-base font-semibold text-white">{safeText(receiptData.tracking_id, 'MWL8473629180US')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-4">Charge Summary</p>
                        <div className="space-y-3 text-sm text-slate-600">
                          <div className="flex items-center justify-between"><span>Total Weight</span><span className="font-semibold text-slate-900">{safeText(receiptData.weight, '5.20')} KG</span></div>
                          <div className="flex items-center justify-between"><span>Freight Charge</span><span className="font-semibold text-slate-900">{formatCurrency(receiptData.shipping_cost)}</span></div>
                          <div className="flex items-center justify-between"><span>Fuel Surcharge</span><span className="font-semibold text-slate-900">{formatCurrency(receiptData.fuel_charge)}</span></div>
                          <div className="flex items-center justify-between"><span>Insurance</span><span className="font-semibold text-slate-900">{formatCurrency(receiptData.insurance)}</span></div>
                          <div className="flex items-center justify-between"><span>Other Charges</span><span className="font-semibold text-slate-900">{formatCurrency(receiptData.clearance_cost)}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 rounded-3xl bg-blue-50 p-5 border border-blue-100">
                      <p className="text-xs uppercase tracking-[0.24em] text-blue-600 mb-2">Total Amount</p>
                      <p className="text-3xl font-bold text-slate-900">{formatCurrency(receiptData.total_amount)}</p>
                      <p className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${paymentLabelClass}`}>{paymentLabelText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="receipt-page page-two page-break-after">
              <div className="bg-slate-50 px-6 py-8 sm:px-8 sm:py-10">
                <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
                  <div className="space-y-6">
                    <section className="rounded-[1.75rem] bg-white border border-slate-200 p-6 shadow-sm avoid-break">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sender Information</p>
                          <h3 className="text-xl font-semibold text-slate-900">Sender details</h3>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Name</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.sender_name)}</p></div>
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Phone</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.sender_phone)}</p></div>
                        <div className="sm:col-span-2"><p className="text-xs text-slate-500 uppercase mb-1">Email</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.sender_email)}</p></div>
                        <div className="sm:col-span-2"><p className="text-xs text-slate-500 uppercase mb-1">Address</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.sender_address)}</p></div>
                      </div>
                    </section>

                    <section className="rounded-[1.75rem] bg-white border border-slate-200 p-6 shadow-sm avoid-break">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Receiver Information</p>
                          <h3 className="text-xl font-semibold text-slate-900">Receiver details</h3>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Name</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.recipient_name)}</p></div>
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Phone</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.recipient_phone)}</p></div>
                        <div className="sm:col-span-2"><p className="text-xs text-slate-500 uppercase mb-1">Email</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.recipient_email)}</p></div>
                        <div className="sm:col-span-2"><p className="text-xs text-slate-500 uppercase mb-1">Address</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.recipient_address)}</p></div>
                      </div>
                    </section>

                    <section className="rounded-[1.75rem] bg-white border border-slate-200 p-6 shadow-sm avoid-break">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Parcel Details</p>
                          <h3 className="text-xl font-semibold text-slate-900">Contents overview</h3>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Description</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.description, 'Parcel contents')}</p></div>
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Declared Value</p><p className="text-sm font-semibold text-slate-900">{formatCurrency(receiptData.declared_value)}</p></div>
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Weight</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.weight, '5.20')} {safeText(receiptData.weight_unit, 'KG')}</p></div>
                        <div><p className="text-xs text-slate-500 uppercase mb-1">Quantity</p><p className="text-sm font-semibold text-slate-900">{safeText(receiptData.quantity, '1')}</p></div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section className="rounded-[1.75rem] bg-white border border-slate-200 p-6 shadow-sm avoid-break">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Route & Service</p>
                          <h3 className="text-xl font-semibold text-slate-900">Shipment route</h3>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-1">From</p>
                          <p className="font-semibold text-slate-900">{safeText(receiptData.sender_address)}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-1">To</p>
                          <p className="font-semibold text-slate-900">{safeText(receiptData.recipient_address)}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-1">Service Type</p>
                          <p className="font-semibold text-slate-900">{safeText(receiptData.service_type, 'Express Delivery')}</p>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-[1.75rem] bg-white border border-slate-200 p-6 shadow-sm avoid-break">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Package Preview</p>
                          <h3 className="text-xl font-semibold text-slate-900">Box preview</h3>
                        </div>
                      </div>
                      <div className="rounded-[1.5rem] bg-slate-100 p-6 text-center">
                        <svg viewBox="0 0 160 130" className="mx-auto mb-6 h-48 w-full max-w-[220px]">
                          <defs>
                            <linearGradient id="box-top" x1="0" x2="1" y1="0" y2="1">
                              <stop offset="0%" stopColor="#d9b07c" />
                              <stop offset="100%" stopColor="#b9824d" />
                            </linearGradient>
                            <linearGradient id="box-side" x1="0" x2="1" y1="0" y2="1">
                              <stop offset="0%" stopColor="#b77a49" />
                              <stop offset="100%" stopColor="#8e5d36" />
                            </linearGradient>
                          </defs>
                          <polygon points="40,40 120,20 140,50 60,70" fill="url(#box-top)" />
                          <polygon points="40,40 60,70 60,110 40,90" fill="#c48b57" />
                          <polygon points="60,70 140,50 140,90 60,110" fill="url(#box-side)" />
                          <rect x="62" y="32" width="36" height="12" rx="2" fill="#a1713d" />
                          <path d="M62 42 L98 32" stroke="#a67947" strokeWidth="4" strokeLinecap="round" />
                          <path d="M62 46 L98 36" stroke="#a67947" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        <p className="text-sm font-semibold text-slate-900">Box Package</p>
                        <p className="text-sm text-slate-500">{packageDimensions}</p>
                        <p className="text-sm text-slate-500 mt-1">{packageWeight}</p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>

            <div className="receipt-page page-three avoid-break">
              <div className="bg-white px-8 py-16 sm:px-10 sm:py-20 border-t border-slate-200 flex items-center justify-center">
                <div className="bg-slate-900 text-white px-10 py-12 rounded-[2rem] max-w-2xl text-center w-full shadow-xl">
                  <p className="text-2xl font-semibold">Thank you for your business!</p>
                  <p className="font-semibold">Midwest Shipment Company | Fast. Reliable. Worldwide.</p>
                  <p className="text-slate-400 mt-2">info.midwestshipment@gmail.com | +1 (239) 746-8728</p>
                  <p className="mt-3 text-slate-500 text-xs">© 2026 Midwest Shipment Company. All rights reserved. This is an official receipt document.</p>
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <style jsx>{`
            @media print {
              body {
                background: white;
                margin: 0;
                padding: 0;
              }
              #receipt {
                box-shadow: none;
                max-width: 100%;
              }
              .print\:hidden {
                display: none !important;
              }
              .receipt-page {
                page-break-after: always;
                break-after: page;
                page-break-inside: avoid;
                break-inside: avoid-page;
              }
              .receipt-page:last-child {
                page-break-after: auto;
                break-after: auto;
              }
              .avoid-break {
                page-break-inside: avoid;
                break-inside: avoid-page;
              }
            }
          `}</style>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={null}>
      <ReceiptContent />
    </Suspense>
  )
}
