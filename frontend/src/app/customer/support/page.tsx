'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'
import CustomerLayout from '@/components/layout/CustomerLayout'
import customerApi from '@/lib/customerApi'
import type { SupportTicket, SupportTicketMessage } from '@/types'

export default function CustomerSupportPage() {
  const socketRef = useRef<Socket | null>(null)

  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<SupportTicketMessage[]>([])
  const [draft, setDraft] = useState('')
  const [subject, setSubject] = useState('')
  const [shipmentId, setShipmentId] = useState('')
  const [message, setMessage] = useState('')
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [creating, setCreating] = useState(false)
  const [sending, setSending] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)

  const loadTickets = async () => {
    setLoadingTickets(true)

    try {
      const res = await customerApi.get('/customers/support/tickets')
      const nextTickets = res.data.tickets || []
      setTickets(nextTickets)

      if (!selectedTicketId && nextTickets.length) {
        setSelectedTicketId(nextTickets[0].id)
      }

      if (selectedTicketId && !nextTickets.some((ticket: SupportTicket) => ticket.id === selectedTicketId)) {
        setSelectedTicketId(nextTickets[0]?.id || null)
      }
    } catch {
      toast.error('Unable to load your support tickets.')
    } finally {
      setLoadingTickets(false)
    }
  }

  const loadMessages = async (ticketId: number) => {
    setLoadingMessages(true)

    try {
      const res = await customerApi.get(`/customers/support/tickets/${ticketId}/messages`)
      setMessages(res.data.messages || [])
      setSelectedTicket(res.data.ticket || null)
    } catch {
      toast.error('Unable to load the conversation.')
    } finally {
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  useEffect(() => {
    if (!selectedTicketId) {
      setSelectedTicket(null)
      setMessages([])
      return
    }

    const ticket = tickets.find((item) => item.id === selectedTicketId)
    setSelectedTicket(ticket || null)

    if (ticket) {
      loadMessages(ticket.id)
    }
  }, [selectedTicketId, tickets])

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : undefined)
    const socket = io(socketUrl, {
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => setSocketConnected(true))
    socket.on('disconnect', () => setSocketConnected(false))

    socket.on('support:message_received', (payload) => {
      if (payload.ticketId === selectedTicketId) {
        setMessages((current) => [...current, payload.message])
      }
      loadTickets()
    })

    socket.on('support:ticket_updated', (payload) => {
      if (payload.ticketId === selectedTicketId) {
        setSelectedTicket((current) => (current ? { ...current, ...payload.ticket } : current))
      }
      loadTickets()
    })

    return () => {
      socket.disconnect()
    }
  }, [selectedTicketId])

  useEffect(() => {
    if (!selectedTicketId || !socketRef.current) return

    socketRef.current.emit('support:join', { ticketId: selectedTicketId })

    return () => {
      socketRef.current?.emit('support:leave', { ticketId: selectedTicketId })
    }
  }, [selectedTicketId])

  const createTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!message.trim()) {
      toast.error('Please add a message before sending your support request.')
      return
    }

    setCreating(true)

    try {
      const res = await customerApi.post('/customers/support', {
        subject,
        shipment_id: shipmentId ? Number(shipmentId) : null,
        message,
      })

      setSubject('')
      setShipmentId('')
      setMessage('')
      setDraft('')
      setTickets((current) => [res.data.ticket, ...current])
      setSelectedTicketId(res.data.ticket.id)
      toast.success('Support request sent. An agent will respond shortly.')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to contact support.')
    } finally {
      setCreating(false)
    }
  }

  const sendMessage = async () => {
    if (!selectedTicket || !draft.trim()) return

    setSending(true)

    try {
      const res = await customerApi.post(`/customers/support/tickets/${selectedTicket.id}/messages`, {
        message: draft.trim(),
      })

      setMessages((current) => [...current, res.data.message])
      setDraft('')
      setSelectedTicket((current) => (current ? { ...current, status: 'open' } : current))
      loadTickets()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to send your message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <p className="section-subtitle">Customer support</p>
          <h1 className="section-title text-3xl">Live support chat</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-600">
            Create a support request or continue a conversation. Messages are shared instantly with the admin support team.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="label">Live status</p>
                <p className={`text-sm font-semibold ${socketConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {socketConnected ? 'Realtime chat online' : 'Connecting...'}
                </p>
              </div>
              <button type="button" onClick={loadTickets} className="btn-outline px-4 py-2 text-xs">
                Refresh
              </button>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="label">Your conversations</p>
              {loadingTickets ? (
                <p className="mt-3 text-sm text-gray-500">Loading your support tickets...</p>
              ) : tickets.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">No support tickets yet. Start a new request below.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`w-full border px-3 py-3 text-left ${selectedTicketId === ticket.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white'}`}
                    >
                      <p className="text-sm font-semibold text-navy-900">{ticket.subject || 'Customer support request'}</p>
                      <p className="mt-1 text-xs text-gray-500">{ticket.status === 'closed' ? 'Closed' : 'Open'} • {ticket.priority}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <p className="section-subtitle">Conversation</p>
              <h2 className="mt-2 text-2xl font-bold text-navy-900">
                {selectedTicket ? selectedTicket.subject || 'Customer support request' : 'Start a new support request'}
              </h2>
              {selectedTicket ? (
                <p className="mt-2 text-sm text-gray-500">
                  Status: <span className="font-semibold text-navy-900">{selectedTicket.status}</span> • Priority: <span className="font-semibold text-navy-900">{selectedTicket.priority}</span>
                </p>
              ) : null}
            </div>

            {selectedTicket ? (
              <div className="p-5">
                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                  {loadingMessages ? (
                    <p className="text-sm text-gray-500">Loading conversation...</p>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-gray-500">No messages yet. Add your first update below.</p>
                  ) : (
                    messages.map((item) => (
                      <div
                        key={item.id}
                        className={`max-w-[90%] rounded-none px-4 py-3 text-sm ${item.sender_type === 'customer' ? 'ml-auto bg-brand-50 text-navy-900' : 'bg-gray-100 text-slate-900'}`}
                      >
                        <p className="font-semibold">{item.sender_name}</p>
                        <p className="mt-1 whitespace-pre-wrap">{item.message}</p>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <label className="label">Send a message</label>
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={4}
                    placeholder="Tell the support team what you need help with..."
                    className="input-field min-h-28"
                  />
                  <div className="mt-3 flex justify-end">
                    <button type="button" disabled={sending || !draft.trim()} onClick={sendMessage} className="btn-primary">
                      {sending ? 'Sending...' : 'Send message'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <form onSubmit={createTicket} className="space-y-4">
                  <div>
                    <label className="label">Subject</label>
                    <input
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      placeholder="Shipping delay, document issue, pickup update..."
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Shipment ID (optional)</label>
                    <input
                      type="number"
                      value={shipmentId}
                      onChange={(event) => setShipmentId(event.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Message</label>
                    <textarea
                      required
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={5}
                      placeholder="Describe your issue in detail so the admin team can assist you quickly."
                      className="input-field min-h-32"
                    />
                  </div>
                  <button type="submit" disabled={creating} className="btn-primary">
                    {creating ? 'Sending...' : 'Send support request'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
