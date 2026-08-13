import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 1. Verify authorization (allow either authenticated admins or the automated CRON_SECRET)
    const authHeader = request.headers.get('authorization');
    const isCron = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!user && !isCron) {
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
      Local Area: ${process.env.LOCAL_AREA || 'Bexar County, Texas'}
    `;

    // Fetch Live News from Google News RSS to use as Context
    const Parser = require('rss-parser');
    const parser = new Parser();
    let liveNewsContext = '';
    try {
      const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(process.env.LOCAL_AREA || 'Bexar County, Texas')}&hl=en-US&gl=US&ceid=US:en`;
      const feed = await parser.parseURL(feedUrl);
      const topArticles = feed.items.slice(0, 10).map((item: any) => `- Title: ${item.title}\n  Link: ${item.link}\n  Published: ${item.pubDate}`).join('\n\n');
      liveNewsContext = `\n\n=== LIVE NEWS FROM TODAY ===\n${topArticles}\n============================\n`;
    } catch (err) {
      console.error("Failed to fetch Google News RSS:", err);
    }

    // 3. Prompt Gemini
    const prompt = `
      You are an expert campaign manager AI. We are running a judicial campaign for Deborah Dietzmann in ${process.env.LOCAL_AREA || 'Bexar County, Texas'}.
      
      Here is the latest live news from today in the area:
      ${liveNewsContext}
      
      The topics should pertain to the candidate's interests:
      1. Infrastructure & Emergency Management (Local)
      2. Economic Development & Taxes (Local)
      3. Public Safety & Justice (Judicial)
      4. Civic Engagement & Community Milestones (Community)
      
      Analyze the live news provided above. Pick 3 trending news articles (one Local, one Judicial, one Community) that are most relevant.
      Then, generate 2 social media posts based on those news articles, written from the County Judge perspective.
      Position the Judge as a proactive, empathetic leader.
    `;

    const response = await ai.interactions.create({
        model: 'gemini-3.6-flash',
        input: prompt,
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: {
            type: "object",
            properties: {
              trending_news: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    publisher: { type: "string" },
                    time_ago: { type: "string" },
                    title: { type: "string" },
                    snippet: { type: "string" },
                    category: { type: "string", description: "e.g., Local, Judicial, Community" }
                  },
                  required: ["publisher", "time_ago", "title", "snippet", "category"]
                }
              },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    based_on_title: { type: "string" },
                    article_link: { type: "string", description: "The exact URL link of the article from the live news provided" },
                    goal: { type: "string", description: "e.g., Engagement Goal, Issue Awareness" },
                    generated_caption: { type: "string" }
                  },
                  required: ["based_on_title", "article_link", "goal", "generated_caption"]
                }
              }
            },
            required: ["trending_news", "recommendations"]
          }
        }
    });

    const jsonText = response.output_text || '{}';
    let parsedJson = null;
    try {
      parsedJson = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", e);
    }

    // 4. Save to Database using Admin Client to bypass RLS
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: insertError } = await supabaseAdmin.from('daily_briefings').insert({
      analytics_summary: 'Moved to Dashboard Operations',
      social_media_drafts: 'Structured JSON via Gemini',
      social_media_json: parsedJson,
      raw_markdown: 'Legacy markdown fallback',
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: `Failed to save to database: ${insertError.message || JSON.stringify(insertError)}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Briefing generated successfully' });
  } catch (error: any) {
    console.error("Error generating briefing:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
