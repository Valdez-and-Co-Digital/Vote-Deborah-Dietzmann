export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Verify authorization
    const authHeader = request.headers.get('authorization');
    const isCron = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!user && !isCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    // 2. Fetch data
    const { data: events } = await supabase.from('events').select('*');
    const { data: volunteers } = await supabase.from('volunteers').select('*');
    const { data: rsvps } = await supabase.from('rsvps').select('*');

    // Basic logic
    const upcomingEvents = events?.filter(e => new Date(e.date) > new Date()) || [];
    const recentVolunteers = volunteers?.filter(v => new Date(v.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) || [];
    const totalRsvps = rsvps?.length || 0;

    const eventDetails = upcomingEvents.map(e => {
        const eventRsvps = rsvps?.filter(r => r.event_id === e.id).length || 0;
        return `- ${e.title} (${new Date(e.date).toLocaleDateString()}): ${eventRsvps} RSVPs`;
    }).join('\n');

    const dataSnapshot = `
      Campaign Internal Status:
      - Upcoming Events: ${upcomingEvents.length} scheduled.
      ${eventDetails}
      - Total Volunteers: ${volunteers?.length || 0} (${recentVolunteers.length} new in last 7 days).
      - Total RSVPs across all events: ${totalRsvps}.
    `;

    // 3. Prompt Gemini
    const prompt = `
      You are the Chief of Staff AI for the Deborah Dietzmann judicial campaign.
      Here is the latest data snapshot for the campaign's internal operations:
      ${dataSnapshot}

      Based on this data, please generate an Operational Briefing formatted in Markdown.
      Focus ONLY on internal tasks, alerts, and actionable advice based on the data.
      Do NOT write social media posts or search the web.

      Format it as a concise checklist or bulleted list of 3-4 highly actionable recommendations.
      For example: 
      - "The Meet and Greet event only has 2 RSVPs. Send an email blast today."
      - "We have 4 new volunteers this week. Ensure the volunteer coordinator has reached out."
    `;

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/antigravity-preview-05-2026:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return NextResponse.json({ error: 'Failed to generate posts from AI' }, { status: 500 });
    }

    const data = await response.json();
    const markdownText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // 4. Save to Database using Admin Client to bypass RLS
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: insertError } = await supabaseAdmin.from('daily_briefings').insert({
      analytics_summary: 'DASHBOARD_OPERATIONS',
      social_media_drafts: 'N/A',
      raw_markdown: markdownText,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Operations briefing generated successfully' });
  } catch (error) {
    console.error("Error generating briefing:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
