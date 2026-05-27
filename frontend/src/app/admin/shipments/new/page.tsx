'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Country, State, City } from 'country-state-city'

const emptyForm = {
  sender_name: '',
  sender_email: '',
  sender_phone: '',
  sender_address: '',
  sender_country: 'USA',
  sender_state: 'OH',
  sender_city: '',
  sender_postal_code: '',
  recipient_name: '',
  recipient_email: '',
  recipient_phone: '',
  recipient_address: '',
  recipient_country: 'USA',
  recipient_state: 'OH',
  recipient_city: '',
  recipient_postal_code: '',
  order_id: '',
  tracking_number: '',
  booking_mode: 'ToPay',
  shipment_cost: '',
  clearance_cost: '',
  total_amount: '',
  amount_paid: '',
  payment_status: 'pending',
  payment_method: 'Card',
  currency: 'USD',
  parcel_quantity: '1',
  parcel_product: '',
  parcel_status: 'processing',
  parcel_description: '',
  parcel_shipping_cost: '',
  parcel_total_cost: '',
  description: '',
  weight: '',
  weight_unit: 'lbs',
  dimensions: '',
  package_type: 'box',
  declared_value: '',
  service_type: 'standard',
  status: 'processing',
  priority: 'normal',
  ship_date: '',
  estimated_delivery: '',
  current_location: 'Columbus, Ohio',
  notes: '',
  admin_notes: '',
}

