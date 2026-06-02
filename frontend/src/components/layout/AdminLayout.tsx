'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import api from '@/lib/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'
import { Package, LayoutDashboard, Truck, MessageSquare, Headphones, LogOut, Menu, X, Settings, ChevronRight, Search, Bell, ChevronDown } from 'lucide-react'
import type { Admin } from '@/types'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/shipments', icon: Truck, label: 'Shipments' },
  { href: '/admin/support', icon: Headphones, label: 'Support Center' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const token = Cookies.get('msc_admin_token')
    if (!token) { router.push('/admin/login'); return }
    api.get('/auth/me')
      .then((res) => setAdmin(res.data.admin))
      .catch(() => {
        Cookies.remove('msc_admin_token')
        router.push('/admin/login')
      })
      .finally(() => setCheckingAuth(false))
  }, [])

  const logout = () => {
    Cookies.remove('msc_admin_token')
    router.push('/admin/login')
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 flex flex-col transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:inset-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-navy-700">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="bg-brand-500 p-2"><Package className="w-5 h-5 text-white" /></div>
            <div>
              <div className="font-display text-white text-sm uppercase font-bold">Midwest</div>
              <div className="text-brand-400 text-[9px] font-bold uppercase tracking-widest">Admin Portal</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors',
                pathname.startsWith(href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-navy-700 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {pathname.startsWith(href) && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* User */}
        {admin && (
          <div className="border-t border-navy-700 px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-sm font-semibold truncate">{admin.name}</p>
                <p className="text-gray-400 text-xs capitalize">{admin.role.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1 text-gray-400 hover:text-white text-xs py-1.5 px-2 hover:bg-navy-700 text-center transition-colors">
                Site
              </Link>
              <button onClick={logout} className="flex-1 text-gray-400 hover:text-red-400 text-xs py-1.5 px-2 hover:bg-navy-700 flex items-center justify-center gap-1 transition-colors">
                <LogOut className="w-3 h-3" /> Logout
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1 text-gray-600">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3 text-sm font-semibold text-navy-900">
              <span className="hidden sm:inline">Admin Portal</span>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline">Midwest Logistics</span>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search shipments, tracking IDs, customers..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <button className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-gray-600 hover:bg-slate-200">
              <Bell className="h-5 w-5" />
            </button>
            {admin && (
              <div className="relative">
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold uppercase text-white">
                    {admin.name.charAt(0)}
                  </span>
                  <span className="hidden sm:inline">{admin.name}</span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}