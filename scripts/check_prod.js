const urls = {
  backendHealth: 'https://midwest-shipment.midwestlogistics.workers.dev/api/health',
  backendTrackWithPrefix: 'https://midwest-shipment.midwestlogistics.workers.dev/api/shipments/track/MSC-2762369700',
  backendTrackNoPrefix: 'https://midwest-shipment.midwestlogistics.workers.dev/api/shipments/track/2762369700',
  frontendTrack: 'https://midwest-shipment.pages.dev/track?id=2762369700',
  frontendRoot: 'https://midwest-shipment.pages.dev/'
}

async function check(url) {
  try {
    const res = await fetch(url, { method: 'GET' })
    const text = await res.text()
    return { ok: res.ok, status: res.status, length: text.length }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

(async () => {
  console.log('Running production checks...')
  let allOk = true
  for (const [k, u] of Object.entries(urls)) {
    process.stdout.write(`${k}: ${u} `)
    const r = await check(u)
    if (r.ok) {
      console.log(`OK (${r.status}) length=${r.length}`)
    } else {
      allOk = false
      console.log(`FAIL ${r.error || `(status ${r.status})`}`)
    }
  }
  process.exit(allOk ? 0 : 2)
})()
