'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import customerApi from '@/lib/customerApi'
import { Download, Printer, ArrowLeft, CheckCircle, FileText } from 'lucide-react'
import Barcode from '@/components/ui/Barcode'
import ProfessionalStatusBadge from '@/components/ui/ProfessionalStatusBadge'
import MidwestLogo from '@/components/MidwestLogo'
import Cookies from 'js-cookie'

type InvoiceParcelItem = {
  quantity?: string | number
  qty?: string | number
  product_name?: string
  product?: string
  status?: string
  description?: string
  shipping_cost?: string | number
  shippingCost?: string | number
  clearance_cost?: string | number
  clearanceCost?: string | number
  total_cost?: string | number
  totalCost?: string | number
}

type InvoiceData = {
  id?: number
  tracking_id?: string
  trackingId?: string
  trackingNumber?: string
  order_id?: string
  orderId?: string
  shipment_id?: string
  shipmentId?: string
  created_by?: string
  createdBy?: string
  service_type?: string
  serviceType?: string
  shipment_date?: string
  dispatchDate?: string
  estimated_delivery?: string
  estimatedDeliveryDate?: string
  origin_location?: string
  originLocation?: string
  destination_location?: string
  destinationLocation?: string
  status?: string
  payment_method?: string
  paymentMethod?: string
  payment_status?: string
  paymentStatus?: string
  card_last4?: string
  cardLast4?: string
  sender_name?: string
  senderName?: string
  sender_phone?: string
  senderPhone?: string
  sender_email?: string
  senderEmail?: string
  sender_address?: string
  senderAddress?: string
  recipient_name?: string
  receiverName?: string
  recipient_phone?: string
  receiverPhone?: string
  recipient_email?: string
  receiverEmail?: string
  recipient_address?: string
  receiverAddress?: string
  parcel_category?: string
  parcelType?: string
  parcel_product?: string
  description?: string
  packageDescription?: string
  weight?: string | number
  quantity?: string | number
  numberOfPackages?: string | number
  declared_value?: string | number
  declaredValue?: string | number
  packaging_type?: string
  dimensions?: string
  remarks?: string
  notes?: string
  shipment_cost?: string | number
  shippingCost?: string | number
  shipping_cost?: string | number
  fuel_charge?: string | number
  insurance?: string | number
  insuranceFee?: string | number
  other_charges?: string | number
  discount?: string | number
  discounts?: string | number
  total_amount?: string | number
  totalAmount?: string | number
  parcel_items?: InvoiceParcelItem[]
  parcelItems?: InvoiceParcelItem[]
}

const defaultInvoiceData: InvoiceData = {
  tracking_id: 'MWL8473629180US',
  order_id: 'MWL-ORD-20260528-1045',
  shipment_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  created_by: 'Admin',
  service_type: 'Express Delivery',
  status: 'booked',
  payment_status: 'paid',
  sender_name: 'John Smith',
  sender_phone: '+1 312 555 0198',
  sender_email: 'john@email.com',
  sender_address: '123 Michigan Avenue, Chicago, Illinois, USA - 60601',
  recipient_name: 'Ahmed Khan',
  recipient_phone: '+92 300 1234567',
  recipient_email: 'ahmed.khan@email.com',
  recipient_address: '45, Main Boulevard, Lahore, Punjab, Pakistan - 54000',
  parcel_category: 'Electronics',
  parcel_product: 'Electronic Devices',
  description: '1 Laptop (Dell Inspiron), Charger, Laptop Bag',
  weight: '5.20',
  quantity: '1',
  declared_value: '$1,200.00 USD',
  packaging_type: 'Box',
  dimensions: '40cm × 30cm × 20cm',
  remarks: 'Shipment processed successfully and forwarded to transit hub. Handle with care.',
  shipping_cost: '$120.00',
  fuel_charge: '$15.00',
  insurance: '$10.00',
  other_charges: '$5.00',
  discount: '$0.00',
  total_amount: '$150.00',
  origin_location: 'Chicago, USA',
  destination_location: 'Lahore, Pakistan',
  estimated_delivery: '02 Jun 2026',
  parcel_items: []
}

