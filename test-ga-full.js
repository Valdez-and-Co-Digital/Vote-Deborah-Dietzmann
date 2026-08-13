const { loadEnvConfig } = require('@next/env');
loadEnvConfig('./');
const crypto = require('crypto');

async function run() {
  const propertyId = process.env.GA_PROPERTY_ID.replace(/^"|"$/g, '').trim();
  const clientEmail = process.env.GA_CLIENT_EMAIL.replace(/^"|"$/g, '').trim();
  const privateKey = process.env.GA_PRIVATE_KEY.replace(/^"|"$/g, '').trim().replace(/\\n/g, '\n');

  console.log('prop', propertyId);
  console.log('email', clientEmail);
  console.log('key begins with:', privateKey.substring(0, 30));

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodeB64Url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signatureInput = `${encodeB64Url(header)}.${encodeB64Url(payload)}`;
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  sign.end();
  
  const signature = sign.sign(privateKey, 'base64url');
  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  
  const data = await res.json();
  console.log('Token data:', data.access_token ? "Success" : data);

  if (data.access_token) {
    const res2 = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: `7daysAgo`, endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }]
      })
    });
    console.log("GA Status:", res2.status);
    console.log("GA Data:", await res2.text());
  }
}
run().catch(console.error);
