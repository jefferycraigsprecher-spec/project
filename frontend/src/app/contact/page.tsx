'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Testimonials from '@/components/sections/Testimonials';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill required fields');

    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We will get back to you shortly.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white font-sans">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Questions about our services? Need a quote? Our team is ready to help with your logistics needs.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: MapPin,
                  title: 'Address',
                  details: ['1450 Industrial Parkway', 'Columbus, Ohio, USA'],
                },
                {
                  icon: Phone,
                  title: 'Phone',
                  details: ['+1 (614) 555-0123', '+1 (614) 555-0199'],
                },
                {
                  icon: Clock,
                  title: 'Business Hours',
                  details: ['Mon-Fri: 6 AM – 8 PM ET', 'Sat: 8 AM – 4 PM ET'],
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    {item.details.map((detail) => (
                      <p key={detail} className="text-slate-300 text-sm mb-1">
                        {detail}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-[2rem] bg-white/95 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-slate-900/5 sm:p-10">
              <h2 className="text-3xl font-bold text-slate-950 mb-8">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    >
                      <option value="">Select a subject</option>
                      <option value="Quote Request">Quote Request</option>
                      <option value="Shipment Issue">Shipment Issue</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    placeholder="Tell us about your shipment needs..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 disabled:opacity-50"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  <Link
                    href="/track"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Track Shipment
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Testimonials />

      <Footer />
    </div>
  );
}
