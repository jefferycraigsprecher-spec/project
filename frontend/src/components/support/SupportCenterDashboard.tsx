'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { io, Socket } from 'socket.io-client'
import {
  AlertTriangle,
  CheckCheck,
  Clock3,
  Headphones,
  Inbox,
  RefreshCw,
  Search,
  SendHorizontal,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import type { SupportAgent, SupportStats, SupportTicket, SupportTicketMessage } from '@/types'

const priorityStyles: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
}

const statusStyles: Record<string, string> = {
  open: 'bg-amber-100 text-amber-700',
  in_review: 'bg-sky-100 text-sky-700',
  closed: 'bg-emerald-100 text-emerald-700'
}

export default function SupportCenterDashboard() {
  const socketRef = useRef<Socket | null>(null)

  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [stats, setStats] = useState<SupportStats | null>(null)
  const [agents, setAgents] = useState<SupportAgent[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<SupportTicketMessage[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_review' | 'closed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'normal' | 'high' | 'urgent'>('all')
  const [assignedFilter, setAssignedFilter] = useState<'all' | 'assigned' | 'unassigned'>('all')
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [loadingTicket, setLoadingTicket] = useState(false)
  const [sendingReply, setSendingReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [socketConnected, setSocketConnected] = useState(false)

  const loadStats = async () => {
    try {
      const res = await api.get('/support/stats')
      setStats(res.data.stats)
    } catch {
      toast.error('Unable to load support statistics.')
    }
  }

  const loadAgents = async () => {
    try {
      const res = await api.get('/support/agents')
      setAgents(res.data.agents || [])
    } catch {
      toast.error('Unable to load support agents.')
    }
  }

  const loadTickets = async () => {
    setLoadingTickets(true)
    try {
      const res = await api.get('/support/tickets', {
        params: {
          search,
          status: statusFilter,
          priority: priorityFilter,
          assigned: assignedFilter,
        },
      })

      const nextTickets = res.data.tickets || []
      setTickets(nextTickets)

      if (!selectedTicketId && nextTickets.length) {
        setSelectedTicketId(nextTickets[0].id)
      }

      if (selectedTicketId && !nextTickets.some((ticket: SupportTicket) => ticket.id === selectedTicketId)) {
        setSelectedTicketId(nextTickets[0]?.id || null)
      }
    } catch {
      toast.error('Unable to load support tickets.')
    } finally {
      setLoadingTickets(false)
    }
  }

  useEffect(() => {
    loadStats()
    loadAgents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, priorityFilter, assignedFilter])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicketId])

  useEffect(() => {
    if (!selectedTicketId) {
      setSelectedTicket(null)
      setMessages([])
      return
    }

    const joinTicketRoom = async () => {
      if (socketRef.current) {
        socketRef.current.emit('support:join', { ticketId: selectedTicketId })
      }
    }

    joinTicketRoom()

    setLoadingTicket(true)
    api.get(`/support/tickets/${selectedTicketId}`)
      .then((res) => {
        setSelectedTicket(res.data.ticket)
        setMessages(res.data.messages || [])
      })
      .catch(() => {
        toast.error('Unable to load the selected ticket.')
      })
      .finally(() => setLoadingTicket(false))

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('support:leave', { ticketId: selectedTicketId })
      }
    }
  }, [selectedTicketId])

  const totalOpen = useMemo(() => tickets.filter((ticket) => ticket.status !== 'closed').length, [tickets])
  const avgPriority = useMemo(() => {
    if (!tickets.length) return 'low'
    const counts = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'normal'
  }, [tickets])

  const updateStatus = async (status: SupportTicket['status']) => {
    if (!selectedTicket) return

    try {
      const res = await api.patch(`/support/tickets/${selectedTicket.id}/status`, { status })
      setSelectedTicket((current) => (current ? { ...current, ...res.data.ticket } : current))
      toast.success('Ticket status updated.')
      loadTickets()
      loadStats()
    } catch {
      toast.error('Unable to update ticket status.')
    }
  }

  const assignAgent = async (agentId: number | null) => {
    if (!selectedTicket) return

    try {
      const res = await api.patch(`/support/tickets/${selectedTicket.id}/assign`, { agentId })
      setSelectedTicket((current) => (current ? { ...current, ...res.data.ticket } : current))
      toast.success(agentId ? 'Agent assigned.' : 'Assignment cleared.')
      loadTickets()
    } catch {
      toast.error('Unable to update assignment.')
    }
  }

  const sendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return

    setSendingReply(true)

    try {
      const res = await api.post(`/support/tickets/${selectedTicket.id}/reply`, { message: replyText.trim() })
      setMessages((current) => [...current, res.data.message])
      setReplyText('')
      setSelectedTicket((current) => (current ? { ...current, status: 'in_review', updated_at: new Date().toISOString() } : current))
      toast.success('Reply sent to customer.')
      loadTickets()
      loadStats()
    } catch {
      toast.error('Unable to send reply.')
    } finally {
      setSendingReply(false)
    }
  }

  const priorityLabel = (priority: string) => priority.replace('_', ' ')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-subtitle">Live logistics support</p>
          <h1 className="section-title text-3xl md:text-4xl">Support center dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Monitor customer issues, assign staff, reply to complaints, and keep shipping problem resolution visible in real time.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-none border border-gray-200 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Socket status</p>
            <p className={`mt-2 text-sm font-semibold ${socketConnected ? 'text-emerald-600' : 'text-amber-600'}`}>
              {socketConnected ? 'Live chat online' : 'Reconnecting...'}
            </p>
          </div>
          <button onClick={() => { loadTickets(); loadStats() }} className="btn-outline">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Open tickets</p>
              <p className="mt-3 text-3xl font-bold text-navy-900">{stats?.open ?? 0}</p>
            </div>
            <div className="rounded-full bg-amber-50 p-3 text-amber-600"><Inbox className="w-5 h-5" /></div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">In review</p>
              <p className="mt-3 text-3xl font-bold text-navy-900">{stats?.in_review ?? 0}</p>
            </div>
            <div className="rounded-full bg-sky-50 p-3 text-sky-600"><Clock3 className="w-5 h-5" /></div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Urgent</p>
              <p className="mt-3 text-3xl font-bold text-navy-900">{stats?.urgent ?? 0}</p>
            </div>
            <div className="rounded-full bg-red-50 p-3 text-red-600"><AlertTriangle className="w-5 h-5" /></div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Assigned</p>
              <p className="mt-3 text-3xl font-bold text-navy-900">{stats?.assigned ?? 0}</p>
            </div>
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-600"><Users className="w-5 h-5" /></div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-subtitle">Ticket queue</p>
              <h2 className="text-2xl font-bold text-navy-900">Search customer tickets</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by customer, email, tracking, or subject"
                  className="input-field pl-10 w-full min-w-[280px]"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['all', 'open', 'in_review', 'closed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 text-sm font-semibold border ${statusFilter === status ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-gray-200 text-gray-600 bg-white'}`}
              >
                {status === 'all' ? 'All statuses' : status.replace('_', ' ')}
              </button>
            ))}
            {(['all', 'low', 'normal', 'high', 'urgent'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setPriorityFilter(priority)}
                className={`px-3 py-2 text-sm font-semibold border ${priorityFilter === priority ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-gray-200 text-gray-600 bg-white'}`}
              >
                {priority === 'all' ? 'All priorities' : priorityLabel(priority)}
              </button>
            ))}
            {(['all', 'assigned', 'unassigned'] as const).map((value) => (
              <button
                key={value}
                onClick={() => setAssignedFilter(value)}
                className={`px-3 py-2 text-sm font-semibold border ${assignedFilter === value ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-gray-200 text-gray-600 bg-white'}`}
              >
                {value === 'all' ? 'All assignments' : value === 'assigned' ? 'Assigned' : 'Unassigned'}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto">
            {loadingTickets ? (
              <div className="py-12 text-center text-gray-500">Loading support tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="py-12 text-center text-gray-500">No tickets matched your filters.</div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-[0.15em]">
                    <th className="py-3 pr-4">Customer</th>
                    <th className="py-3 pr-4">Issue</th>
                    <th className="py-3 pr-4">Priority</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={`border-b border-gray-100 last:border-0 cursor-pointer ${selectedTicketId === ticket.id ? 'bg-brand-50' : ''}`}
                      onClick={() => setSelectedTicketId(ticket.id)}
                    >
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-navy-900">{ticket.customer_name}</div>
                        <div className="text-xs text-gray-500">{ticket.customer_email}</div>
                        {ticket.tracking_id ? <div className="text-xs text-brand-600">Tracking {ticket.tracking_id}</div> : null}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-navy-900">{ticket.subject || 'General inquiry'}</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{ticket.message}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex px-2 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-full ${priorityStyles[ticket.priority]}`}>
                          {priorityLabel(ticket.priority)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex px-2 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-full ${statusStyles[ticket.status]}`}>
                          {ticket.status === 'in_review' ? 'In review' : ticket.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-sm text-gray-600">
                        {ticket.assigned_to_name || 'Unassigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-subtitle">Customer issue view</p>
                <h2 className="text-2xl font-bold text-navy-900">Ticket details</h2>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">
                {totalOpen} active
              </div>
            </div>

            {loadingTicket ? (
              <div className="mt-6 text-center text-gray-500">Loading ticket details...</div>
            ) : !selectedTicket ? (
              <div className="mt-6 rounded-none border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                Select a ticket to review shipment issues, assignments, and chat history.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-none border border-gray-200 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Customer</p>
                    <p className="mt-2 font-semibold text-navy-900">{selectedTicket.customer_name}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.customer_email}</p>
                  </div>
                  <div className="rounded-none border border-gray-200 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Channel</p>
                    <p className="mt-2 font-semibold text-navy-900 capitalize">{selectedTicket.channel}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.issue_type}</p>
                  </div>
                </div>

                <div className="rounded-none border border-gray-200 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Complaint summary</p>
                  <p className="mt-2 text-sm text-gray-700">{selectedTicket.message}</p>
                  {selectedTicket.tracking_id ? (
                    <p className="mt-3 text-xs text-brand-600">Shipment issue linked to tracking {selectedTicket.tracking_id}</p>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(event) => updateStatus(event.target.value as SupportTicket['status'])}
                      className="input-field"
                    >
                      <option value="open">Open</option>
                      <option value="in_review">In review</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Assign support agent</label>
                    <select
                      value={selectedTicket.assigned_to || ''}
                      onChange={(event) => assignAgent(event.target.value ? Number(event.target.value) : null)}
                      className="input-field"
                    >
                      <option value="">Unassigned</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-none border border-gray-200 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Priority</p>
                    <p className="mt-2 text-sm font-semibold capitalize">{selectedTicket.priority}</p>
                  </div>
                  <div className="rounded-none border border-gray-200 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Last reply</p>
                    <p className="mt-2 text-sm font-semibold">{selectedTicket.last_reply_at ? formatDateTime(selectedTicket.last_reply_at) : 'No reply yet'}</p>
                  </div>
                </div>

                <div className="rounded-none bg-navy-900 p-4 text-white">
                  <div className="flex items-center gap-2 text-sm text-brand-200">
                    <ShieldCheck className="w-4 h-4" />
                    Admin access control is enforced on this support workspace.
                  </div>
                  <p className="mt-3 text-sm text-gray-200">
                    Only authenticated administrators can search tickets, reassign agents, and send responses.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-brand-50 p-3 text-brand-500"><Headphones className="w-5 h-5" /></div>
              <div>
                <p className="section-subtitle">Live customer chat</p>
                <h2 className="text-xl font-bold text-navy-900">Realtime support chat</h2>
              </div>
            </div>

            <div className="mt-4 h-72 overflow-y-auto rounded-none border border-gray-200 p-3 bg-slate-50">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No chat history yet. Send the first response to start the conversation.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[90%] rounded-none px-3 py-2 ${message.sender_type === 'agent' ? 'ml-auto bg-navy-900 text-white' : 'bg-white text-gray-800'}`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-wide opacity-80">
                        <span>{message.sender_name}</span>
                        <span>{formatDateTime(message.created_at)}</span>
                      </div>
                      <p className="mt-2 text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                rows={3}
                placeholder="Reply to the customer complaint"
                className="input-field resize-none"
                disabled={!selectedTicket}
              />
              <button
                onClick={sendReply}
                disabled={!selectedTicket || sendingReply || !replyText.trim()}
                className="btn-primary self-end"
              >
                <SendHorizontal className="w-4 h-4" />
                {sendingReply ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-50 p-3 text-amber-600"><CheckCheck className="w-5 h-5" /></div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Priority mix</p>
              <p className="mt-2 text-lg font-bold text-navy-900">{priorityLabel(avgPriority)}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-sky-50 p-3 text-sky-600"><UserCog className="w-5 h-5" /></div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Response team</p>
              <p className="mt-2 text-lg font-bold text-navy-900">{agents.length} agents</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-600"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Access model</p>
              <p className="mt-2 text-lg font-bold text-navy-900">Admin-only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
