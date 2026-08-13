const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
const gaProp = lines.find(l => l.startsWith('GA_PROPERTY_ID')).split('=')[1].replace(/\"/g, '').trim();
const gaEmail = lines.find(l => l.startsWith('GA_CLIENT_EMAIL')).split('=')[1].replace(/\"/g, '').trim();
const gaKeyRaw = lines.find(l => l.startsWith('GA_PRIVATE_KEY')).split('=')[1].replace(/\"/g, '').trim();
const gaKey = gaKeyRaw.replace(/\\n/g, '\n');

const crypto = require('crypto');
async function run() {
  const email = gaEmail;
  const privateKey = gaKey;
  
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: email,
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
  console.log('Auth:', data);
  
  if (data.access_token) {
    const pId = gaProp;
    const repRes = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: `7daysAgo`, endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }]
      })
    });
    console.log('Report Status:', repRes.status);
    console.log('Report Data:', await repRes.text());
  }
}
run();
