import React from 'react'

type Props = {
  tracking?: string | null
}

export default function Barcode({ tracking }: Props) {
  const id = tracking || 'unknown'
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000'
  const src = `${apiBaseUrl}/barcodes/${encodeURIComponent(id)}.png`

  return (
    <div className="barcode-area">
      <img src={src} alt={`Barcode for ${id}`} />
      <p>{id}</p>
    </div>
  )
}
