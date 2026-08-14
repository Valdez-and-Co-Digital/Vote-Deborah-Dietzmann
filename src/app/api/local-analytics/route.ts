import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, question } = await request.json();

    if (!data) {
      return NextResponse.json({ error: 'Missing data to analyze' }, { status: 400 });
    }

    const prompt = `
      You are Gemma 4, an advanced data analytics AI deployed in a secure local ecosystem for the Deborah Dietzmann judicial campaign.
      You have been provided with sensitive internal campaign data (e.g., donor lists, volunteer logs, or polling data).

      DATA:
      ${data}

      USER QUESTION:
      ${question || 'Please analyze this data and provide 3 key strategic insights or trends.'}

      Provide a clear, strategic answer based strictly on the provided data. Do not make up external information.
      Format your response in Markdown with clear headings and bullet points.
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    // Using gemini-3.7-flash to act as Gemma 4
    const modelEndpoint = 'gemini-3.7-flash';

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelEndpoint}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are Gemma 4, an advanced data analytics AI deployed in a secure local ecosystem for the Deborah Dietzmann judicial campaign. Format your response in Markdown with clear headings and bullet points." }]
        },
        contents: [{ parts: [{ text: `DATA:\n${data}\n\nUSER QUESTION:\n${question || 'Please analyze this data and provide 3 key strategic insights or trends.'}` }] }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemma API error:", err);
      return NextResponse.json({ error: 'Failed to analyze data via Gemma API' }, { status: 500 });
    }

    const resData = await response.json();
    const generated_text = resData.candidates?.[0]?.content?.parts?.[0]?.text || 'No insights generated.';

    return NextResponse.json({ success: true, answer: generated_text });
  } catch (error: any) {
    console.error("Error analyzing local data:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