const formatInvoiceCurrency = (value: string | number | undefined) => {
  if (typeof value === 'string' && /[A-Za-z]/.test(value)) {
    return value
  }
  const numeric = typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.-]+/g, ''))
      : NaN
  return Number.isFinite(numeric) ? `USD ${numeric.toFixed(2)}` : 'USD 0.00'
}

const buildLocationLabel = (raw: any, type: 'origin' | 'destination') => {
  if (type === 'origin') {
    return raw.origin_location || raw.originLocation || [raw.sender_address, raw.sender_city, raw.sender_state, raw.sender_country].filter(Boolean).join(', ')
  }
  return raw.destination_location || raw.destinationLocation || [raw.recipient_address, raw.recipient_city, raw.recipient_state, raw.recipient_country].filter(Boolean).join(', ')
}

const parseParcelItems = (items: any): InvoiceParcelItem[] => {
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

const mapInvoiceData = (raw: any): InvoiceData => ({
  id: raw.id ?? raw.shipment_id ?? raw.shipmentId,
  tracking_id: raw.tracking_id || raw.trackingId || raw.trackingNumber || '',
  order_id: raw.order_id || raw.orderId || '',
  shipment_id: raw.shipment_id || raw.shipmentId || raw.id,
  created_by: raw.created_by || raw.createdBy || '',
  service_type: raw.service_type || raw.serviceType || '',
  shipment_date: raw.shipment_date || raw.dispatchDate || raw.shipmentDate || '',
  estimated_delivery: raw.estimated_delivery || raw.estimatedDelivery || '',
  origin_location: buildLocationLabel(raw, 'origin'),
  destination_location: buildLocationLabel(raw, 'destination'),
  status: raw.status || '',
  payment_method: raw.payment_method || raw.paymentMethod || '',
  payment_status: raw.payment_status || raw.paymentStatus || '',
  card_last4: raw.card_last4 || raw.cardLast4 || '',
  sender_name: raw.sender_name || raw.senderName || '',
  sender_phone: raw.sender_phone || raw.senderPhone || '',
  sender_email: raw.sender_email || raw.senderEmail || '',
  sender_address: raw.sender_address || raw.senderAddress || '',
  recipient_name: raw.recipient_name || raw.recipientName || raw.receiverName || '',
  recipient_phone: raw.recipient_phone || raw.recipientPhone || raw.receiverPhone || '',
  recipient_email: raw.recipient_email || raw.recipientEmail || raw.receiverEmail || '',
  recipient_address: raw.recipient_address || raw.recipientAddress || raw.receiverAddress || '',
  parcel_category: raw.parcel_category || raw.parcelCategory || (Array.isArray(raw.parcel_items) ? raw.parcel_items[0]?.category : raw.parcelItems?.[0]?.category) || '',
  parcel_product: raw.parcel_product || raw.parcelProduct || '',
  description: raw.description || raw.parcel_description || raw.parcelDescription || (Array.isArray(raw.parcel_items) ? raw.parcel_items[0]?.description : raw.parcelItems?.[0]?.description) || '',
  weight: raw.weight || '',
  quantity: raw.quantity || raw.numberOfPackages || '',
  declared_value: raw.declared_value || raw.declaredValue || '',
  packaging_type: raw.packaging_type || raw.packageType || '',
  dimensions: raw.dimensions || '',
  remarks: raw.remarks || raw.notes || raw.admin_notes || '',
  shipping_cost: raw.shipping_cost ?? raw.shipment_cost ?? raw.shippingCost ?? '',
  fuel_charge: raw.fuel_charge ?? raw.fuelCharge ?? '',
  insurance: raw.insurance ?? raw.insuranceFee ?? '',
  other_charges: raw.other_charges ?? raw.otherCharges ?? '',
  discount: raw.discount || raw.discounts || '',
  total_amount: raw.total_amount || raw.totalAmount || '',
  parcel_items: parseParcelItems(raw.parcel_items ?? raw.parcelItems),
})

function InvoiceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData)
  const [loading, setLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem('msc_admin_invoice_data')
          if (stored) {
            setInvoiceData(mapInvoiceData(JSON.parse(stored)))
            setLoading(false)
            return
          }
        }

        const shipmentId = searchParams?.get('id')
        const tracking = searchParams?.get('tracking')
        const customerToken = Cookies.get('msc_customer_token')
        const adminToken = Cookies.get('msc_admin_token')
        const client = customerToken ? customerApi : api

        if (shipmentId) {
          const response = await client.get(`/shipments/${shipmentId}`)
          if (response.data?.shipment) {
            setInvoiceData(mapInvoiceData(response.data.shipment))
            setLoading(false)
            return
          }
        }

        if (tracking) {
          const response = await client.get(`/shipments/tracking/${tracking.toUpperCase()}`)
          if (response.data?.shipment) {
            setInvoiceData(mapInvoiceData(response.data.shipment))
            setLoading(false)
            return
          }
        }

        setLoading(false)
      } catch (error) {
        console.error('Failed to load invoice', error)
        setLoading(false)
      }
    }

    loadInvoice()
  }, [searchParams])

  const generatePDF = async () => {
    setIsGeneratingPDF(true)

    const invoiceId = invoiceData.id || invoiceData.shipment_id
    const trackingId = invoiceData.tracking_id || invoiceData.trackingId || invoiceData.trackingNumber
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '/api'
    const token = Cookies.get('msc_admin_token') || Cookies.get('msc_customer_token')
    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`

    try {
      let url = ''
      if (trackingId) {
        url = `${apiBase}/shipments/tracking/${encodeURIComponent(trackingId)}/invoice/pdf`
      } else if (invoiceId) {
        url = `${apiBase}/shipments/${invoiceId}/invoice/pdf`
      }

      if (url) {
        const response = await fetch(url, { headers })
        if (response.ok) {
          const blob = await response.blob()
          const downloadUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `Invoice_${invoiceData.tracking_id || invoiceData.id || invoiceData.shipment_id || 'invoice'}.pdf`
          document.body.appendChild(link)
          link.click()
          link.remove()
          URL.revokeObjectURL(downloadUrl)
          return
        }
      }

      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default ?? html2pdfModule
      const element = document.getElementById('invoice')
      if (!element) return

      await html2pdf().set({
        margin: 0.25,
        filename: `Invoice_${invoiceData.tracking_id || 'invoice'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).from(element).save()
    } catch (error) {
      console.error('PDF generation failed', error)
      alert('Unable to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
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
          <p className="text-slate-600 font-semibold">Loading invoice details...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-900">Invoice</h1>
                </div>
                <p className="text-sm text-slate-600">Shipment billing and charges</p>
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
                disabled={isGeneratingPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* INVOICE DOCUMENT */}
          <div id="invoice" className="bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* HEADER */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <MidwestLogo size="medium" />
                    <div>
                      <div className="text-sm font-semibold text-slate-300">MIDWEST</div>
                      <div className="text-lg font-bold">Shipment Company</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-300 mb-1">Invoice Number</div>
                  <div className="text-2xl font-bold">{invoiceData.order_id}</div>
                  <div className="text-sm text-slate-300 mt-2">Date: {invoiceData.shipment_date}</div>
                </div>
              </div>
            </div>

            {/* BILLING INFO */}
            <div className="border-b border-slate-100 px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Bill From</p>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-900">Midwest Logistics</p>
                    <p className="text-sm text-slate-600">Fast, Reliable Global Shipping</p>
                    <p className="text-sm text-slate-600">www.midwestshipment.com</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Bill To</p>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-900">{invoiceData.sender_name}</p>
                    <p className="text-sm text-slate-600">{invoiceData.sender_email}</p>
                    <p className="text-sm text-slate-600">{invoiceData.sender_phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SHIPMENT DETAILS */}
            <div className="border-b border-slate-100 px-8 py-8">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Shipment Details</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Tracking ID</p>
                  <p className="text-sm font-bold text-slate-900 font-mono">{invoiceData.tracking_id}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Service Type</p>
                  <p className="text-sm font-bold text-slate-900">{invoiceData.service_type}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Status</p>
                  <ProfessionalStatusBadge status={invoiceData.status || 'processing'} />
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Payment</p>
                  <ProfessionalStatusBadge status={invoiceData.payment_status || 'pending'} />
                </div>
              </div>
            </div>

            {/* CHARGES TABLE */}
            <div className="border-b border-slate-100 px-8 py-8">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Itemized Charges</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="px-4 py-3 text-sm text-slate-700">Freight Charge (Base Shipping)</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">{formatInvoiceCurrency(invoiceData.shipping_cost)}</td>
                    </tr>
                    {invoiceData.fuel_charge && (
                      <tr className="border-b border-slate-200">
                        <td className="px-4 py-3 text-sm text-slate-700">Fuel Surcharge</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">{formatInvoiceCurrency(invoiceData.fuel_charge)}</td>
                      </tr>
                    )}
                    {invoiceData.insurance && (
                      <tr className="border-b border-slate-200">
                        <td className="px-4 py-3 text-sm text-slate-700">Insurance Fee</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">{formatInvoiceCurrency(invoiceData.insurance)}</td>
                      </tr>
                    )}
                    {invoiceData.other_charges && (
                      <tr className="border-b border-slate-200">
                        <td className="px-4 py-3 text-sm text-slate-700">Other Charges</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">{formatInvoiceCurrency(invoiceData.other_charges)}</td>
                      </tr>
                    )}
                    {invoiceData.discount && (
                      <tr className="border-b border-slate-200 bg-green-50">
                        <td className="px-4 py-3 text-sm text-green-700 font-semibold">Discount</td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-700 text-right">-{formatInvoiceCurrency(invoiceData.discount)}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-900 text-white">
                      <td className="px-4 py-3 font-bold uppercase text-sm">Total Amount</td>
                      <td className="px-4 py-3 text-xl font-bold text-right">{formatInvoiceCurrency(invoiceData.total_amount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {(invoiceData.parcel_items?.length ?? 0) > 0 && (
              <div className="border-b border-slate-100 px-8 py-8">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Parcel item details</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.parcel_items?.map((item, index) => (
                        <tr key={index} className="border-b border-slate-200">
                          <td className="px-4 py-3 text-slate-700">{item.qty ?? item.quantity ?? '1'}</td>
                          <td className="px-4 py-3 text-slate-700">{item.description || item.product || item.product_name || '—'}</td>
                          <td className="px-4 py-3 text-slate-700">{(item as any).category || item.status || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SHIPMENT INFO */}
            <div className="border-b border-slate-100 px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Parcel Information</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Category:</span><span className="font-semibold text-slate-900">{invoiceData.parcel_category}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Weight:</span><span className="font-semibold text-slate-900">{invoiceData.weight} KG</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Quantity:</span><span className="font-semibold text-slate-900">{invoiceData.quantity}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Dimensions:</span><span className="font-semibold text-slate-900">{invoiceData.dimensions}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Declared Value:</span><span className="font-semibold text-slate-900">{invoiceData.declared_value}</span></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Route Information</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">From:</span><span className="font-semibold text-slate-900">{invoiceData.origin_location}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">To:</span><span className="font-semibold text-slate-900">{invoiceData.destination_location}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Est. Delivery:</span><span className="font-semibold text-slate-900">{invoiceData.estimated_delivery}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Payment Method:</span><span className="font-semibold text-slate-900">{invoiceData.payment_method || 'Card'}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BARCODE */}
            <div className="border-b border-slate-100 px-8 py-8 bg-slate-50 text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Tracking Barcode</p>
              <div className="flex justify-center">
                <Barcode tracking={invoiceData.tracking_id} />
              </div>
            </div>

            {/* NOTES & TERMS */}
            <div className="border-b border-slate-100 px-8 py-8">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Remarks & Delivery Instructions</p>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-sm text-slate-700">
                {invoiceData.remarks}
              </div>
            </div>

            {/* FOOTER */}
            <div className="bg-slate-900 text-white px-8 py-6 text-center text-xs space-y-2">
              <p className="font-semibold">Midwest Shipment Company | Fast. Reliable. Worldwide.</p>
              <p className="text-slate-400">www.midwestshipment.com | info.midwestshipment@gmail.com | +1 (239) 746-8728</p>
              <p className="text-slate-500 text-xs">© 2026 Midwest Shipment Company. All rights reserved. This is an official invoice document.</p>
            </div>
          </div>

          {/* PRINT STYLESHEET */}
          <style jsx>{`
            @media print {
              body {
                background: white;
                margin: 0;
                padding: 0;
              }
              #invoice {
                box-shadow: none;
                max-width: 100%;
              }
              .print\:hidden {
                display: none !important;
              }
            }
          `}</style>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoiceContent />
    </Suspense>
  )
}
