import type { Metadata } from 'next'
import { Barlow, Oswald } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import SupportChatWidget from '@/components/ui/SupportChatWidget'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
import ErrorBoundary from '@/components/ErrorBoundary'
import './globals.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Midwest Shipment Company | Fast, Reliable Logistics',
  description: 'Midwest Shipment Company – delivering packages across the USA with speed, reliability, and care. Track your shipment in real time.',
  keywords: 'shipping, logistics, courier, tracking, freight, Columbus Ohio, midwest delivery',
  openGraph: {
    title: 'Midwest Shipment Company',
    description: 'Fast, reliable logistics across the USA',
    type: 'website',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${oswald.variable}`}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <ServiceWorkerRegistrar />
        <SupportChatWidget />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'var(--font-barlow)', fontSize: '14px', fontWeight: 500 }
          }}
        />
      </body>
    </html>
  )
}