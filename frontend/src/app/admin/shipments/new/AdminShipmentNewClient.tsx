'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const localCountryData: {
  countries: { name: string; isoCode: string }[]
  states: Record<string, { name: string; isoCode: string }[]>
  cities: Record<string, { name: string }[]>
} = {
  countries: [
    { name: 'United States', isoCode: 'USA' },
    { name: 'Canada', isoCode: 'CAN' },
    { name: 'United Kingdom', isoCode: 'GBR' },
  ],
  states: {
    USA: [
      { name: 'Ohio', isoCode: 'OH' },
      { name: 'Florida', isoCode: 'FL' },
      { name: 'California', isoCode: 'CA' },
      { name: 'New York', isoCode: 'NY' },
    ],
    CAN: [{ name: 'Ontario', isoCode: 'ON' }],
    GBR: [{ name: 'London', isoCode: 'LND' }],
  },
  cities: {
    'USA-OH': [{ name: 'Columbus' }],
    'USA-FL': [{ name: 'North Fort Myers' }],
    'USA-CA': [{ name: 'Los Angeles' }],
    'USA-NY': [{ name: 'New York' }],
    'CAN-ON': [{ name: 'Toronto' }],
    'GBR-LND': [{ name: 'London' }],
  },
}

const getAllCountries = () => localCountryData.countries
const getStatesOfCountry = (countryCode: string) => localCountryData.states[countryCode] ?? []
const getCitiesOfState = (countryCode: string, stateCode: string) =>
  localCountryData.cities[`${countryCode}-${stateCode}`] ?? []

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
  parcel_category: 'Electronics',
  parcel_product: '',
  parcel_description: '',
  fragile: false,
  description: '',
  weight: '',
  weight_unit: 'kg',
  rate_per_kg: '5.00',
  tax: '',
  discount: '',
  dimensions: '',
  package_type: 'box',
  declared_value: '',
  service_type: 'standard',
  status: 'processing',
  priority: 'normal',
  ship_date: '',
  estimated_delivery: '',
  current_location: 'Columbus, Ohio',
  current_location_status: 'Pending',
  notes: '',
  admin_notes: '',
}

