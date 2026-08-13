'use server';

import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function getAnalyticsData(days = 7) {
  try {
    if (!process.env.GA_PROPERTY_ID || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
      console.warn("Missing GA credentials. Returning fallback data.");
      return getFallbackData();
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    const property = `properties/${process.env.GA_PROPERTY_ID}`;

    const [overviewResponse, pagesResponse, sourcesResponse, devicesResponse] = await Promise.all([
      analyticsDataClient.runReport({
        property,
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
      analyticsDataClient.runReport({
        property,
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 6,
      }),
      analyticsDataClient.runReport({
        property,
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),
      analyticsDataClient.runReport({
        property,
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
    const topPages = (pagesResponse.rows || []).map(row => {
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
    const sourcesRaw = (sourcesResponse.rows || []).map(row => {
      const val = parseInt(row.metricValues?.[0]?.value || '0', 10);
      totalSessions += val;
      return { name: row.dimensionValues?.[0]?.value || 'Unknown', raw: val };
    });
    const trafficSources = sourcesRaw.slice(0, 5).map((s, i) => ({
      name: s.name,
      pct: totalSessions > 0 ? `${Math.round((s.raw / totalSessions) * 100)}%` : '0%',
      color: sourceColors[i] || sourceColors[0]
    }));

    // Parse Devices
    let desktop = 0, mobile = 0, tablet = 0, deviceTotal = 0;
    (devicesResponse.rows || []).forEach(row => {
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

    return {
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
    deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 }
  };
}
