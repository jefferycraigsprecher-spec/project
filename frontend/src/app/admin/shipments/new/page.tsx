'use client'

import dynamic from 'next/dynamic'

const AdminShipmentNewClient = dynamic(() => import('./AdminShipmentNewClient'), {
  ssr: false,
})

export default function Page() {
  return <AdminShipmentNewClient />
}
