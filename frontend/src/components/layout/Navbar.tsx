'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { Clock3, Mail, Package, Phone, ShieldCheck } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Track', href: '/track' },
  { label: 'Support', href: '/support' },
  { label: 'Contact', href: '/contact' },
]

const languages = [
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
  { value: 'fr', label: 'FR' },
  { value: 'de', label: 'DE' },
  { value: 'it', label: 'IT' },
]

const handleLanguageChange = (value: string) => {
  if (value === 'en') {
    return
  }

  const translatedUrl = `https://translate.google.com/translate?hl=en&sl=auto&tl=${value}&u=${encodeURIComponent(window.location.href)}`
  window.open(translatedUrl, '_blank', 'noopener,noreferrer')
}

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(!!Cookies.get('msc_admin_token'))
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      <div className="border-b border-gray-100 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-[0.7rem] uppercase tracking-[0.3em]">
          <div className="flex flex-wrap items-center gap-4 text-gray-200">
            <span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-brand-300" /> Open 24/7 for Global Logistics</span>
            <span className="inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-brand-300" /> Toll Free Support</span>
          </div>
          <a href="mailto:info@midwestshipment.com" className="inline-flex items-center gap-2 text-gray-100 hover:text-brand-300">
            <Mail className="h-3.5 w-3.5 text-brand-300" /> info@midwestshipment.com
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-brand-500 p-2">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-lg font-bold uppercase tracking-[0.2em] text-navy-900">Midwest</div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-500">Shipment Company</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gray-600 transition-colors hover:text-brand-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/contact" className="hidden rounded-none bg-slate-950 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-brand-500 sm:inline-flex">
            Request Quote
          </Link>

          <Link
            href={isAdmin ? '/admin/dashboard' : '/admin/login'}
            className="hidden rounded-none border border-slate-950 bg-white px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-950 transition-colors hover:border-brand-500 hover:text-brand-500 sm:inline-flex"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            {isAdmin ? 'Admin Portal' : 'Admin Login'}
          </Link>

          <div className="language-switcher shrink-0">
            <span className="language-switcher__label" aria-hidden="true">
              <span className="language-switcher__icon">🌐</span>
              <span>Language</span>
            </span>
            <select
              aria-label="Language switch"
              defaultValue="en"
              onChange={(event) => handleLanguageChange(event.target.value)}
              className="language-switcher__select"
            >
              {languages.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}