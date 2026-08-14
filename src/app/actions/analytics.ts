'use server';

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
  if (!res.ok) throw new Error(data.error_description || 'Failed to get access token');
  
  return data.access_token;
}

async function runReport(accessToken: string, propertyId: string, body: any) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Analytics API Error:", errorText);
    throw new Error('Analytics API Request Failed');
  }
  return res.json();
}

export async function getAnalyticsData(days = 7) {
  try {
    const hasPropertyId = !!process.env.GA_PROPERTY_ID;
    const hasClientEmail = !!process.env.GA_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.GA_PRIVATE_KEY;
    console.log('[Analytics] Env check:', { hasPropertyId, hasClientEmail, hasPrivateKey });

    if (!hasPropertyId || !hasClientEmail || !hasPrivateKey) {
      console.warn("[Analytics] Missing GA credentials. Returning fallback data.");
      return getFallbackData();
    }

    const propertyId = process.env.GA_PROPERTY_ID!.replace(/^"|"$/g, '').trim();
    const clientEmail = process.env.GA_CLIENT_EMAIL!.replace(/^"|"$/g, '').trim();
    // Handle both cases: literal \n (from Cloudflare) and already-real newlines
    let privateKey = process.env.GA_PRIVATE_KEY!.replace(/^"|"$/g, '').trim();
    if (!privateKey.includes('\n')) {
      // Cloudflare may store as literal \n — convert them to real newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    console.log('[Analytics] propertyId:', propertyId);
    console.log('[Analytics] clientEmail:', clientEmail);
    console.log('[Analytics] privateKey starts:', privateKey.substring(0, 27));
    console.log('[Analytics] privateKey has real newlines:', privateKey.includes('\n'));

    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    console.log('[Analytics] Got access token successfully');

    const [overviewResponse, pagesResponse, sourcesResponse, devicesResponse, timeseriesResponse] = await Promise.all([
      runReport(accessToken, propertyId, {
        dateRanges: [
          { startDate: `${days}daysAgo`, endDate: 'today' },
          { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` },
        ],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 6,
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }],
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
      })
    ]);

    // Parse Overview
    const current = overviewResponse.rows?.[0]?.metricValues || [];
    const previous = overviewResponse.rows?.length && overviewResponse.rows.length > 1 ? overviewResponse.rows[1]?.metricValues || [] : current;

    const currentUsers = parseInt(current[0]?.value || '0', 10);
    const prevUsers = parseInt(previous[0]?.value || '0', 10);
    const currentViews = parseInt(current[1]?.value || '0', 10);
    const prevViews = parseInt(previous[1]?.value || '0', 10);
    const currentBounceRaw = parseFloat(current[2]?.value || '0');
    const currentBounce = (currentBounceRaw * 100).toFixed(1);
    const prevBounceRaw = parseFloat(previous[2]?.value || '0');
    const currentDurationRaw = parseFloat(current[3]?.value || '0');
    const currentDuration = formatDuration(currentDurationRaw);
    const prevDurationRaw = parseFloat(previous[3]?.value || '0');

    // Parse Top Pages
    const maxViews = parseInt(pagesResponse.rows?.[0]?.metricValues?.[0]?.value || '1', 10);
    const topPages = (pagesResponse.rows || []).map((row: any) => {
      const name = row.dimensionValues?.[0]?.value || 'Unknown';
      const rawViews = parseInt(row.metricValues?.[0]?.value || '0', 10);
      return {
        name: name.replace(' - Deborah Dietzmann for Judge', '').substring(0, 20),
        views: `${rawViews.toLocaleString()} views`,
        pct: Math.round((rawViews / (maxViews || 1)) * 100)
      };
    });

    // Parse Sources
    const sourceColors = ['bg-[#0a1f44]', 'bg-heritage-gold', 'bg-[#4285F4]', 'bg-[#9CA3AF]', 'bg-outline-variant'];
    let totalSessions = 0;
    const sourcesRaw = (sourcesResponse.rows || []).map((row: any) => {
      const val = parseInt(row.metricValues?.[0]?.value || '0', 10);
      totalSessions += val;
      return { name: row.dimensionValues?.[0]?.value || 'Unknown', raw: val };
    });
    const trafficSources = sourcesRaw.slice(0, 5).map((s: any, i: number) => ({
      name: s.name,
      pct: totalSessions > 0 ? `${Math.round((s.raw / totalSessions) * 100)}%` : '0%',
      color: sourceColors[i] || sourceColors[0]
    }));

    // Parse Devices
    let desktop = 0, mobile = 0, tablet = 0, deviceTotal = 0;
    (devicesResponse.rows || []).forEach((row: any) => {
      const name = (row.dimensionValues?.[0]?.value || '').toLowerCase();
      const val = parseInt(row.metricValues?.[0]?.value || '0', 10);
      deviceTotal += val;
      if (name === 'desktop') desktop += val;
      else if (name === 'mobile') mobile += val;
      else tablet += val;
    });

    const deviceBreakdown = {
      desktop: deviceTotal > 0 ? Math.round((desktop / deviceTotal) * 100) : 0,
      mobile: deviceTotal > 0 ? Math.round((mobile / deviceTotal) * 100) : 0,
      tablet: deviceTotal > 0 ? Math.round((tablet / deviceTotal) * 100) : 0,
    };

    // Parse Traffic Over Time
    const trafficOverTime = (timeseriesResponse.rows || []).map((row: any) => {
      const dateStr = row.dimensionValues?.[0]?.value || '';
      const formatted = dateStr ? new Date(`${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : 'Unknown';
      return {
        date: formatted,
        visitors: parseInt(row.metricValues?.[0]?.value || '0', 10)
      };
    });

    const baseData = {
      visitors: {
        value: currentUsers.toLocaleString(),
        trend: calculateTrend(currentUsers, prevUsers)
      },
      pageViews: {
        value: currentViews.toLocaleString(),
        trend: calculateTrend(currentViews, prevViews)
      },
      bounceRate: {
        value: `${currentBounce}%`,
        trend: calculateTrend(currentBounceRaw, prevBounceRaw, true)
      },
      avgSession: {
        value: currentDuration,
        trend: calculateTrend(currentDurationRaw, prevDurationRaw)
      },
      topPages,
      trafficSources,
      deviceBreakdown,
      trafficOverTime
    };

    // Generate AI Insights
    let insights = [];
    try {
      if (process.env.GEMINI_API_KEY) {
        insights = await generateInsights(baseData);
      }
    } catch (e) {
      console.error("Failed to generate AI insights:", e);
    }

    return { ...baseData, insights };
  } catch (error: any) {
    console.error("[Analytics] Error fetching GA Data:", error?.message || error);
    console.error("[Analytics] Error stack:", error?.stack);

    return getFallbackData();
  }
}

function calculateTrend(current: number, previous: number, invert = false) {
  if (previous === 0) return { value: '+0%', isPositive: true };
  const diff = current - previous;
  const pct = (diff / previous) * 100;
  
  let isPositive = pct >= 0;
  if (invert) {
    isPositive = pct <= 0;
  }

  const sign = pct >= 0 ? '+' : '';
  return {
    value: `${sign}${pct.toFixed(1)}%`,
    isPositive
  };
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function getFallbackData() {
  return {
    visitors: { value: '0', trend: { value: '0%', isPositive: true } },
    pageViews: { value: '0', trend: { value: '0%', isPositive: true } },
    bounceRate: { value: '0%', trend: { value: '0%', isPositive: true } },
    avgSession: { value: '0s', trend: { value: '0%', isPositive: true } },
    topPages: [
      { name: 'Home', views: '0 views', pct: 0 }
    ],
    trafficSources: [
      { name: 'Direct', pct: '0%', color: 'bg-[#0a1f44]' }
    ],
    deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
    trafficOverTime: [
      { date: 'Oct 1', visitors: 10 },
      { date: 'Oct 2', visitors: 15 },
      { date: 'Oct 3', visitors: 12 },
      { date: 'Oct 4', visitors: 20 },
      { date: 'Oct 5', visitors: 25 },
    ],
    insights: []
  };
}

async function generateInsights(gaData: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const prompt = `
    You are an expert web analytics AI. Here is the latest website traffic data:
    ${JSON.stringify(gaData, null, 2)}
    
    Analyze the data and provide exactly 2 short, actionable insights. 
    Make one insight positive (e.g., highlighting good traffic or engagement) and one highlighting an area for improvement (e.g., bounce rate, low mobile usage).
    Return a JSON array of 2 objects, each with:
    - "title": A short bold title (e.g., "Traffic Spike Detected")
    - "description": A 1-2 sentence description of the insight and a suggested action.
    - "type": either "positive" or "warning"
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/antigravity-preview-05-2026:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                type: { type: "string", enum: ["positive", "warning"] }
              },
              required: ["title", "description", "type"]
            }
          }
        }
      })
    });

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return [];
    }

    const data = await response.json();
    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (outputText) {
      return JSON.parse(outputText);
    }
  } catch (e) {
    console.error("Failed to fetch insights:", e);
  }
  
  return [];
}
