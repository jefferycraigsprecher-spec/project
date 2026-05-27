'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import customerApi from '@/lib/customerApi'
import { ArrowLeft } from 'lucide-react'
import Barcode from '@/components/ui/Barcode'
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
  amount_paid?: string | number
  total_amount?: string | number
  payment_method?: string
  payment_status?: string
  card_last4?: string
  ship_date?: string
  estimated_delivery?: string
  current_location?: string
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
  amount_paid: raw.amount_paid || raw.amountPaid || defaultReceiptData.amount_paid,
  total_amount: raw.total_amount || raw.totalAmount || defaultReceiptData.total_amount,
  payment_method: raw.payment_method || raw.paymentMethod || defaultReceiptData.payment_method,
  payment_status: raw.payment_status || raw.paymentStatus || defaultReceiptData.payment_status,
  card_last4: raw.card_last4 || raw.cardLast4 || '',
  ship_date: raw.ship_date || raw.shipDate || '',
  estimated_delivery: raw.estimated_delivery || raw.estimatedDelivery || '',
  current_location: raw.current_location || raw.currentLocation || '',
  parcel_items: Array.isArray(raw.parcel_items) ? raw.parcel_items : raw.parcelItems || defaultReceiptData.parcel_items,
})

function ReceiptContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [receiptData, setReceiptData] = useState<ReceiptData>(defaultReceiptData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
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
        if (!tracking) {
          setErrorMessage('Receipt data is not available. Generate the receipt from the admin shipment creation page.')
          setLoading(false)
          return
        }

        const client = getTrackingClient()
        const response = await client.get(`/shipments/track/${encodeURIComponent(tracking)}`)
        const shipment = response.data?.shipment || {}
        setReceiptData(mapReceiptData(shipment))
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
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).from(element).save()
    } catch (error) {
      console.error('PDF generation failed', error)
      alert('Unable to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-slate-100 py-16 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/shipments')}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to shipments
            </button>
            {receiptData.tracking_id && (
              <button
                type="button"
                onClick={() => router.push(`/invoice?tracking=${encodeURIComponent(receiptData.tracking_id as string)}`)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                View invoice
              </button>
            )}
          </div>

          <div id="receipt" className="overflow-hidden border border-slate-300 bg-white shadow-lg max-w-4xl mx-auto">
            {/* HEADER SECTION */}
            <div className="border-b-2 border-slate-300 px-8 py-6 bg-white">
              <div className="text-center mb-2">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Official Receipt</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">ZGG Shipping Logistics</h1>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Receipt ID</p>
                  <p className="font-semibold text-slate-900">{receiptData.tracking_id || 'Receipt'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Date Issued</p>
                  <p className="font-semibold text-slate-900">{receiptData.receiptDate}</p>
                </div>
              </div>
            </div>

            {/* SENDER & RECEIVER INFO */}
            <div className="border-b-2 border-slate-300 px-8 py-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">Sender Info</p>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-slate-900">{safeText(receiptData.sender_name)}</p>
                    <p className="text-slate-700">{safeText(receiptData.sender_address)}</p>
                    <p className="text-slate-700">{[receiptData.sender_city, receiptData.sender_state, receiptData.sender_country].filter(Boolean).join(', ')}</p>
                    {receiptData.sender_phone && <p className="text-slate-700">Ph: {receiptData.sender_phone}</p>}
                    {receiptData.sender_email && <p className="text-slate-700">{receiptData.sender_email}</p>}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">Receiver Info</p>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-slate-900">{safeText(receiptData.recipient_name)}</p>
                    <p className="text-slate-700">{safeText(receiptData.recipient_address)}</p>
                    <p className="text-slate-700">{[receiptData.recipient_city, receiptData.recipient_state, receiptData.recipient_country].filter(Boolean).join(', ')}</p>
                    {receiptData.recipient_phone && <p className="text-slate-700">Ph: {receiptData.recipient_phone}</p>}
                    {receiptData.recipient_email && <p className="text-slate-700">{receiptData.recipient_email}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* SHIPMENT DETAILS */}
            <div className="border-b-2 border-slate-300 px-8 py-6">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Shipment Details</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 uppercase">Service Type</span>
                  <p className="font-semibold text-slate-900">{safeText(receiptData.service_type, 'Standard')}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase">Weight</span>
                  <p className="font-semibold text-slate-900">{safeText(receiptData.weight)} {safeText(receiptData.weight_unit, 'lbs')}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase">Quantity</span>
                  <p className="font-semibold text-slate-900">{safeText(receiptData.quantity, '1')}</p>
                </div>
                {receiptData.dimensions && (
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Dimensions</span>
                    <p className="font-semibold text-slate-900">{safeText(receiptData.dimensions)}</p>
                  </div>
                )}
                {receiptData.ship_date && (
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Ship Date</span>
                    <p className="font-semibold text-slate-900">{safeText(receiptData.ship_date)}</p>
                  </div>
                )}
                {receiptData.estimated_delivery && (
                  <div>
                    <span className="text-xs text-slate-500 uppercase">Est. Delivery</span>
                    <p className="font-semibold text-slate-900">{safeText(receiptData.estimated_delivery)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* PARCEL DETAILS & COSTS TABLE */}
            <div className="border-b-2 border-slate-300 px-8 py-6">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Parcel Details & Costs</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-slate-300">
                  <thead>
                    <tr className="bg-slate-950 text-white">
                      <th className="border border-slate-300 px-3 py-2 text-xs uppercase text-center font-semibold">QTY</th>
                      <th className="border border-slate-300 px-3 py-2 text-xs uppercase text-center font-semibold">Product</th>
                      <th className="border border-slate-300 px-3 py-2 text-xs uppercase text-center font-semibold">Status</th>
                      <th className="border border-slate-300 px-3 py-2 text-xs uppercase text-center font-semibold">Description</th>
                      <th className="border border-slate-300 px-3 py-2 text-xs uppercase text-center font-semibold">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptData.parcel_items && receiptData.parcel_items.length > 0 ? (
                      receiptData.parcel_items.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="border border-slate-300 px-3 py-2 text-center">{safeText(item.quantity, '1')}</td>
                          <td className="border border-slate-300 px-3 py-2 text-center font-semibold">{safeText(item.product_name || item.product, 'Item')}</td>
                          <td className="border border-slate-300 px-3 py-2 text-center">{safeText(item.status, receiptData.payment_status || 'Processing')}</td>
                          <td className="border border-slate-300 px-3 py-2 text-center">{safeText(item.description, '—')}</td>
                          <td className="border border-slate-300 px-3 py-2 text-center font-semibold">{formatCurrency(item.total_cost)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="border border-slate-300 px-3 py-4 text-center text-slate-600">No parcel items available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAYMENT SUMMARY & OFFICIAL STAMP */}
            <div className="border-b-2 border-slate-300 px-8 py-6">
              <div className="flex justify-between items-start gap-8">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Payment Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-700">Shipping Cost:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(receiptData.shipping_cost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Clearance Cost:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(receiptData.clearance_cost)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-300 pt-2 mt-2">
                      <span className="font-semibold text-slate-900">Total Amount:</span>
                      <span className="font-bold text-lg text-slate-900">{formatCurrency(receiptData.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Amount Paid:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(receiptData.amount_paid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Payment Method:</span>
                      <span className="font-semibold text-slate-900">{paymentLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Status:</span>
                      <span className={`font-semibold uppercase ${receiptData.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{safeText(receiptData.payment_status)}</span>
                    </div>
                  </div>
                </div>
                <div className="w-40">
                  <div className="border-2 border-slate-950 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-2xl font-bold text-slate-950 mb-1">✓</div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-950 leading-tight">Official<br />Stamp</p>
                    <div className="mt-3 text-xs text-slate-600 border-t border-slate-300 pt-2">
                      {receiptData.receiptDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR VERIFICATION SECTION */}
            <div className="border-b-2 border-slate-300 px-8 py-6">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">QR Verification Section</p>
              <div className="flex justify-center">
                <Barcode tracking={receiptData.tracking_id} />
              </div>
              <p className="text-center text-xs text-slate-600 mt-3">Scan QR code to verify shipment status</p>
            </div>

            {/* FOOTER */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-300">
              <p className="text-center text-sm text-slate-700 font-semibold mb-2">Thank you for your business!</p>
              <p className="text-center text-xs text-slate-600">Midwest Shipment Company | Fast, Reliable Logistics</p>
              <p className="text-center text-xs text-slate-600 mt-1">www.midwestshipment.com | support@midwestshipment.com</p>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="border-t border-slate-300 px-8 py-4 bg-white flex justify-end">
              <button
                type="button"
                onClick={generatePDF}
                disabled={isGenerating}
                className="inline-flex items-center justify-center bg-slate-950 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed border border-slate-950"
              >
                {isGenerating ? 'Generating PDF...' : 'Download PDF'}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
              {errorMessage}
            </div>
          )}
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
