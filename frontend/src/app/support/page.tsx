'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Testimonials from '@/components/sections/Testimonials'
import { ChevronRight, Clock3, Headphones, Mail, MessageCircle, Phone, Search, ShieldCheck, Truck } from 'lucide-react'

type Message = {
  sender: 'assistant' | 'user'
  text: string
}

const quickTopics = [
  {
    title: 'Track a shipment',
    description: 'Check live status, route progress, and delivery updates.',
    href: '/track',
    icon: Truck,
  },
  {
    title: 'Request a quote',
    description: 'Start a conversation for urgent, secure, or high-volume freight needs.',
    href: '/contact',
    icon: ShieldCheck,
  },
  {
    title: 'Contact support',
    description: 'Reach our team for documentation, scheduling, and account help.',
    href: '/contact',
    icon: Headphones,
  },
]

const faqItems = [
  {
    question: 'How quickly can I get help for an urgent shipment?',
    answer: 'Our support team is available 24/7 and can assist with urgent routing, escalation, and delivery coordination immediately.',
  },
  {
    question: 'Can I track my shipment from the support center?',
    answer: 'Yes. You can jump straight to the tracking page from the quick links or use the chat assistant to get a tracking guide.',
  },
  {
    question: 'Do you offer support for high-value or secure freight?',
    answer: 'Yes. We provide secure-handling support, dedicated coordination, and a direct contact path for sensitive cargo requirements.',
  },
  {
    question: 'What hours is customer support available?',
    answer: 'Support is available around the clock, with response coverage for global shipments and time-sensitive logistics questions.',
  },
]

const cannedReplies = [
  'Thanks for reaching out. If you need help with a live shipment, please share your tracking ID and I will pull the latest status.',
  'We can help with quotes, routing, written confirmation, and secure handling. Let me know the shipment type and destination.',
  'For urgent inquiries, our support team can escalate your request right away. Share your contact details and the issue summary.',
]

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Hi! I am your support assistant. Ask me about tracking, quotes, urgent shipments, or service questions.',
    },
  ])
  const [draft, setDraft] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const assistantCount = useMemo(() => messages.filter((message) => message.sender === 'assistant').length, [messages])

  const handleSend = () => {
    const trimmed = draft.trim()
    if (!trimmed) return

    const lowered = trimmed.toLowerCase()
    let response = cannedReplies[assistantCount % cannedReplies.length]

    if (lowered.includes('track') || lowered.includes('tracking')) {
      response = 'Use the tracking page to check live updates. If you want, I can also guide you to the exact shipment status screen.'
    }

    if (lowered.includes('quote') || lowered.includes('rate')) {
      response = 'I can help you prepare a quote request. Share your origin, destination, cargo type, and preferred shipment timeline.'
    }

    if (lowered.includes('urgent') || lowered.includes('asap')) {
      response = 'We can prioritize urgent support immediately. Share your shipment details and I will route you to the right specialist.'
    }

    setMessages((current) => [
      ...current,
      { sender: 'user', text: trimmed },
      { sender: 'assistant', text: response },
    ])
    setDraft('')
  }

  return (
    <div className="bg-slate-950 text-white font-sans">
      <Navbar />

      <main>
        <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Support Center
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Need help with a shipment, quote, or logistics question? Our support team is ready to assist 24/7.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-10">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-xl">
                <p className="text-brand-400 uppercase tracking-widest text-sm mb-3">Quick support</p>
                <h2 className="text-3xl font-bold mb-4">Need help fast?</h2>
                <p className="text-slate-300 leading-7 mb-6">
                  Use the support assistant to get immediate guidance on tracking, quotes, urgent shipments, or documentation.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {quickTopics.map(({ title, description, href, icon: Icon }) => (
                    <Link
                      key={title}
                      href={href}
                      className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 transition hover:border-brand-400/30 hover:bg-slate-950"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{title}</h3>
                          <p className="text-sm text-slate-400">{description}</p>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400">
                        Continue <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-xl">
                <p className="text-brand-400 uppercase tracking-widest text-sm mb-3">Support details</p>
                <div className="space-y-5">
                  {[
                    { icon: Mail, label: 'Email', value: 'support@midwestshipment.com' },
                    { icon: Phone, label: 'Phone', value: '+1 (614) 555-0123' },
                    { icon: Clock3, label: 'Hours', value: '24/7 Global Support' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="mt-1 rounded-2xl bg-brand-500/10 p-3 text-brand-400">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-xl">
                <p className="text-brand-400 uppercase tracking-widest text-sm mb-4">Live assistant</p>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`rounded-3xl p-5 ${message.sender === 'assistant' ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-950'}`}
                    >
                      <p className="text-sm leading-7">{message.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={4}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-sm text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
                    placeholder="Ask about tracking, rates, or urgent support..."
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
                  >
                    Send Message
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-xl">
                <p className="text-brand-400 uppercase tracking-widest text-sm mb-4">Frequently Asked Questions</p>
                <div className="space-y-3">
                  {faqItems.map((faq, index) => (
                    <button
                      key={faq.question}
                      type="button"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-left"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-white">{faq.question}</span>
                        <span className="text-brand-400">{openFaq === index ? '-' : '+'}</span>
                      </div>
                      {openFaq === index ? (
                        <p className="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Testimonials />

      <Footer />
    </div>
  )
}

