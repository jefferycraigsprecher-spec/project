'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import customerApi from '@/lib/customerApi'
import Cookies from 'js-cookie'
import Barcode from '@/components/ui/Barcode'

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
  trackingNumber: string
  orderId: string
  shipmentId: string
  createdBy: string
  branchLocation: string
  shippingMethod: string
  serviceType: string
  dispatchDate: string
  estimatedDeliveryDate: string
  originLocation: string
  destinationLocation: string
  bookingMode: string
  status: string
  paymentMethod: string
  paymentStatus: string
  cardLast4: string
  shipmentCost: string
  shippingCost: string
  shippingPaid?: string | number | boolean
  clearanceCost: string
  amountPaid: string
  subtotal: string
  tax: string
  discountAmount: string
  totalAmount: string
  dateCreated: string
  senderName: string
  senderPhone: string
  senderEmail: string
  senderAddress: string
  senderCity: string
  senderState: string
  senderPostalCode: string
  senderCountry: string
  receiverName: string
  receiverPhone: string
  receiverEmail: string
  receiverAddress: string
  receiverCity: string
  receiverState: string
  receiverPostalCode: string
  receiverCountry: string
  receiverDestination: string
  senderOrigin: string
  packageDescription: string
  parcelType: string
  numberOfPackages: string | number
  weight: string
  dimensions: string
  declaredValue: string
  handlingType: string
  pickupDate: string
  deliveryDate: string
  deliverySpeed: string
  deliveryMethod: string
  baseShippingFee: string
  weightCharges: string
  distanceCharges: string
  serviceCharges: string
  insuranceFee: string
  customsTax: string
  discounts: string
  promoCode: string
  corporateDiscount: string
  loyaltyDiscount: string
  notes: string
  parcelItems: InvoiceParcelItem[]
}

const initialInvoiceData: InvoiceData = {
  trackingNumber: 'ZG-1097-ZAKIMTEO',
  orderId: 'ZG-1097-ZAKIMTEO',
  shipmentId: 'SH-20260526-001',
  createdBy: 'Admin User',
  branchLocation: 'Los Angeles Branch',
  shippingMethod: 'Air',
  serviceType: 'Express',
  dispatchDate: 'May 26, 2026',
  estimatedDeliveryDate: 'May 28, 2026',
  originLocation: 'Los Angeles, CA, USA',
  destinationLocation: 'New York, NY, USA',
  bookingMode: 'ToPay',
  status: 'processing',
  paymentMethod: 'Card',
  paymentStatus: 'pending',
  cardLast4: '1234',
  shipmentCost: 'USD 1471.00',
  shippingCost: 'USD 1471.00',
  shippingPaid: false,
  clearanceCost: 'USD 1704.04',
  amountPaid: 'USD 0.00',
  subtotal: 'USD 3175.04',
  tax: 'USD 0.00',
  discountAmount: 'USD 0.00',
  totalAmount: 'USD 3175.04',
  dateCreated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  senderName: 'Paul Plumber',
  senderPhone: '+1 (614) 555-0123',
  senderEmail: 'paul@example.com',
  senderAddress: '1450 Industrial Parkway',
  senderCity: 'Columbus',
  senderState: 'Ohio',
  senderPostalCode: '43004',
  senderCountry: 'USA',
  receiverName: 'Tammy Baker',
  receiverPhone: '+1 (239) 746-8728',
  receiverEmail: 'tammy@example.com',
  receiverAddress: '17881 North Tamiami Trl #21',
  receiverCity: 'North Fort Myers',
  receiverState: 'Florida',
  receiverPostalCode: '33903',
  receiverCountry: 'USA',
  receiverDestination: 'North Fort Myers, Florida',
  senderOrigin: 'Columbus, Ohio, USA',
  packageDescription: 'Electronics and furniture',
  parcelType: 'Box',
  numberOfPackages: 2,
  weight: '22 kg',
  dimensions: '45 x 30 x 25 cm',
  declaredValue: 'USD 4,500.00',
  handlingType: 'Express',
  pickupDate: 'May 26, 2026',
  deliveryDate: 'May 28, 2026',
  deliverySpeed: 'Express',
  deliveryMethod: 'Air',
  baseShippingFee: 'USD 1,000.00',
  weightCharges: 'USD 350.00',
  distanceCharges: 'USD 200.00',
  serviceCharges: 'USD 150.00',
  insuranceFee: 'USD 80.00',
  customsTax: 'USD 200.00',
  discounts: 'USD 0.00',
  promoCode: 'N/A',
  corporateDiscount: 'USD 0.00',
  loyaltyDiscount: 'USD 0.00',
  notes: 'Handle with care. Fragile electronics inside.',
  parcelItems: [
    {
      quantity: 1,
      product_name: 'Electronics',
      status: 'processing',
      description: 'Premium laptop and accessories',
      shipping_cost: 970,
      clearance_cost: 1120.04,
      total_cost: 2090.04,
    },
    {
      quantity: 1,
      product_name: 'Furniture',
      status: 'processing',
      description: 'Compact office desk',
      shipping_cost: 501,
      clearance_cost: 584,
      total_cost: 1085,
    }
  ]
}

