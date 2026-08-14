import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
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

    const parser = new Parser();
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(process.env.LOCAL_AREA || 'Bexar County, Texas')}&hl=en-US&gl=US&ceid=US:en`;
    const feed = await parser.parseURL(feedUrl);
    
    // Parse top 6 articles
    const trendingNews = feed.items.slice(0, 6).map((item: any) => {
      // Google News titles usually look like "Article Title - Publisher Name"
      const titleParts = item.title.split(' - ');
      const publisher = titleParts.length > 1 ? titleParts.pop() : 'Local News';
      const cleanTitle = titleParts.join(' - ');
      
      // Fallback Google Search link if RSS link is broken
      const fallbackLink = `https://www.google.com/search?q=${encodeURIComponent(cleanTitle)}`;
      
      return {
        title: cleanTitle,
        publisher: publisher,
        time_ago: timeAgo(item.pubDate),
        snippet: item.contentSnippet || 'Click to read more about this local story...',
        article_link: fallbackLink,
        category: 'Local'
      };
    });

    return NextResponse.json({ success: true, trending_news: trendingNews });
  } catch (error: any) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}

