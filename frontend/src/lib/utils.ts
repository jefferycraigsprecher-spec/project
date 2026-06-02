import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateStr: string | null) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export function formatDateTime(dateStr: string | null) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export const STATUS_LABELS: Record<string, string> = {
  processing: 'Processing',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  customs_clearance: 'Customs Clearance',
  arrived_at_facility: 'Arrived at Facility',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  failed_delivery: 'Failed Delivery',
}

export const SERVICE_LABELS: Record<string, string> = {
  standard: 'Standard Shipping',
  express: 'Express Shipping',
  overnight: 'Overnight Shipping',
  freight: 'Freight',
}

export const STATUS_DESCRIPTIONS: Record<string, string> = {
  processing: 'Shipment is being processed.',
  picked_up: 'Parcel has been collected from sender.',
  in_transit: 'Shipment is moving through the logistics network.',
  customs_clearance: 'Shipment is undergoing customs clearance.',
  arrived_at_facility: 'Shipment has arrived at a carrier facility.',
  out_for_delivery: 'Shipment is out for delivery.',
  delivered: 'Package has been successfully delivered.',
  failed_delivery: 'Delivery attempt failed. A follow-up action is required.',
}

export function getTrackingDescription(status: string) {
  return STATUS_DESCRIPTIONS[status] || 'Shipment status updated.'
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    picked_up: 'bg-sky-100 text-sky-800 border-sky-200',
    in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
    customs_clearance: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    arrived_at_facility: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    failed_delivery: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}
