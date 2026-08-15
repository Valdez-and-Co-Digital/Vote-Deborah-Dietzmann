import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    const prompt = `
      You are an expert campaign manager AI for Deborah Dietzmann, a candidate for Judge in Bexar County, Texas.
      Please analyze this event photo (crowd size, signs, atmosphere, key people) and draft three pieces of campaign content based ONLY on the context of this photo:

      1. "pressRelease": A short 2-3 paragraph press release summarizing the event.
      2. "socialPost": A compelling social media post with the hashtag #VoteDietzmann.
      3. "newsletterExcerpt": A 1-2 paragraph snippet for the weekly campaign email newsletter.

      Return the result as a JSON object with keys: "pressRelease", "socialPost", "newsletterExcerpt".
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    // Clean base64 string if it has the data URI prefix
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];
    let lastError = null;
    let generated_text = '{}';

    for (const model of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: mimeType || 'image/jpeg',
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  pressRelease: { type: "string" },
                  socialPost: { type: "string" },
                  newsletterExcerpt: { type: "string" }
                },
                required: ["pressRelease", "socialPost", "newsletterExcerpt"]
              }
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          generated_text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          if (generated_text !== '{}') {
            console.log(`Successfully generated using ${model}`);
            break;
          }
        } else {
          lastError = await response.text();
          console.warn(`Model ${model} failed:`, lastError);
        }
      } catch (err: any) {
        lastError = err.message;
        console.warn(`Network error with model ${model}:`, err.message);
      }
    }

    if (generated_text === '{}') {
      console.error("All Gemini fallback models failed. Last error:", lastError);
      return NextResponse.json({ error: 'Failed to analyze image after trying multiple models' }, { status: 500 });
    }

    const parsed = JSON.parse(generated_text);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error analyzing event media:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