export default function CreateShipmentPage() {
  const router = useRouter()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [countries, setCountries] = useState<{ name: string; isoCode: string }[]>([])
  const [senderStates, setSenderStates] = useState<{ name: string; isoCode: string }[]>([])
  const [senderCities, setSenderCities] = useState<{ name: string; countryCode?: string; stateCode?: string }[]>([])
  const [recipientStates, setRecipientStates] = useState<{ name: string; isoCode: string }[]>([])
  const [recipientCities, setRecipientCities] = useState<{ name: string; countryCode?: string; stateCode?: string }[]>([])
  const [parcelItems, setParcelItems] = useState([
    {
      qty: '1',
      product: '',
      status: 'order_confirmed',
      description: '',
      parcel_shipping_cost: '0',
      parcel_clearance_cost: '0',
      parcel_total_cost: '0',
    },
  ])
  const postalCodeLookup: Record<string, string> = {
    'US-OH-Columbus': '43004',
    'US-FL-North Fort Myers': '33903',
    'US-CA-Los Angeles': '90001',
    'US-NY-New York': '10001',
    'GB-LND-London': 'EC1A',
    'CA-ON-Toronto': 'M5H',
  }

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  useEffect(() => {
    const allCountries = Country.getAllCountries() || []
    setCountries(allCountries)

    const initialSenderStates = State.getStatesOfCountry(emptyForm.sender_country) || []
    const initialRecipientStates = State.getStatesOfCountry(emptyForm.recipient_country) || []
    setSenderStates(initialSenderStates)
    setRecipientStates(initialRecipientStates)

    const initialSenderCities = initialSenderStates.length
      ? City.getCitiesOfState(emptyForm.sender_country, initialSenderStates[0].isoCode) || []
      : []
    const initialRecipientCities = initialRecipientStates.length
      ? City.getCitiesOfState(emptyForm.recipient_country, initialRecipientStates[0].isoCode) || []
      : []
    setSenderCities(initialSenderCities)
    setRecipientCities(initialRecipientCities)
  }, [])

  const generateTrackingNumber = () => `ZG-${Math.floor(100000000 + Math.random() * 900000000)}`

  useEffect(() => {
    if (!form.tracking_number) {
      setForm((current) => ({ ...current, tracking_number: generateTrackingNumber() }))
    }
  }, [form.tracking_number])

  useEffect(() => {
    if (!form.tracking_number) return

    const renderBarcode = async () => {
      const JsBarcodeModule = await import('jsbarcode')
      const JsBarcode = JsBarcodeModule.default ?? JsBarcodeModule
      const svg = document.querySelector('#barcode')
      if (svg) {
        JsBarcode(svg, form.tracking_number, {
          format: 'CODE128',
          lineColor: '#000',
          width: 2,
          height: 50,
          displayValue: true,
        })
      }
    }

    renderBarcode()
  }, [form.tracking_number])

  const scrollToForm = () => {
    const el = document.getElementById('create-shipment-form')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSenderCountryChange = (value: string) => {
    const states = State.getStatesOfCountry(value) || []
    const selectedState = states[0]?.isoCode || ''
    const cities = selectedState ? City.getCitiesOfState(value, selectedState) || [] : []
    setSenderStates(states)
    setSenderCities(cities)
    setForm((current) => ({
      ...current,
      sender_country: value,
      sender_state: selectedState,
      sender_city: cities[0]?.name || '',
    }))
  }

  const handleSenderStateChange = (value: string) => {
    const cities = City.getCitiesOfState(form.sender_country, value) || []
    const cityName = cities[0]?.name || ''
    const postalKey = `${form.sender_country}-${value}-${cityName}`
    setSenderCities(cities)
    setForm((current) => ({
      ...current,
      sender_state: value,
      sender_city: cityName,
      sender_postal_code: postalCodeLookup[postalKey] || current.sender_postal_code,
    }))
  }

  const handleSenderCityChange = (value: string) => {
    const postalKey = `${form.sender_country}-${form.sender_state}-${value}`
    setForm((current) => ({
      ...current,
      sender_city: value,
      sender_postal_code: postalCodeLookup[postalKey] || current.sender_postal_code,
    }))
  }

  const handleRecipientCountryChange = (value: string) => {
    const states = State.getStatesOfCountry(value) || []
    const selectedState = states[0]?.isoCode || ''
    const cities = selectedState ? City.getCitiesOfState(value, selectedState) || [] : []
    setRecipientStates(states)
    setRecipientCities(cities)
    setForm((current) => ({
      ...current,
      recipient_country: value,
      recipient_state: selectedState,
      recipient_city: cities[0]?.name || '',
    }))
  }

  const handleRecipientStateChange = (value: string) => {
    const cities = City.getCitiesOfState(form.recipient_country, value) || []
    const cityName = cities[0]?.name || ''
    const postalKey = `${form.recipient_country}-${value}-${cityName}`
    setRecipientCities(cities)
    setForm((current) => ({
      ...current,
      recipient_state: value,
      recipient_city: cityName,
      recipient_postal_code: postalCodeLookup[postalKey] || current.recipient_postal_code,
    }))
  }

  const handleRecipientCityChange = (value: string) => {
    const postalKey = `${form.recipient_country}-${form.recipient_state}-${value}`
    setForm((current) => ({
      ...current,
      recipient_city: value,
      recipient_postal_code: postalCodeLookup[postalKey] || current.recipient_postal_code,
    }))
  }

  const computeTotalAmount = (shipmentCost: number, clearanceCost: number) => {
    return (shipmentCost + clearanceCost).toFixed(2)
  }

  const handleShipmentCostChange = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, '')
    const shipmentCost = parseFloat(numeric || '0')
    const clearance = parseFloat(form.clearance_cost || '0')
    setForm((current) => ({
      ...current,
      shipment_cost: numeric,
      total_amount: computeTotalAmount(shipmentCost, clearance),
    }))
  }

  const handleClearanceCostChange = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, '')
    const shipmentCost = parseFloat(form.shipment_cost || '0')
    const clearance = parseFloat(numeric || '0')
    const totalAmount = computeTotalAmount(shipmentCost, clearance)

    setForm((current) => ({
      ...current,
      clearance_cost: numeric,
      total_amount: totalAmount,
    }))
  }

  const handlePaymentStatusChange = (value: string) => {
    setForm((current) => ({
      ...current,
      payment_status: value,
    }))
  }

  const handleCurrencyChange = (value: string) => {
    setForm((current) => ({
      ...current,
      currency: value,
    }))
  }

  const calculateParcelTotal = (parcel: {
    qty: string
    parcel_shipping_cost: string
    parcel_clearance_cost: string
  }) => {
    const q = parseFloat(parcel.qty || '0')
    const shipping = parseFloat(parcel.parcel_shipping_cost || '0')
    const clearance = parseFloat(parcel.parcel_clearance_cost || '0')
    return ((q * (shipping + clearance)) || 0).toFixed(2)
  }

  const updateParcelItem = (index: number, field: string, value: string) => {
    setParcelItems((current) =>
      current.map((item, idx) => {
        if (idx !== index) return item
        const updatedItem = { ...item, [field]: value }
        if (['qty', 'parcel_shipping_cost', 'parcel_clearance_cost'].includes(field)) {
          updatedItem.parcel_total_cost = calculateParcelTotal(updatedItem)
        }
        return updatedItem
      })
    )
  }

  const addParcelItem = () => {
    setParcelItems((current) => [
      ...current,
      {
        qty: '1',
        product: '',
        status: 'order_confirmed',
        description: '',
        parcel_shipping_cost: '0',
        parcel_clearance_cost: '0',
        parcel_total_cost: '0',
      },
    ])
  }

  const removeParcelItem = (index: number) => {
    setParcelItems((current) => current.filter((_, idx) => idx !== index))
  }

  const parcelQuantityTotal = parcelItems.reduce((sum, item) => sum + (parseFloat(item.qty || '0') || 0), 0)
  const parcelTotalCost = parcelItems.reduce((sum, item) => sum + (parseFloat(item.parcel_total_cost || '0') || 0), 0).toFixed(2)
  const parcelShippingTotal = parcelItems.reduce((sum, item) => sum + ((parseFloat(item.parcel_shipping_cost || '0') || 0) * (parseFloat(item.qty || '0') || 0)), 0).toFixed(2)

  const formatMoney = (value: number | string) => {
    const amount = typeof value === 'string' ? parseFloat(value || '0') : value || 0
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const parsedTotalAmount = parseFloat(form.total_amount || '0')
  const parsedAmountPaid = parseFloat(form.amount_paid || '0')
  const balanceDue = Math.max(0, parsedTotalAmount - parsedAmountPaid)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        ...form,
        weight: form.weight ? Number(form.weight) : null,
        declared_value: form.declared_value ? Number(form.declared_value) : null,
        shipment_cost: form.shipment_cost ? Number(form.shipment_cost) : null,
        clearance_cost: form.clearance_cost ? Number(form.clearance_cost) : null,
        total_amount: form.total_amount ? Number(form.total_amount) : null,
        amount_paid: form.amount_paid ? Number(form.amount_paid) : null,
        shipping_cost: form.shipment_cost ? Number(form.shipment_cost) : null,
        parcel_quantity: form.parcel_quantity ? Number(form.parcel_quantity) : null,
        payment_method: form.payment_method || 'Card',
        parcel_items: parcelItems.map((item) => ({
          ...item,
          qty: Number(item.qty),
          parcel_shipping_cost: Number(item.parcel_shipping_cost),
          parcel_clearance_cost: Number(item.parcel_clearance_cost),
          parcel_total_cost: Number(item.parcel_total_cost),
        })),
        sender_zip: form.sender_postal_code,
        recipient_zip: form.recipient_postal_code,
      }

      const response = await api.post('/shipments', payload)
      const trackingId = response.data?.tracking_id
      const returnedOrderId = response.data?.order_id

      if (typeof window !== 'undefined' && trackingId) {
        const receiptPayload = {
          ...payload,
          tracking_id: trackingId,
          order_id: returnedOrderId || payload.order_id || '',
          receiptDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        }

        const invoicePayload = {
          ...receiptPayload,
          booking_mode: form.booking_mode,
          payment_method: form.payment_method,
        }

        window.localStorage.setItem('msc_admin_receipt_data', JSON.stringify(receiptPayload))
        window.localStorage.setItem('msc_admin_invoice_data', JSON.stringify(invoicePayload))
      }

      toast.success('Shipment created successfully.')
      if (trackingId) {
        router.push(`/invoice?tracking=${encodeURIComponent(trackingId)}`)
      } else {
        router.push('/admin/shipments')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to create shipment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="section-subtitle">Shipment creation</p>
            <h1 className="section-title text-3xl">Create new shipment</h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Build the shipment record with sender and recipient details, parcel costs, payment status and tracking.
              The summary panel keeps totals, barcode, and parcel counts visible as you work.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={scrollToForm} className="btn-outline">
              Scroll to form
            </button>
            <button type="button" onClick={() => setForm(emptyForm)} className="btn-secondary">
              Reset form
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.7fr_0.95fr]">
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-10">
              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Sender information</h2>
                    <p className="mt-1 text-sm text-slate-600">Where the shipment starts.</p>
                  </div>
                  <div className="text-sm text-slate-500">Required fields marked with *</div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="label">Sender name *</span>
                    <input required value={form.sender_name} onChange={(e) => handleChange('sender_name', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Sender email</span>
                    <input type="email" value={form.sender_email} onChange={(e) => handleChange('sender_email', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Sender phone</span>
                    <input value={form.sender_phone} onChange={(e) => handleChange('sender_phone', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Sender postal code</span>
                    <input value={form.sender_postal_code} onChange={(e) => handleChange('sender_postal_code', e.target.value)} className="input-field" />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="label">Sender address *</span>
                    <input required value={form.sender_address} onChange={(e) => handleChange('sender_address', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Country</span>
                    <select
                      required
                      value={form.sender_country}
                      onChange={(e) => handleSenderCountryChange(e.target.value)}
                      className="input-field"
                    >
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">State</span>
                    <select
                      required
                      value={form.sender_state}
                      onChange={(e) => handleSenderStateChange(e.target.value)}
                      className="input-field"
                      disabled={!senderStates.length}
                    >
                      {senderStates.length ? senderStates.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                      )) : <option value="">No states available</option>}
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">City</span>
                    <select
                      required
                      value={form.sender_city}
                      onChange={(e) => handleSenderCityChange(e.target.value)}
                      className="input-field"
                      disabled={!senderCities.length}
                    >
                      {senderCities.length ? senderCities.map((city) => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      )) : <option value="">No cities available</option>}
                    </select>
                  </label>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Recipient information</h2>
                    <p className="mt-1 text-sm text-slate-600">Where the shipment is delivered.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="label">Recipient name *</span>
                    <input required value={form.recipient_name} onChange={(e) => handleChange('recipient_name', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Recipient email</span>
                    <input type="email" value={form.recipient_email} onChange={(e) => handleChange('recipient_email', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Recipient phone</span>
                    <input value={form.recipient_phone} onChange={(e) => handleChange('recipient_phone', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Recipient postal code</span>
                    <input value={form.recipient_postal_code} onChange={(e) => handleChange('recipient_postal_code', e.target.value)} className="input-field" />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="label">Recipient address *</span>
                    <input required value={form.recipient_address} onChange={(e) => handleChange('recipient_address', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Country</span>
                    <select
                      required
                      value={form.recipient_country}
                      onChange={(e) => handleRecipientCountryChange(e.target.value)}
                      className="input-field"
                    >
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">State</span>
                    <select
                      required
                      value={form.recipient_state}
                      onChange={(e) => handleRecipientStateChange(e.target.value)}
                      className="input-field"
                      disabled={!recipientStates.length}
                    >
                      {recipientStates.length ? recipientStates.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                      )) : <option value="">No states available</option>}
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">City</span>
                    <select
                      required
                      value={form.recipient_city}
                      onChange={(e) => handleRecipientCityChange(e.target.value)}
                      className="input-field"
                      disabled={!recipientCities.length}
                    >
                      {recipientCities.length ? recipientCities.map((city) => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      )) : <option value="">No cities available</option>}
                    </select>
                  </label>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Shipment details</h2>
                    <p className="mt-1 text-sm text-slate-600">Complete the core shipment settings and delivery preferences.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="label">Tracking number</span>
                      <button type="button" onClick={() => setForm((current) => ({ ...current, tracking_number: generateTrackingNumber() }))} className="text-sm font-semibold text-brand-600 hover:text-brand-800">
                        Regenerate
                      </button>
                    </div>
                    <input type="text" value={form.tracking_number} readOnly className="input-field bg-slate-100" />
                  </label>
                  <label className="block">
                    <span className="label">Order ID</span>
                    <input value={form.order_id} onChange={(e) => handleChange('order_id', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Booking mode</span>
                    <select value={form.booking_mode} onChange={(e) => handleChange('booking_mode', e.target.value)} className="input-field">
                      <option value="ToPay">To Pay</option>
                      <option value="Prepaid">Prepaid</option>
                      <option value="CashOnDelivery">Cash on Delivery</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Service type</span>
                    <select value={form.service_type} onChange={(e) => handleChange('service_type', e.target.value)} className="input-field">
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                      <option value="overnight">Overnight</option>
                      <option value="freight">Freight</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Package type</span>
                    <select value={form.package_type} onChange={(e) => handleChange('package_type', e.target.value)} className="input-field">
                      <option value="box">Box</option>
                      <option value="envelope">Envelope</option>
                      <option value="pallet">Pallet</option>
                      <option value="crate">Crate</option>
                      <option value="tube">Tube</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Declared value</span>
                    <input type="number" value={form.declared_value} onChange={(e) => handleChange('declared_value', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Weight</span>
                    <input type="number" value={form.weight} onChange={(e) => handleChange('weight', e.target.value)} className="input-field" placeholder="0" />
                  </label>
                  <label className="block">
                    <span className="label">Weight unit</span>
                    <select value={form.weight_unit} onChange={(e) => handleChange('weight_unit', e.target.value)} className="input-field">
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Dimensions</span>
                    <input value={form.dimensions} onChange={(e) => handleChange('dimensions', e.target.value)} placeholder="e.g. 12x8x6 in" className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Dispatch date</span>
                    <input type="date" value={form.ship_date} onChange={(e) => handleChange('ship_date', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Delivery date</span>
                    <input type="date" value={form.estimated_delivery} onChange={(e) => handleChange('estimated_delivery', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Current location</span>
                    <input value={form.current_location} onChange={(e) => handleChange('current_location', e.target.value)} className="input-field" />
                  </label>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Payment & totals</h2>
                    <p className="mt-1 text-sm text-slate-600">Review the total shipment cost with currency and amount paid.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="label">Currency</span>
                    <select value={form.currency} onChange={(e) => handleCurrencyChange(e.target.value)} className="input-field">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="NGN">NGN</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Payment method</span>
                    <select value={form.payment_method} onChange={(e) => handleChange('payment_method', e.target.value)} className="input-field">
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Wallet">Wallet</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Payment status</span>
                    <select value={form.payment_status} onChange={(e) => handlePaymentStatusChange(e.target.value)} className="input-field">
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="partially_paid">Partially paid</option>
                      <option value="to_pay">To Pay</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Amount paid</span>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-600">{form.currency}</span>
                      <input
                        type="text"
                        value={form.amount_paid}
                        onChange={(e) => handleChange('amount_paid', e.target.value.replace(/[^0-9.]/g, ''))}
                        className="input-field pl-12"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="label">Shipment cost</span>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-600">{form.currency}</span>
                      <input
                        type="text"
                        value={form.shipment_cost}
                        onChange={(e) => handleShipmentCostChange(e.target.value)}
                        className="input-field pl-12"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="label">Clearance cost</span>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-600">{form.currency}</span>
                      <input
                        type="text"
                        value={form.clearance_cost}
                        onChange={(e) => handleClearanceCostChange(e.target.value)}
                        className="input-field pl-12"
                      />
                    </div>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="label">Total amount</span>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-600">{form.currency}</span>
                      <input type="text" value={formatMoney(form.total_amount)} readOnly className="input-field pl-12 bg-slate-100" />
                    </div>
                  </label>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Parcel rows</h2>
                    <p className="mt-1 text-sm text-slate-600">Add and manage each shipment line item.</p>
                  </div>
                </div>
                <div className="mt-5 overflow-x-auto rounded-3xl border border-slate-300 bg-slate-50 p-4">
                  <table id="parcelTable" className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-3 text-left">QTY</th>
                        <th className="border p-3 text-left">Product</th>
                        <th className="border p-3 text-left">Status</th>
                        <th className="border p-3 text-left">Description</th>
                        <th className="border p-3 text-left">Shipping</th>
                        <th className="border p-3 text-left">Clearance</th>
                        <th className="border p-3 text-left">Total</th>
                        <th className="border p-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parcelItems.map((item, index) => (
                        <tr key={index} className="even:bg-slate-100">
                          <td className="border p-2">
                            <input type="number" className="input-field" value={item.qty} min="1" onChange={(e) => updateParcelItem(index, 'qty', e.target.value)} />
                          </td>
                          <td className="border p-2">
                            <input type="text" className="input-field" value={item.product} onChange={(e) => updateParcelItem(index, 'product', e.target.value)} />
                          </td>
                          <td className="border p-2">
                            <select className="input-field" value={item.status} onChange={(e) => updateParcelItem(index, 'status', e.target.value)}>
                              <option value="order_confirmed">Order Confirmed</option>
                              <option value="pending">Pending</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="border p-2">
                            <input type="text" className="input-field" value={item.description} onChange={(e) => updateParcelItem(index, 'description', e.target.value)} />
                          </td>
                          <td className="border p-2">
                            <input type="number" className="input-field" value={item.parcel_shipping_cost} min="0" onChange={(e) => updateParcelItem(index, 'parcel_shipping_cost', e.target.value)} />
                          </td>
                          <td className="border p-2">
                            <input type="number" className="input-field" value={item.parcel_clearance_cost} min="0" onChange={(e) => updateParcelItem(index, 'parcel_clearance_cost', e.target.value)} />
                          </td>
                          <td className="border p-2">
                            <input type="text" className="input-field bg-slate-100" value={item.parcel_total_cost} readOnly />
                          </td>
                          <td className="border p-2">
                            <button type="button" onClick={() => removeParcelItem(index)} className="btn-outline">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4">
                    <button type="button" onClick={addParcelItem} className="btn-outline">Add parcel row</button>
                  </div>
                </div>
              </section>

              <section>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="label">Description</span>
                    <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="input-field min-h-28" />
                  </label>
                  <label className="block">
                    <span className="label">Admin notes</span>
                    <textarea value={form.admin_notes} onChange={(e) => handleChange('admin_notes', e.target.value)} className="input-field min-h-28" />
                  </label>
                </div>
              </section>

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Saving...' : 'Create shipment'}
                </button>
                <button type="button" onClick={() => router.push('/admin/shipments')} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="card p-5 sticky top-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tracking</p>
                  <h2 className="mt-2 text-xl font-bold text-navy-900">{form.tracking_number || 'Pending code'}</h2>
                </div>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase text-brand-700">{form.status.replace('_', ' ')}</span>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <svg id="barcode" className="h-32 w-full" />
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recipient</p>
                  <p className="mt-2 font-semibold text-navy-900">{form.recipient_name || 'No recipient set'}</p>
                  <p className="text-sm text-slate-600">{form.recipient_city || 'City not set'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Sender</p>
                  <p className="mt-2 font-semibold text-navy-900">{form.sender_name || 'No sender set'}</p>
                  <p className="text-sm text-slate-600">{form.sender_city || 'City not set'}</p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Payment summary</p>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipment cost</span>
                  <span>{form.currency} {formatMoney(form.shipment_cost)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Clearance cost</span>
                  <span>{form.currency} {formatMoney(form.clearance_cost)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Total amount</span>
                  <span className="font-semibold text-slate-950">{form.currency} {formatMoney(parsedTotalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Paid</span>
                  <span className="font-semibold text-slate-950">{form.currency} {formatMoney(parsedAmountPaid)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-sm">
                  <span className="font-semibold">Balance due</span>
                  <span className="font-semibold">{form.currency} {formatMoney(balanceDue)}</span>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Parcel summary</p>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Parcel rows</span>
                  <span>{parcelItems.length}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Total quantity</span>
                  <span>{parcelQuantityTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping total</span>
                  <span>{form.currency} {formatMoney(parcelShippingTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span className="font-semibold">Parcel total</span>
                  <span className="font-semibold text-slate-950">{form.currency} {formatMoney(parcelTotalCost)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  )
}
