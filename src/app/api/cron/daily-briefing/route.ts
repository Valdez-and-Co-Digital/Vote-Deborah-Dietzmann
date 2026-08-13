import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 1. Verify authorization (so only cron or admins can trigger it)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    // 2. Fetch some real analytics from our Supabase DB
    const { data: events } = await supabase.from('events').select('*');
    const { data: volunteers } = await supabase.from('volunteers').select('*');
    const { data: rsvps } = await supabase.from('rsvps').select('*');

    const recentEvents = events?.slice(0, 5) || [];
    const newVolunteersCount = volunteers?.filter(v => v.status === 'new').length || 0;
    const totalRsvps = rsvps?.length || 0;

    const dataSnapshot = `
      Campaign Status:
      - Upcoming Events: ${recentEvents.length} scheduled.
      - Total Volunteers: ${volunteers?.length || 0} (${newVolunteersCount} new).
      - Total RSVPs across all events: ${totalRsvps}.
      Local Area: ${process.env.LOCAL_AREA || 'the local district'}
    `;

    // 3. Prompt Gemini with Google Search tool enabled
    const prompt = `
      You are an expert campaign manager AI. We are running a judicial campaign for Deborah Dietzmann in ${process.env.LOCAL_AREA || 'Bexar County, Texas'}.
      Here is the latest data snapshot for the campaign:
      ${dataSnapshot}

      Based on this data, please generate a Daily Briefing formatted in Markdown.
      
      It must contain two sections:
      ### 📊 Campaign Recommendations
      (3 brief bullet points of actionable advice based on our data snapshot)

      ### 📱 Social Media Drafts
      Write two engaging social media posts connecting our judicial campaign to today's local news in ${process.env.LOCAL_AREA || 'Bexar County, Texas'}. 
      You MUST search the live web for local news. The topics should pertain to the candidate's interests:
      
      1. Infrastructure & Emergency Management: (e.g., Extreme weather, highway closures, broadband, power grid)
      2. Economic Development & Taxes: (e.g., Property tax appraisals, corporate moves, budget meetings)
      3. Public Safety & Justice: (e.g., Crime rates, bail laws, law enforcement funding, rehab facilities)
      4. Civic Engagement & Community Milestones: (e.g., High school sports championships, charity drives, election deadlines)
      
      Draft the posts from the County Judge perspective, positioning them as a proactive, empathetic leader and a community pillar.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });

    const markdownText = response.text || '';

    // 4. Save to Database
    const { error: insertError } = await supabase.from('daily_briefings').insert({
      analytics_summary: 'Generated from real campaign data',
      social_media_drafts: 'Generated via Gemini with Google Search',
      raw_markdown: markdownText,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Briefing generated successfully' });
  } catch (error) {
    console.error("Error generating briefing:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