const formatCurrency = (value: string | number | null | undefined) => {
  if (value === undefined || value === null || value === '') return 'USD 0.00'
  if (typeof value === 'number') return `USD ${value.toFixed(2)}`
  if (typeof value === 'string' && value.trim().startsWith('USD')) return value
  const numeric = Number(String(value).replace(/[^0-9.-]+/g, ''))
  return Number.isNaN(numeric) ? 'USD 0.00' : `USD ${numeric.toFixed(2)}`
}

const mapInvoiceData = (raw: any): InvoiceData => ({
  trackingNumber: raw.tracking_id || raw.orderId || raw.trackingNumber || raw.order_id || 'ZG-1097-ZAKIMTEO',
  orderId: raw.order_id || raw.orderId || raw.tracking_id || raw.trackingNumber || 'ZG-1097-ZAKIMTEO',
  bookingMode: raw.booking_mode || raw.bookingMode || 'ToPay',
  status: raw.status || raw.payment_status || 'processing',
  paymentMethod: raw.payment_method || raw.paymentMethod || 'Card',
  paymentStatus: raw.payment_status || raw.paymentStatus || 'pending',
  cardLast4: raw.card_last4 || raw.cardLast4 || '',
  shipmentCost: raw.shipment_cost ? formatCurrency(raw.shipment_cost)
    : raw.shipmentCost ? raw.shipmentCost
    : raw.shipping_cost ? formatCurrency(raw.shipping_cost)
    : raw.shippingCost || 'USD 1471.00',
  shippingCost: raw.shipment_cost ? formatCurrency(raw.shipment_cost)
    : raw.shipping_cost ? formatCurrency(raw.shipping_cost)
    : raw.shippingCost || 'USD 1471.00',
  clearanceCost: raw.clearance_cost ? formatCurrency(raw.clearance_cost) : raw.clearanceCost || 'USD 1704.04',
  amountPaid: raw.amount_paid ? formatCurrency(raw.amount_paid) : raw.amountPaid || 'USD 0.00',
  totalAmount: raw.total_amount ? formatCurrency(raw.total_amount) : raw.totalAmount || 'USD 3175.04',
  dateCreated: raw.created_at
    ? new Date(raw.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : raw.receiptDate || raw.dateCreated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  senderName: raw.sender_name || raw.senderName || raw.sender?.name || 'Paul Plumber',
  senderAddress: [raw.sender_address || raw.sender?.address, raw.sender_city || raw.sender?.city, raw.sender_state || raw.sender?.state, raw.sender_country || raw.sender?.country]
    .filter(Boolean).join(', ') || 'London, UK',
  senderOrigin: [raw.sender_city || raw.sender?.city, raw.sender_state || raw.sender?.state, raw.sender_country || raw.sender?.country]
    .filter(Boolean).join(', ') || 'London',
  receiverName: raw.recipient_name || raw.receiverName || raw.recipient?.name || 'Tammy Baker',
  receiverEmail: raw.recipient_email || raw.receiverEmail || raw.recipient?.email || 'tammy@example.com',
  receiverPhone: raw.recipient_phone || raw.receiverPhone || raw.recipient?.phone || '+1 (239) 746-8728',
  receiverAddress: [raw.recipient_address || raw.recipient?.address, raw.recipient_city || raw.recipient?.city, raw.recipient_state || raw.recipient?.state, raw.recipient_country || raw.recipient?.country]
    .filter(Boolean).join(', ') || '17881 North Tamiami Trl #21 North Fort Myers Florida 33903',
  receiverDestination: [raw.recipient_city || raw.recipient?.city, raw.recipient_state || raw.recipient?.state, raw.recipient_country || raw.recipient?.country]
    .filter(Boolean).join(', ') || 'North Fort Myers, Florida',
  senderPhone: raw.sender_phone || raw.senderPhone || raw.sender?.phone || '+1 (614) 555-0123',
  senderEmail: raw.sender_email || raw.senderEmail || raw.sender?.email || 'paul@example.com',
  senderCity: raw.sender_city || raw.sender?.city || 'Columbus',
  senderState: raw.sender_state || raw.sender?.state || 'Ohio',
  senderPostalCode: raw.sender_zip || raw.sender?.zip || '43004',
  senderCountry: raw.sender_country || raw.sender?.country || 'USA',
  receiverCity: raw.recipient_city || raw.recipient?.city || 'North Fort Myers',
  receiverState: raw.recipient_state || raw.recipient?.state || 'Florida',
  receiverPostalCode: raw.recipient_zip || raw.recipient?.zip || '33903',
  receiverCountry: raw.recipient_country || raw.recipient?.country || 'USA',
  packageDescription: raw.description || raw.package_description || raw.packageDescription || 'Electronics and furniture',
  shippingMethod: raw.shipping_method || raw.deliveryMethod || raw.shipment_method || 'Air',
  serviceType: raw.service_type || raw.serviceType || 'Express',
  dispatchDate: raw.dispatch_date || raw.ship_date || raw.pickup_date || '',
  estimatedDeliveryDate: raw.estimated_delivery || raw.delivery_date || '',
  originLocation: raw.origin_location || raw.origin || [raw.sender_city || raw.sender?.city, raw.sender_state || raw.sender?.state, raw.sender_country || raw.sender?.country].filter(Boolean).join(', ') || 'Los Angeles, CA, USA',
  destinationLocation: raw.destination_location || raw.destination || [raw.recipient_city || raw.recipient?.city, raw.recipient_state || raw.recipient?.state, raw.recipient_country || raw.recipient?.country].filter(Boolean).join(', ') || 'New York, NY, USA',
  parcelType: raw.parcel_type || raw.package_type || raw.parcelType || 'Box',
  numberOfPackages: raw.quantity || raw.qty || 2,
  weight: raw.weight ? `${raw.weight} ${raw.weight_unit || raw.weightUnit || 'kg'}` : '—',
  dimensions: raw.dimensions || '45 x 30 x 25 cm',
  declaredValue: raw.declared_value || raw.declaredValue || 'USD 4,500.00',
  handlingType: raw.handling_type || raw.handlingType || raw.priority || 'Express',
  pickupDate: raw.pickup_date || raw.ship_date || '',
  deliveryDate: raw.delivery_date || raw.estimated_delivery || '',
  deliverySpeed: raw.delivery_speed || raw.deliverySpeed || raw.service_type || 'Express',
  deliveryMethod: raw.delivery_method || raw.deliveryMethod || 'Air',
  baseShippingFee: raw.base_shipping_fee || raw.baseShippingFee || 'USD 1,000.00',
  weightCharges: raw.weight_charges || raw.weightCharges || 'USD 350.00',
  distanceCharges: raw.distance_charges || raw.distanceCharges || 'USD 200.00',
  serviceCharges: raw.service_charges || raw.serviceCharges || 'USD 150.00',
  insuranceFee: raw.insurance || raw.insuranceFee || 'USD 80.00',
  customsTax: raw.customs_tax || raw.customsTax || 'USD 200.00',
  discounts: raw.discounts || raw.discount || 'USD 0.00',
  promoCode: raw.promo_code || raw.promoCode || 'N/A',
  corporateDiscount: raw.corporate_discount || raw.corporateDiscount || 'USD 0.00',
  loyaltyDiscount: raw.loyalty_discount || raw.loyaltyDiscount || 'USD 0.00',
  subtotal: raw.subtotal || raw.subtotal_amount || raw.total_amount || 'USD 3175.04',
  tax: raw.tax || raw.tax_amount || 'USD 0.00',
  discountAmount: raw.discount_amount || raw.discountAmount || 'USD 0.00',
  shipmentId: raw.id || raw.shipment_id || 'SH-20260526-001',
  createdBy: raw.created_by_name || raw.created_by || 'Admin User',
  branchLocation: raw.branch_location || raw.branch || 'Los Angeles Branch',
  notes: raw.notes || raw.remarks || 'Handle with care. Fragile electronics inside.',
  parcelItems: Array.isArray(raw.parcel_items)
    ? raw.parcel_items
    : Array.isArray(raw.parcelItems)
      ? raw.parcelItems
      : raw.parcel_items || raw.parcelItems || []
})

export default function InvoicePage() {
  const router = useRouter()
  const [data, setData] = useState<InvoiceData>(initialInvoiceData)
  const [loading, setLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const getTrackingClient = () => {
    const customerToken = Cookies.get('msc_customer_token')
    const adminToken = Cookies.get('msc_admin_token')
    if (customerToken) return customerApi
    if (adminToken) return api
    return api
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('msc_admin_invoice_data') || window.localStorage.getItem('msc_admin_receipt_data')
      if (stored) {
        try {
          setData((prev) => ({ ...prev, ...mapInvoiceData(JSON.parse(stored)) }))
        } catch (err) {
          console.error('Failed to parse stored invoice data', err)
        }
      }
    }

    const params = new URLSearchParams(window.location.search)
    const tracking = params.get('tracking')
    if (!tracking) return

    const client = getTrackingClient()
    setLoading(true)

    client.get(`/shipments/track/${encodeURIComponent(tracking)}`)
      .then((res: any) => {
        const shipment = res.data?.shipment || {}
        let parcelItems: InvoiceParcelItem[] = []

        if (shipment.parcel_items) {
          try {
            parcelItems = typeof shipment.parcel_items === 'string'
              ? JSON.parse(shipment.parcel_items)
              : shipment.parcel_items
          } catch (err) {
            parcelItems = []
          }
        }

        if (!parcelItems.length && shipment.description) {
          parcelItems = [
            {
              quantity: shipment.quantity || 1,
              product_name: shipment.package_type || 'Shipment',
              status: shipment.status || 'processing',
              description: shipment.description,
              shipping_cost: shipment.shipment_cost || shipment.shipping_cost || shipment.total_amount || 0,
              total_cost: shipment.total_amount || shipment.shipment_cost || shipment.shipping_cost || 0,
            }
          ]
        }

        setData((prev) => ({
          ...prev,
          trackingNumber: shipment.tracking_id || prev.trackingNumber,
          orderId: shipment.order_id || shipment.tracking_id || prev.orderId,
          bookingMode: shipment.booking_mode || prev.bookingMode,
          status: shipment.status || prev.status,
          paymentMethod: shipment.payment_method || prev.paymentMethod,
          paymentStatus: shipment.payment_status || prev.paymentStatus,
          cardLast4: shipment.card_last4 || prev.cardLast4,
          shipmentCost: shipment.shipment_cost ? formatCurrency(shipment.shipment_cost) : shipment.total_amount ? formatCurrency(shipment.total_amount) : prev.shipmentCost,
          shippingCost: shipment.shipment_cost ? formatCurrency(shipment.shipment_cost) : shipment.shipping_cost ? formatCurrency(shipment.shipping_cost) : prev.shippingCost,
          shippingPaid: shipment.shipping_paid || prev.shippingPaid,
          amountPaid: shipment.amount_paid ? formatCurrency(shipment.amount_paid) : prev.amountPaid,
          totalAmount: shipment.total_amount ? formatCurrency(shipment.total_amount) : prev.totalAmount,
          dateCreated: shipment.created_at
            ? new Date(shipment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : prev.dateCreated,
          senderName: shipment.sender_name || prev.senderName,
          senderAddress: [shipment.sender_address, shipment.sender_city, shipment.sender_state, shipment.sender_country]
            .filter(Boolean).join(', ') || prev.senderAddress,
          senderOrigin: [shipment.sender_city, shipment.sender_state, shipment.sender_country].filter(Boolean).join(', ') || prev.senderOrigin,
          receiverName: shipment.recipient_name || prev.receiverName,
          receiverEmail: shipment.recipient_email || prev.receiverEmail,
          receiverPhone: shipment.recipient_phone || prev.receiverPhone,
          receiverAddress: [shipment.recipient_address, shipment.recipient_city, shipment.recipient_state, shipment.recipient_country]
            .filter(Boolean).join(', ') || prev.receiverAddress,
          receiverDestination: [shipment.recipient_city, shipment.recipient_state, shipment.recipient_country]
            .filter(Boolean).join(', ') || prev.receiverDestination,
          packageDescription: shipment.description || prev.packageDescription,
          numberOfPackages: shipment.quantity || prev.numberOfPackages,
          parcelItems,
        }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

    return (
      <>
        <Navbar />
        <main className="bg-slate-100 py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col items-end gap-4 sm:flex-row sm:justify-between">
              <div />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/admin/shipments')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Back to shipments
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (data.trackingNumber) {
                      window.location.href = `/receipt?tracking=${encodeURIComponent(data.trackingNumber)}`
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  View receipt
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsExporting(true)
                    try {
                      const html2pdfModule = await import('html2pdf.js')
                      const html2pdf = html2pdfModule.default ?? html2pdfModule
                      const element = document.getElementById('invoice-document')
                      if (!element) return
                      const opt = {
                        margin: 0.3,
                        filename: `Invoice_${data.trackingNumber}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                      } as const
                      await html2pdf().set(opt).from(element).save()
                    } catch (err) {
                      console.error('Export failed', err)
                      alert('Unable to export PDF. Ensure html2pdf.js is available.')
                    } finally {
                      setIsExporting(false)
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  disabled={isExporting}
                >
                  {isExporting ? 'Exporting…' : 'Export PDF'}
                </button>
              </div>
            </div>

            <div id="invoice-document" className="relative overflow-hidden rounded-[28px] border border-slate-300 bg-white py-10">
              <div className="mx-auto max-w-4xl px-6">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-600">Official Receipt</p>
                  <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">ZGG Shipping Logistics</h1>
                  <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-600">Global Logistics Solutions</p>
                  <div className="mt-6 flex items-center justify-center">
                    <Barcode tracking={data.trackingNumber} />
                  </div>
                </div>

                <div className="mt-8 grid gap-6 rounded-3xl border border-slate-300 bg-slate-50 px-6 py-6 text-sm text-slate-800 sm:grid-cols-[1.4fr_0.9fr]">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600">Tracking No</p>
                      <p className="mt-1 text-base font-semibold text-slate-950">{data.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600">Order ID</p>
                      <p className="mt-1 text-base font-semibold text-slate-950">{data.orderId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600">Booking Mode</p>
                      <p className="mt-1 text-base font-semibold text-slate-950">{data.bookingMode}</p>
                    </div>
                  </div>
                  <div className="space-y-3 border-l border-slate-300 pl-6 sm:border-l sm:pl-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600">Verification</p>
                      <p className="mt-1 inline-flex rounded-full border border-slate-700/30 bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-950">Verified</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600">Status</p>
                      <p className="mt-1 text-base font-semibold text-slate-950 capitalize">{data.status || 'Confirmed'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600">Receipt Date</p>
                      <p className="mt-1 text-base font-semibold text-slate-950">{data.dateCreated}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
                  <div className="rounded-3xl border border-slate-300 bg-white p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-600">Sender Information</p>
                    <div className="mt-5 space-y-3 text-slate-900">
                      <p className="font-semibold text-base">{data.senderName}</p>
                      <p className="text-sm">{data.senderAddress}</p>
                      <p className="text-sm text-slate-600">{data.senderOrigin}</p>
                      {data.senderEmail && <p className="text-sm text-slate-600">Email: {data.senderEmail}</p>}
                      {data.senderPhone && <p className="text-sm text-slate-600">Phone: {data.senderPhone}</p>}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-300 bg-white p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-600">Receiver Information</p>
                    <div className="mt-5 space-y-3 text-slate-900">
                      <p className="font-semibold text-base">{data.receiverName}</p>
                      <p className="text-sm">{data.receiverAddress}</p>
                      <p className="text-sm text-slate-600">{data.receiverDestination}</p>
                      {data.receiverEmail && <p className="text-sm text-slate-600">Email: {data.receiverEmail}</p>}
                      {data.receiverPhone && <p className="text-sm text-slate-600">Phone: {data.receiverPhone}</p>}
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-slate-300 bg-slate-50 p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-700 font-semibold">Shipment Summary</p>
                    <div className="mt-5 grid gap-3 text-sm text-slate-700">
                      <div className="flex justify-between">
                        <span>Origin</span>
                        <span className="font-semibold text-slate-950">{data.originLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Destination</span>
                        <span className="font-semibold text-slate-950">{data.destinationLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Level</span>
                        <span className="font-semibold text-slate-950">{data.serviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carrier Method</span>
                        <span className="font-semibold text-slate-950">{data.deliveryMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Package Type</span>
                        <span className="font-semibold text-slate-950">{data.parcelType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Packages</span>
                        <span className="font-semibold text-slate-950">{data.numberOfPackages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight</span>
                        <span className="font-semibold text-slate-950">{data.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimensions</span>
                        <span className="font-semibold text-slate-950">{data.dimensions}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-300 bg-white p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-700 font-semibold">Delivery Details</p>
                    <div className="mt-5 grid gap-3 text-sm text-slate-700">
                      <div className="flex justify-between">
                        <span>Dispatch Date</span>
                        <span className="font-semibold text-slate-950">{data.dispatchDate || data.pickupDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Delivery</span>
                        <span className="font-semibold text-slate-950">{data.estimatedDeliveryDate || data.deliveryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Speed</span>
                        <span className="font-semibold text-slate-950">{data.deliverySpeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Booking Mode</span>
                        <span className="font-semibold text-slate-950">{data.bookingMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Status</span>
                        <span className="font-semibold text-slate-950">{data.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 rounded-3xl border border-slate-300 bg-white p-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h2 className="text-sm uppercase tracking-[0.35em] text-slate-700 font-semibold">Parcel Details & Costs</h2>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Page 1 of 2</p>
                  </div>

                  <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900">
                          <th className="border border-slate-300 px-3 py-3 text-left font-semibold uppercase tracking-[0.25em]">QTY</th>
                          <th className="border border-slate-300 px-3 py-3 text-left font-semibold uppercase tracking-[0.25em]">Product</th>
                          <th className="border border-slate-300 px-3 py-3 text-left font-semibold uppercase tracking-[0.25em]">Status</th>
                          <th className="border border-slate-300 px-3 py-3 text-left font-semibold uppercase tracking-[0.25em]">Description</th>
                          <th className="border border-slate-300 px-3 py-3 text-right font-semibold uppercase tracking-[0.25em]">Shipping Cost</th>
                          <th className="border border-slate-300 px-3 py-3 text-right font-semibold uppercase tracking-[0.25em]">Clearance Cost</th>
                          <th className="border border-slate-300 px-3 py-3 text-right font-semibold uppercase tracking-[0.25em]">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.parcelItems.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="border border-slate-300 px-3 py-3 text-left text-slate-900">{item.quantity || item.qty || 1}</td>
                            <td className="border border-slate-300 px-3 py-3 text-left font-semibold text-slate-900">{item.product_name || item.product || 'Package'}</td>
                            <td className="border border-slate-300 px-3 py-3 text-left text-slate-700 capitalize">{item.status || data.status}</td>
                            <td className="border border-slate-300 px-3 py-3 text-left text-slate-700">{item.description || '—'}</td>
                            <td className="border border-slate-300 px-3 py-3 text-right text-slate-900">{formatCurrency(item.shipping_cost || item.shippingCost)}</td>
                            <td className="border border-slate-300 px-3 py-3 text-right text-slate-900">{formatCurrency(item.clearance_cost || item.clearanceCost)}</td>
                            <td className="border border-slate-300 px-3 py-3 text-right font-semibold text-slate-950">{formatCurrency(item.total_cost || item.totalCost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-slate-300 bg-slate-50 p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-700 font-semibold">Payment Summary</p>
                    <div className="mt-5 grid gap-3">
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Base Shipping Fee</span>
                        <span className="font-semibold text-slate-950">{data.baseShippingFee}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Weight Charges</span>
                        <span className="font-semibold text-slate-950">{data.weightCharges}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Distance Charges</span>
                        <span className="font-semibold text-slate-950">{data.distanceCharges}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Service Charges</span>
                        <span className="font-semibold text-slate-950">{data.serviceCharges}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Insurance Fee</span>
                        <span className="font-semibold text-slate-950">{data.insuranceFee}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Customs Tax</span>
                        <span className="font-semibold text-slate-950">{data.customsTax}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Discounts</span>
                        <span className="font-semibold text-slate-950">{data.discounts}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Promotional Code</span>
                        <span className="font-semibold text-slate-950">{data.promoCode}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Loyalty Discount</span>
                        <span className="font-semibold text-slate-950">{data.loyaltyDiscount}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-950">{data.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Tax</span>
                        <span className="font-semibold text-slate-950">{data.tax}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Total Amount</span>
                        <span className="font-semibold text-slate-950">{data.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Payment Method</span>
                        <span className="font-semibold text-slate-950">{data.paymentMethod || 'Cash on Delivery'}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Payment Status</span>
                        <span className="font-semibold text-slate-950 uppercase">{data.paymentStatus || 'To Pay on Delivery'}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Paid Amount</span>
                        <span className="font-semibold text-slate-950">{data.amountPaid}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative rounded-3xl border border-slate-300 bg-white p-6">
                      <div className="absolute -right-8 top-10 h-36 w-36 rounded-full border border-slate-300/50 opacity-30" />
                      <div className="relative z-10 grid h-full place-items-center">
                        <div className="rounded-full border-2 border-slate-900/90 bg-white/90 p-6 text-center text-slate-950 shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
                          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-700">Verified & Approved</p>
                          <p className="mt-3 text-2xl font-black uppercase tracking-tight">Official Stamp</p>
                          <p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-slate-700">Stamp Duty</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-300 bg-slate-50 p-6">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-700 font-semibold">Admin & Branch</p>
                      <div className="mt-5 text-sm text-slate-700">
                        <div className="flex justify-between gap-4">
                          <span>Created By</span>
                          <span className="font-semibold text-slate-950">{data.createdBy}</span>
                        </div>
                        <div className="flex justify-between gap-4 mt-2">
                          <span>Branch</span>
                          <span className="font-semibold text-slate-950">{data.branchLocation}</span>
                        </div>
                        <div className="flex justify-between gap-4 mt-2">
                          <span>Shipment ID</span>
                          <span className="font-semibold text-slate-950">{data.shipmentId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-3xl border border-slate-300 bg-slate-50 p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-700 font-semibold">Digital Verification</p>
                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-700/50 bg-white text-xs uppercase tracking-[0.25em] text-slate-900">QR CODE</div>
                      <div className="text-sm text-slate-700">
                        <p className="font-semibold text-slate-950">Scan this QR code to verify this receipt authenticity.</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-600">Digital verification</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-300 bg-white p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-700 font-semibold">Notes</p>
                    <p className="mt-4 text-sm text-slate-700">This document is an official shipping invoice issued by ZGG Shipping Logistics for the shipment listed above.</p>
                  </div>
                </div>

                <div className="mt-10 border-t border-slate-300 pt-6 text-center text-sm text-slate-600">
                  <p className="font-medium text-slate-900">Thank You For Choosing ZGG Shipping Logistics</p>
                  <p className="mt-2">We appreciate your business and look forward to delivering your package safely.</p>
                  <p className="mt-2 uppercase tracking-[0.2em]">Receipt generated on {data.dateCreated}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }
