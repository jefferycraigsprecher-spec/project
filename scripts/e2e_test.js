(async () => {
  const API = 'http://localhost:5000/api';
  try {
    console.log('Logging in as seeded admin...');
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'devadmin@midwestshipment.com', password: 'DevAdmin@123' })
    });
    const loginJson = await loginRes.json();
    if (!loginJson.success) throw new Error('Login failed: ' + JSON.stringify(loginJson));
    const token = loginJson.token;
    console.log('Login success. Token length:', token.length);

    console.log('Creating shipment via admin API...');
    const shipmentPayload = {
      sender_name: 'E2E Sender',
      sender_email: 'sender@e2e.test',
      sender_phone: '+15550001111',
      sender_address: '100 Test Ave',
      sender_city: 'Columbus',
      sender_state: 'OH',
      sender_country: 'USA',
      recipient_name: 'E2E Recipient',
      recipient_email: 'e2e_recipient@e2e.test',
      recipient_phone: '+15550002222',
      recipient_address: '200 Test Blvd',
      recipient_city: 'Columbus',
      recipient_state: 'OH',
      recipient_country: 'USA',
      description: 'E2E automated test shipment',
      weight: 3.2,
      weight_unit: 'lbs',
      service_type: 'standard',
      status: 'processing'
    };

    const createRes = await fetch(`${API}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(shipmentPayload)
    });
    const createJson = await createRes.json();
    if (!createJson.success) throw new Error('Create shipment failed: ' + JSON.stringify(createJson));
    console.log('Shipment created:', createJson.tracking_id, 'id:', createJson.id);

    console.log('Verifying public tracking endpoint...');
    const trackRes = await fetch(`${API}/shipments/track/${createJson.tracking_id}?customer=${encodeURIComponent(shipmentPayload.recipient_email)}`);
    const trackJson = await trackRes.json();
    console.log('Track response success:', trackJson.success);
    console.log('Shipment status from track response:', trackJson.shipment?.status);

    process.exit(0);
  } catch (err) {
    console.error('E2E test error:', err);
    process.exit(1);
  }
})();
