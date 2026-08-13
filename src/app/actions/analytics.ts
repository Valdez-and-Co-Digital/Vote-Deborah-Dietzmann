'use server';

import crypto from 'node:crypto';
import { GoogleGenAI } from '@google/genai';

// Minimal JWT signer to avoid bringing in 13MB of Google/gRPC SDKs that crash Cloudflare Free Tier
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

  const encodeB64Url = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');
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
    if (!process.env.GA_PROPERTY_ID || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
      console.warn("Missing GA credentials. Returning fallback data.");
      return getFallbackData();
    }

    const propertyId = process.env.GA_PROPERTY_ID.replace(/^"|"$/g, '').trim();
    const clientEmail = process.env.GA_CLIENT_EMAIL.replace(/^"|"$/g, '').trim();
    const privateKey = process.env.GA_PRIVATE_KEY.replace(/^"|"$/g, '').trim().replace(/\\n/g, '\n');
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);

    const [overviewResponse, pagesResponse, sourcesResponse, devicesResponse] = await Promise.all([
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
      deviceBreakdown
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
  } catch (error) {
    console.error("Error fetching GA Data:", error);
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
    insights: []
  };
}

async function generateInsights(gaData: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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

  const response = await ai.interactions.create({
    model: 'gemini-3.6-flash',
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: {
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
  });

  if (response.output_text) {
    return JSON.parse(response.output_text);
  }
  return [];
}
