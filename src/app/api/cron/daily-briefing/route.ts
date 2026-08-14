import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (isNaN(seconds)) return 'Recently';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const isCron = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!user && !isCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const feedUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(process.env.LOCAL_AREA || 'Bexar County, Texas')}&format=rss`;
    
    // Use native fetch to support Cloudflare Edge runtime
    const res = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!res.ok) {
      throw new Error(`News RSS responded with status: ${res.status}`);
    }

    const text = await res.text();
    const trendingNews = [];
    
    // Parse XML using regex since we only need simple fields
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let count = 0;
    
    while ((match = itemRegex.exec(text)) !== null && count < 6) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
      const sourceMatch = itemXml.match(/<News:Source[^>]*>(.*?)<\/News:Source>/);
      const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/);
      
      if (titleMatch) {
        let rawTitle = titleMatch[1];
        // Clean up title (decode simple entities)
        rawTitle = rawTitle.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        
        let snippet = descMatch ? descMatch[1] : 'Click to read more about this local story...';
        // Strip HTML tags and decode common entities
        snippet = snippet.replace(/<[^>]*>?/gm, ''); 
        snippet = snippet.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        
        // Use provided link or fallback
        const articleLink = linkMatch ? linkMatch[1] : `https://www.bing.com/search?q=${encodeURIComponent(rawTitle)}`;
        
        trendingNews.push({
          title: rawTitle,
          publisher: sourceMatch ? sourceMatch[1].trim() : 'Local News',
          time_ago: timeAgo(pubDateMatch ? pubDateMatch[1] : new Date().toISOString()),
          snippet: snippet.substring(0, 150).trim() + '...',
          article_link: articleLink,
          category: 'Local'
        });
        
        count++;
      }
    }

    return NextResponse.json({ success: true, trending_news: trendingNews });
  } catch (error: any) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}


