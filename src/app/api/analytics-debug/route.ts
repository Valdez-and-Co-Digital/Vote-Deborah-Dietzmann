import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function getGoogleAccessToken(clientEmail: string, privateKey: string) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodeB64Url = (str: string) => btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const signatureInput = `${encodeB64Url(JSON.stringify(header))}.${encodeB64Url(JSON.stringify(payload))}`;

  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = privateKey.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");

  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signatureInput)
  );

  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
  const signature = signatureBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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
  return { ok: res.ok, status: res.status, data };
}

export async function GET() {
  const diagnostics: Record<string, any> = {};

  // 1. Check env vars exist
  diagnostics.GA_PROPERTY_ID_set = !!process.env.GA_PROPERTY_ID;
  diagnostics.GA_CLIENT_EMAIL_set = !!process.env.GA_CLIENT_EMAIL;
  diagnostics.GA_PRIVATE_KEY_set = !!process.env.GA_PRIVATE_KEY;
  diagnostics.GEMINI_API_KEY_set = !!process.env.GEMINI_API_KEY;

  if (!process.env.GA_PROPERTY_ID || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
    return NextResponse.json({ step: 'env_check_failed', diagnostics });
  }

  // 2. Parse env vars
  const propertyId = process.env.GA_PROPERTY_ID.replace(/^"|"$/g, '').trim();
  const clientEmail = process.env.GA_CLIENT_EMAIL.replace(/^"|"$/g, '').trim();
  let privateKey = process.env.GA_PRIVATE_KEY.replace(/^"|"$/g, '').trim();

  const hasRealNewlines = privateKey.includes('\n');
  const hasLiteralSlashN = privateKey.includes('\\n');

  if (!hasRealNewlines && hasLiteralSlashN) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  diagnostics.propertyId = propertyId;
  diagnostics.clientEmail = clientEmail;
  diagnostics.privateKey_starts = privateKey.substring(0, 27);
  diagnostics.privateKey_ends = privateKey.slice(-25);
  diagnostics.privateKey_hasRealNewlines = hasRealNewlines;
  diagnostics.privateKey_hasLiteralSlashN = hasLiteralSlashN;
  diagnostics.privateKey_length = privateKey.length;

  // 3. Try getting access token
  try {
    const tokenResult = await getGoogleAccessToken(clientEmail, privateKey);
    diagnostics.tokenResult = {
      ok: tokenResult.ok,
      status: tokenResult.status,
      error: tokenResult.data?.error,
      error_description: tokenResult.data?.error_description,
      has_access_token: !!tokenResult.data?.access_token,
    };

    if (!tokenResult.ok || !tokenResult.data?.access_token) {
      return NextResponse.json({ step: 'token_failed', diagnostics });
    }

    // 4. Try running a GA report
    const accessToken = tokenResult.data.access_token;
    const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }]
      })
    });

    const gaData = await res.json();
    diagnostics.ga_status = res.status;
    diagnostics.ga_response = gaData;

    return NextResponse.json({ step: 'complete', diagnostics });
  } catch (e: any) {
    diagnostics.error = e?.message;
    diagnostics.stack = e?.stack?.split('\n').slice(0, 5);
    return NextResponse.json({ step: 'exception', diagnostics });
  }
}
