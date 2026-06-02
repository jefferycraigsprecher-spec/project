export interface Shipment {
  id: number
  tracking_id: string
  sender_name: string
  sender_email?: string
  sender_phone?: string
  sender_address: string
  sender_city: string
  sender_state?: string
  sender_country: string
  sender_zip?: string
  
  recipient_name: string
  recipient_email?: string
  recipient_phone?: string
  recipient_address: string
  recipient_city: string
  recipient_state?: string
  recipient_country: string
  recipient_zip?: string
  
  description?: string
  weight?: number
  weight_unit: 'kg' | 'lbs'
  dimensions?: string
  package_type?: string
  declared_value?: number
  
  service_type: 'standard' | 'express' | 'overnight' | 'freight'
  status: 'processing' | 'picked_up' | 'in_transit' | 'customs_clearance' | 'arrived_at_facility' | 'out_for_delivery' | 'delivered' | 'failed_delivery'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  
  ship_date?: string
  estimated_delivery?: string
  actual_delivery?: string
  current_location?: string
  current_status?: string
  last_updated?: string
  
  notes?: string
  admin_notes?: string
  
  created_by?: number
  created_by_name?: string
  created_at: string
  updated_at: string
}

export interface TrackingEvent {
  id: number
  shipment_id: number
  status: string
  location?: string
  description?: string
  remarks?: string
  event_time: string
  created_by_name?: string
}

export interface TrackingEvent {
  id: number
  shipment_id: number
  status: string
  location?: string
  description?: string
  event_time: string
  created_by_name?: string
}

export interface ShipmentMedia {
  id: number
  shipment_id: number
  media_type: 'photo' | 'video'
  filename: string
  original_name?: string
  file_size?: number
  mime_type?: string
  caption?: string
  uploaded_at: string
}

export interface ShipmentActivityLog {
  id: number
  shipment_id: number
  action: string
  details?: Record<string, unknown> | string | null
  created_by?: number
  created_by_name?: string
  created_at: string
}

export interface Admin {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'admin'
}

export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  email_verified: boolean
  created_at: string
}

export interface CustomerNotification {
  id: number
  customer_id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
}

export interface CustomerDocument {
  id: number
  document_type: string
  original_name: string
  uploaded_at: string
}

export interface SupportAgent {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'admin'
}

export interface SupportTicket {
  id: number
  customer_id: number | null
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  shipment_id: number | null
  tracking_id?: string | null
  shipment_status?: string | null
  subject: string | null
  message: string
  status: 'open' | 'in_review' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  channel: string
  issue_type: string
  assigned_to: number | null
  assigned_to_name?: string | null
  last_reply_at?: string | null
  resolution_notes?: string | null
  created_at: string
  updated_at: string
}

export interface SupportTicketMessage {
  id: number
  ticket_id: number
  sender_type: 'customer' | 'agent' | 'system'
  sender_id: number | null
  sender_name: string
  message: string
  created_at: string
  is_read: boolean
}

export interface SupportStats {
  total: number
  open: number
  in_review: number
  closed: number
  urgent: number
  assigned: number
}

export interface DashboardStats {
  total: number
  today: number
  processing: number
  picked_up: number
  in_transit: number
  customs_clearance: number
  arrived_at_facility: number
  out_for_delivery: number
  delivered: number
  failed_delivery: number
}
