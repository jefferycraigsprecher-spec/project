import Link from 'next/link'
import { Mail, MapPin, Phone, Package, Send } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Track Shipment', href: '/track' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact Us', href: '/contact' },
]

const serviceLinks = [
  { label: 'Air Freight', href: '/services' },
  { label: 'Ocean Freight', href: '/services' },
  { label: 'Road Transport', href: '/services' },
  { label: 'Warehousing', href: '/services' },
  { label: 'Express Delivery', href: '/services' },
  { label: 'Customs Clearance', href: '/services' },
]

const socials = [
  { name: 'Support', icon: Send, href: '#' },
  { name: 'Email', icon: Mail, href: 'mailto:info.midwestshipment@gmail.com' },
  { name: 'Phone', icon: Phone, href: 'tel:+1234567890' },
  { name: 'Address', icon: MapPin, href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-brand-500 p-2">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display text-lg font-bold uppercase">Midwest</div>
                <div className="text-brand-400 text-[10px] font-bold uppercase tracking-widest">Shipment Company</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-7">
              Premium courier and logistics solutions with global coverage, fast delivery, and trusted support for businesses and individuals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map(({ name, icon: Icon, href }) => (
                <a key={name} href={href} aria-label={name} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-brand-500">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-300 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-brand-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-300 mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-brand-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-300 mb-4">Newsletter</h4>
            <p className="text-sm text-gray-300 leading-7">
              Subscribe to shipping updates, industry news, and exclusive logistics offers.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="footer-newsletter" className="sr-only">Email address</label>
              <input
                id="footer-newsletter"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              <button type="submit" className="rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
                Subscribe
              </button>
            </form>
            <div className="mt-6 space-y-4 text-sm text-gray-300">
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <a href="mailto:info.midwestshipment@gmail.com" className="hover:text-brand-300">info.midwestshipment@gmail.com</a>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p>+1 239-746-8728</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Midwest Shipment Company. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-300">Privacy Policy</a>
            <a href="#" className="hover:text-brand-300">Terms of Service</a>
            <a href="#" className="hover:text-brand-300">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}