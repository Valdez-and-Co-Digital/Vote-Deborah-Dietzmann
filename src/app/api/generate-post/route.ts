import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { article, tone } = await request.json();

    if (!article || !article.title) {
      return NextResponse.json({ error: 'Missing article context' }, { status: 400 });
    }

    const prompt = `
      You are an expert campaign manager AI. We are running a judicial campaign for Deborah Dietzmann in ${process.env.LOCAL_AREA || 'Bexar County, Texas'}.
      
      You need to generate a social media post based on the following news article:
      Title: ${article.title}
      Publisher: ${article.publisher || 'Local News'}
      Snippet: ${article.snippet || ''}
      
      Write the post from the candidate's perspective or campaign perspective.
      The tone should be: ${tone || 'Professional and engaging'}.
      Position the candidate as a proactive, empathetic leader.
      
      CRITICAL: You MUST include the hashtag #VoteDietzmann at the end of the caption, alongside any other relevant hashtags you choose.
      
      CRITICAL: Output ONLY the social media caption text. Do not include quotes around it, do not include any other commentary, and do not use a JSON block. Just the caption.
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return NextResponse.json({ error: 'Failed to generate post from AI' }, { status: 500 });
    }

    const data = await response.json();
    const generated_caption = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ success: true, caption: generated_caption.trim() });
  } catch (error: any) {
    console.error("Error generating post:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