export default function AdminShipmentNewClient() {
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
      description: '',
      category: '',
    },
  ])
  const [currentLocationUpdate, setCurrentLocationUpdate] = useState({
    date: '',
    time: '',
  })
  const postalCodeLookup: Record<string, string> = {
    'USA-OH-Columbus': '43004',
    'USA-FL-North Fort Myers': '33903',
    'USA-CA-Los Angeles': '90001',
    'USA-NY-New York': '10001',
    'GBR-LND-London': 'EC1A',
    'CAN-ON-Toronto': 'M5H',
  }

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleCurrentLocationUpdateChange = (field: string, value: string) => {
    setCurrentLocationUpdate((current) => ({ ...current, [field]: value }))
  }

  const addCurrentLocationUpdate = () => {
    if (!currentLocationUpdate.date || !currentLocationUpdate.time) {
      toast.error('Please select date and time before adding the update.')
      return
    }

    const updateText = `${currentLocationUpdate.date} ${currentLocationUpdate.time}`
    setForm((current) => ({
      ...current,
      notes: current.notes ? `${current.notes}\n${updateText}` : updateText,
    }))
    setCurrentLocationUpdate({ date: '', time: '' })
    toast.success('Current location update added.')
  }

  useEffect(() => {
    const allCountries = getAllCountries()
    setCountries(allCountries)

    const initialSenderStates = getStatesOfCountry(emptyForm.sender_country)
    const initialRecipientStates = getStatesOfCountry(emptyForm.recipient_country)
    setSenderStates(initialSenderStates)
    setRecipientStates(initialRecipientStates)

    const initialSenderCities = initialSenderStates.length
      ? getCitiesOfState(emptyForm.sender_country, initialSenderStates[0].isoCode)
      : []
    const initialRecipientCities = initialRecipientStates.length
      ? getCitiesOfState(emptyForm.recipient_country, initialRecipientStates[0].isoCode)
      : []
    setSenderCities(initialSenderCities)
    setRecipientCities(initialRecipientCities)
  }, [])

  const generateTrackingNumber = () => `ZG-${Math.floor(100000000 + Math.random() * 900000000)}`

  const generateOrderId = () => `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  useEffect(() => {
    if (!form.tracking_number) {
      setForm((current) => ({ ...current, tracking_number: generateTrackingNumber() }))
    }
  }, [form.tracking_number])

  useEffect(() => {
    if (!form.order_id) {
      setForm((current) => ({ ...current, order_id: generateOrderId() }))
    }
  }, [form.order_id])

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
    const states = getStatesOfCountry(value)
    const selectedState = states[0]?.isoCode || ''
    const cities = selectedState ? getCitiesOfState(value, selectedState) : []
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
    const cities = getCitiesOfState(form.sender_country, value)
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
    const states = getStatesOfCountry(value)
    const selectedState = states[0]?.isoCode || ''
    const cities = selectedState ? getCitiesOfState(value, selectedState) : []
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
    const cities = getCitiesOfState(form.recipient_country, value)
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

  const getCountryName = (countryCode: string) => {
    const country = countries.find((item) => item.isoCode === countryCode)
    return country?.name || countryCode || 'Unknown country'
  }

  const currentRouteOptions = [
    {
      value: `Country route - ${getCountryName(form.sender_country)} → ${getCountryName(form.recipient_country)}`,
      label: `Country route - ${getCountryName(form.sender_country)} → ${getCountryName(form.recipient_country)}`,
    },
    {
      value: `Pickup - ${form.sender_address || form.sender_city || 'Origin location'}`,
      label: `Pickup - ${form.sender_address || form.sender_city || 'Origin location'}`,
    },
    {
      value: `${form.sender_city || 'Origin city'} - Sorting and Processing`, 
      label: `${form.sender_city || 'Origin city'} - Sorting and Processing`,
    },
    {
      value: 'Regional Hub - Package consolidation',
      label: 'Regional Hub - Package consolidation',
    },
    {
      value: 'Transit Hub - Distribution center',
      label: 'Transit Hub - Distribution center',
    },
    {
      value: 'International route - Between countries',
      label: 'International route - Between countries',
    },
    {
      value: 'Local Delivery Hub - Final mile sort',
      label: 'Local Delivery Hub - Final mile sort',
    },
    {
      value: `${form.recipient_city || 'Destination city'} - Delivery facility`,
      label: `${form.recipient_city || 'Destination city'} - Delivery facility`,
    },
    {
      value: `Recipient address - ${form.recipient_address || form.recipient_city || 'Destination'}`,
      label: `Recipient address - ${form.recipient_address || form.recipient_city || 'Destination'}`,
    },
  ]

  const selectedCurrentRoute = currentRouteOptions.some((option) => option.value === form.current_location)
    ? form.current_location
    : ''

  useEffect(() => {
    const destination = [form.recipient_address, form.recipient_city, form.recipient_state, form.recipient_country]
      .filter(Boolean)
      .join(', ')
    if (!destination) return

    setForm((current) => {
      const autoRoutePrefix = 'Route:'
      const source = [current.sender_city || current.sender_state || current.sender_country]
        .filter(Boolean)
        .join(', ')
      const routeText = source ? `Route: ${source} → ${destination}` : `Route: ${destination}`

      if (!current.current_location || current.current_location.startsWith(autoRoutePrefix)) {
        if (current.current_location === routeText) return current
        return { ...current, current_location: routeText }
      }

      return current
    })
  }, [form.recipient_address, form.recipient_city, form.recipient_state, form.recipient_country, form.sender_city, form.sender_state, form.sender_country])

  const computeTotalAmount = (
    baseFee: number,
    weightKg: number,
    ratePerKg: number,
    clearanceFee: number,
    taxAmount: number,
    discountAmount: number
  ) => {
    const weightCost = weightKg * ratePerKg
    return Math.max(0, baseFee + weightCost + clearanceFee + taxAmount - discountAmount).toFixed(2)
  }

  const updateCostTotals = (updates: Record<string, any>) => {
    setForm((current) => {
      const next = { ...current, ...updates }
      const baseFee = parseFloat(next.shipment_cost || '0')
      const weightKg = parseFloat(next.weight || '0')
      const ratePerKg = parseFloat(next.rate_per_kg || '0')
      const clearanceFee = parseFloat(next.clearance_cost || '0')
      const taxAmount = parseFloat(next.tax || '0')
      const discountAmount = parseFloat(next.discount || '0')
      return {
        ...next,
        total_amount: computeTotalAmount(baseFee, weightKg, ratePerKg, clearanceFee, taxAmount, discountAmount),
      }
    })
  }

  useEffect(() => {
    updateCostTotals({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parcelItems])

  const handleShipmentCostChange = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, '')
    updateCostTotals({ shipment_cost: numeric })
  }

  const handleClearanceCostChange = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, '')
    updateCostTotals({ clearance_cost: numeric })
  }

  const handleWeightChange = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, '')
    updateCostTotals({ weight: numeric })
  }

  const handleRatePerKgChange = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, '')
    updateCostTotals({ rate_per_kg: numeric })
  }

  const handleTaxChange = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, '')
    updateCostTotals({ tax: numeric })
  }

  const handleDiscountChange = (value: string) => {
    const numeric = value.replace(/[^0-9.]/g, '')
    updateCostTotals({ discount: numeric })
  }

  const handlePaymentStatusChange = (value: string) => {
    setForm((current) => ({ ...current, payment_status: value }))
  }

  const handleCurrencyChange = (value: string) => {
    setForm((current) => ({ ...current, currency: value }))
  }

  const updateParcelItem = (index: number, field: string, value: string) => {
    setParcelItems((current) =>
      current.map((item, idx) => {
        if (idx !== index) return item
        return { ...item, [field]: value }
      })
    )
  }

  const addParcelItem = () => {
    setParcelItems((current) => [
      ...current,
      {
        qty: '1',
        product: '',
        description: '',
        category: '',
      },
    ])
  }

  const removeParcelItem = (index: number) => {
    setParcelItems((current) => current.filter((_, idx) => idx !== index))
  }

  const parcelQuantityTotal = parcelItems.reduce((sum, item) => sum + (parseFloat(item.qty || '0') || 0), 0)
  const parcelShippingTotal = parseFloat(form.shipment_cost || '0')
  const parcelTotalCost = parseFloat(form.total_amount || '0')

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
      const weightCharge = Number(form.weight || 0) * Number(form.rate_per_kg || 0)
      const originLocation = [form.sender_address, form.sender_city, form.sender_state, form.sender_country]
        .filter(Boolean)
        .join(', ')
      const destinationLocation = [form.recipient_address, form.recipient_city, form.recipient_state, form.recipient_country]
        .filter(Boolean)
        .join(', ')

      const payload = {
        ...form,
        tracking_id: form.tracking_number,
        weight: form.weight ? Number(form.weight) : null,
        declared_value: form.declared_value ? Number(form.declared_value) : null,
        shipment_cost: form.shipment_cost ? Number(form.shipment_cost) : null,
        total_amount: form.total_amount ? Number(form.total_amount) : null,
        amount_paid: form.amount_paid ? Number(form.amount_paid) : null,
        quantity: form.parcel_quantity ? Number(form.parcel_quantity) : null,
        payment_method: form.payment_method || 'Card',
        parcel_category: form.parcel_category || '',
        description: form.description || form.parcel_description || null,
        parcel_items: parcelItems.map((item) => ({
          product: item.product,
          qty: Number(item.qty),
          description: item.description,
          category: (item as any).category || '',
        })),
        sender_zip: form.sender_postal_code,
        recipient_zip: form.recipient_postal_code,
      }

      const response = await api.post('/shipments', payload)
      const trackingId = response.data?.tracking_id
      const orderId = response.data?.order_id || form.order_id

      if (typeof window !== 'undefined' && trackingId) {
        const receiptPayload = {
          ...payload,
          tracking_id: trackingId,
          order_id: orderId,
          receiptDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          shipping_cost: payload.shipment_cost,
          base_fee: payload.shipment_cost,
          weight_charge: Number(weightCharge.toFixed(2)),
          insurance: 0,
          fuel_charge: 0,
          customs: 0,
          origin_location: originLocation,
          destination_location: destinationLocation,
        }

        const invoicePayload = {
          ...receiptPayload,
          booking_mode: form.booking_mode,
          payment_method: form.payment_method,
          payment_status: form.payment_status,
          order_id: orderId,
          service_type: form.service_type,
        }

        window.localStorage.setItem('msc_admin_receipt_data', JSON.stringify(receiptPayload))
        window.localStorage.setItem('msc_admin_invoice_data', JSON.stringify(invoicePayload))
      }

      toast.success('Shipment created successfully.')
      await router.push('/admin/shipments')
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
            <h1 className="section-title text-3xl">Add new shipment</h1>
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
            <form id="create-shipment-form" onSubmit={handleSubmit} className="space-y-10">
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
                    <h2 className="text-lg font-bold text-navy-900">Delivery options</h2>
                    <p className="mt-1 text-sm text-slate-600">Select delivery type, pickup date, and expected delivery.</p>
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
                  <label className="block md:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="label">Order ID</span>
                      <button type="button" onClick={() => setForm((current) => ({ ...current, order_id: generateOrderId() }))} className="text-sm font-semibold text-brand-600 hover:text-brand-800">
                        Regenerate
                      </button>
                    </div>
                    <input type="text" value={form.order_id} readOnly className="input-field bg-slate-100" />
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
                    <span className="label">Delivery type</span>
                    <select value={form.service_type} onChange={(e) => handleChange('service_type', e.target.value)} className="input-field">
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                      <option value="same_day">Same Day</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Pickup date</span>
                    <input type="date" value={form.ship_date} onChange={(e) => handleChange('ship_date', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Expected delivery date</span>
                    <input type="date" value={form.estimated_delivery} onChange={(e) => handleChange('estimated_delivery', e.target.value)} className="input-field" />
                  </label>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Parcel details</h2>
                    <p className="mt-1 text-sm text-slate-600">Add category, dimensions, quantity, and fragility for the parcel.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="label">Parcel category</span>
                    <select value={form.parcel_category} onChange={(e) => handleChange('parcel_category', e.target.value)} className="input-field">
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Documents">Documents</option>
                      <option value="Jewelries">Jewelries</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Food">Food</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Quantity</span>
                    <input type="number" value={form.parcel_quantity} min="1" onChange={(e) => handleChange('parcel_quantity', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Weight</span>
                    <input value={form.weight} onChange={(e) => handleWeightChange(e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Rate per kg</span>
                    <input value={form.rate_per_kg} onChange={(e) => handleRatePerKgChange(e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Clearance cost</span>
                    <input value={form.clearance_cost} onChange={(e) => handleClearanceCostChange(e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Tax</span>
                    <input value={form.tax} onChange={(e) => handleTaxChange(e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Discount</span>
                    <input value={form.discount} onChange={(e) => handleDiscountChange(e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Total amount (auto)</span>
                    <input readOnly value={formatMoney(parsedTotalAmount)} className="input-field bg-slate-100" />
                  </label>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Billing</h2>
                    <p className="mt-1 text-sm text-slate-600">Manage payment status and pricing details.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="label">Amount paid</span>
                    <input value={form.amount_paid} onChange={(e) => handleChange('amount_paid', e.target.value)} className="input-field" />
                  </label>
                  <label className="block">
                    <span className="label">Payment method</span>
                    <select value={form.payment_method} onChange={(e) => handleChange('payment_method', e.target.value)} className="input-field">
                      <option value="Card">Card</option>
                      <option value="Cash">Cash</option>
                      <option value="BankTransfer">Bank Transfer</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Payment status</span>
                    <select value={form.payment_status} onChange={(e) => handlePaymentStatusChange(e.target.value)} className="input-field">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="label">Currency</span>
                    <select value={form.currency} onChange={(e) => handleCurrencyChange(e.target.value)} className="input-field">
                      <option value="USD">USD</option>
                      <option value="CAD">CAD</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </label>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Parcel items</h2>
                    <p className="mt-1 text-sm text-slate-600">Add one or more items for this shipment.</p>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {parcelItems.map((item, index) => (
                    <div key={index} className="grid gap-4 md:grid-cols-4 items-end">
                      <label className="block">
                        <span className="label">Quantity</span>
                        <input type="number" min="1" value={item.qty} onChange={(e) => updateParcelItem(index, 'qty', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Product</span>
                        <input value={item.product} onChange={(e) => updateParcelItem(index, 'product', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Description</span>
                        <input value={item.description} onChange={(e) => updateParcelItem(index, 'description', e.target.value)} className="input-field" />
                      </label>
                      <label className="block">
                        <span className="label">Category</span>
                        <select value={item.category} onChange={(e) => updateParcelItem(index, 'category', e.target.value)} className="input-field">
                          <option value="">Select</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Documents">Documents</option>
                          <option value="Clothes">Clothes</option>
                          <option value="Other">Other</option>
                        </select>
                      </label>
                      <button type="button" onClick={() => removeParcelItem(index)} className="text-sm text-red-600 hover:text-red-800">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={addParcelItem} className="btn-secondary">
                    Add item
                  </button>
                </div>
              </section>

              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">Notes and tracking</h2>
                    <p className="mt-1 text-sm text-slate-600">Add current location updates, shipment notes, and tracking details.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="label">Current location note</span>
                    <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} className="input-field h-24" />
                  </label>
                  <label className="block">
                    <span className="label">Add current location update</span>
                    <div className="flex gap-3">
                      <input type="date" value={currentLocationUpdate.date} onChange={(e) => handleCurrentLocationUpdateChange('date', e.target.value)} className="input-field" />
                      <input type="time" value={currentLocationUpdate.time} onChange={(e) => handleCurrentLocationUpdateChange('time', e.target.value)} className="input-field" />
                      <button type="button" onClick={addCurrentLocationUpdate} className="btn-secondary">
                        Add update
                      </button>
                    </div>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="label">Current route</span>
                    <select value={selectedCurrentRoute || ''} onChange={(e) => handleChange('current_location', e.target.value)} className="input-field">
                      <option value="">Select route</option>
                      {currentRouteOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <div className="flex items-center justify-between gap-3">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Creating shipment...' : 'Create shipment'}
                </button>
                <div className="text-sm text-slate-500">Parcel total: {parcelQuantityTotal}, Cost: ${formatMoney(parcelTotalCost)}, Balance: ${formatMoney(balanceDue)}</div>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="card p-6 bg-slate-50">
              <h3 className="text-lg font-semibold text-navy-900">Shipment summary</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex justify-between"><span>Status</span><span>{form.status}</span></div>
                <div className="flex justify-between"><span>Currency</span><span>{form.currency}</span></div>
                <div className="flex justify-between"><span>Weight</span><span>{form.weight || '0'} kg</span></div>
                <div className="flex justify-between"><span>Total</span><span>${formatMoney(parsedTotalAmount)}</span></div>
                <div className="flex justify-between"><span>Paid</span><span>${formatMoney(parsedAmountPaid)}</span></div>
                <div className="flex justify-between"><span>Balance</span><span>${formatMoney(balanceDue)}</span></div>
              </div>
            </div>

            <div className="card p-6 bg-slate-50">
              <h3 className="text-lg font-semibold text-navy-900">Barcode preview</h3>
              <div className="mt-4 flex items-center justify-center rounded border border-slate-200 bg-white p-4">
                <svg id="barcode" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  )
}
