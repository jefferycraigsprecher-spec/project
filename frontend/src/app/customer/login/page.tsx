'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { LockKeyhole, Mail, Package } from 'lucide-react'
import customerApi from '@/lib/customerApi'
import toast from 'react-hot-toast'

export default function CustomerLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (Cookies.get('msc_customer_token')) {
      router.replace('/customer/dashboard')
    }
  }, [router])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const res = await customerApi.post('/customers/login', form)
      Cookies.set('msc_customer_token', res.data.token, { expires: 7 })
      toast.success('Welcome back.')
      router.push('/customer/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-brand-500 p-2"><Package className="h-5 w-5" /></div>
          <div>
            <p className="font-display text-lg uppercase">Midwest</p>
            <p className="text-xs uppercase tracking-[0.25em] text-brand-300">Shipment Company</p>
          </div>
        </Link>
        <div>
          <p className="section-subtitle text-brand-300">Customer access</p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-tight">Track every shipment from one secure dashboard.</h1>
          <p className="mt-5 max-w-xl text-slate-300">View shipment history, upload delivery documents, monitor notifications, and contact support.</p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <form onSubmit={submit} className="w-full max-w-md border border-gray-100 bg-white p-6 shadow-sm">
          <p className="section-subtitle">Customer login</p>
          <h2 className="mt-2 font-display text-3xl uppercase text-navy-900">Welcome back</h2>
          <label className="mt-6 block">
            <span className="label">Email</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-10" />
            </div>
          </label>
          <label className="mt-4 block">
            <span className="label">Password</span>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pl-10" />
            </div>
          </label>
          <button disabled={loading} className="btn-primary mt-6 w-full justify-center">{loading ? 'Signing in...' : 'Login'}</button>
          <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
            <Link href="/customer/register" className="font-semibold text-brand-600">Create account</Link>
            <Link href="/customer/forgot-password" className="font-semibold text-navy-700">Forgot password?</Link>
          </div>
        </form>
      </section>
    </main>
  )
}
