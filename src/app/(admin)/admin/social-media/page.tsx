"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface NewsItem {
  publisher: string;
  time_ago: string;
  title: string;
  snippet: string;
  category: string;
}

interface Recommendation {
  based_on_title: string;
  article_link?: string;
  goal: string;
  generated_caption: string;
}

interface SocialMediaData {
  trending_news: NewsItem[];
  recommendations: Recommendation[];
}

export default function SocialMediaPage() {
  const [data, setData] = useState<SocialMediaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    setLoading(true);
    try {
      const { data: briefing, error } = await supabase
        .from('daily_briefings')
        .select('social_media_json, created_at')
        .not('social_media_json', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      if (briefing?.social_media_json) {
        setData(briefing.social_media_json as SocialMediaData);
      } else {
        setData(null);
      }
    } catch (err: any) {
      console.error("Error fetching social media data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const generateNewData = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/cron/daily-briefing');
      if (!res.ok) {
        let errMsg = "API Route Failed";
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch(e) {}
        throw new Error(errMsg);
      }
      await fetchLatestData();
    } catch (err: any) {
      console.error("Error generating data:", err);
      setError(`Failed to generate new AI content: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pt-16 md:pt-8">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center gap-4 mb-6">
        <span className="material-symbols-outlined text-primary text-2xl">arrow_back</span>
        <h1 className="font-headline-md text-primary text-lg font-bold tracking-widest uppercase">Social Media</h1>
      </div>

      <div className="hidden md:flex mb-8 justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-primary text-2xl md:text-3xl mb-1">Social Media Management</h1>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          <select className="bg-surface-container-low border border-outline-variant/30 rounded-xl py-2 px-4 text-sm focus:outline-none">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <button 
            onClick={generateNewData}
            disabled={isGenerating}
            className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${isGenerating ? 'animate-spin' : ''}`}>
              refresh
            </span>
            {isGenerating ? 'Generating...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-error/10 text-error rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-legal-gray">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          <p className="font-body-md animate-pulse">Loading social media insights...</p>
        </div>
      ) : !data ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-legal-gray border-2 border-dashed border-outline-variant/30 rounded-2xl">
          <span className="material-symbols-outlined text-4xl opacity-50">newspaper</span>
          <p className="font-body-md text-center">No social media recommendations found.<br/>Click Refresh Data to generate.</p>
          <button onClick={generateNewData} className="btn-primary mt-2">Generate Now</button>
        </div>
      ) : (
        <>
          {/* Trending News Section */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">newspaper</span>
              <h2 className="font-headline-md text-primary text-xl font-bold">Trending News</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.trending_news?.map((news, idx) => (
                <div key={idx} className="bg-neutral-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm flex flex-col p-5">
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#0a1f44] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {news.category}
                      </span>
                      <div className="text-xs text-legal-gray font-body-sm">
                        {news.time_ago}
                      </div>
                    </div>
                    <h3 className="font-headline-sm text-primary font-bold mb-3 leading-tight">
                      {news.title}
                    </h3>
                    <p className="text-sm font-body-sm text-legal-gray line-clamp-3">
                      {news.snippet}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Content Recommendations */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-heritage-gold">auto_awesome</span>
              <h2 className="font-headline-md text-primary text-xl font-bold">AI Content Recommendations</h2>
            </div>

            <div className="space-y-6">
              {data.recommendations?.map((rec, idx) => (
                <div key={idx} className="bg-neutral-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-outline-variant/30 gap-4">
                    <div className="flex items-center gap-2 text-sm text-legal-gray flex-1 min-w-0">
                      <span className="material-symbols-outlined text-[18px] shrink-0">link</span>
                      <span className="font-body-md truncate">Based on: <strong className="text-primary">{rec.based_on_title}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      {rec.goal}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Source Article Link */}
                    <div>
                      <h4 className="text-xs font-label-bold text-legal-gray uppercase tracking-wider mb-3">Source Article</h4>
                      <div className="h-48 bg-surface-container-lowest border border-outline-variant/50 rounded-xl flex flex-col items-center justify-center text-center p-4">
                        <span className="material-symbols-outlined text-4xl mb-2 text-primary">link</span>
                        <span className="text-sm font-body-md mb-3 text-on-surface-variant">Link to original story</span>
                        {rec.article_link ? (
                          <a href={rec.article_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-label-md bg-primary/10 px-6 py-2.5 rounded-full inline-block truncate max-w-full">
                            Read Article
                          </a>
                        ) : (
                          <span className="text-outline text-sm">No link provided</span>
                        )}
                      </div>
                    </div>

                    {/* Generated Caption */}
                    <div className="flex flex-col">
                      <h4 className="text-xs font-label-bold text-legal-gray uppercase tracking-wider mb-3">Generated Caption</h4>
                      <div className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 text-primary font-body-sm whitespace-pre-wrap">
                        {rec.generated_caption}
                      </div>
                      <div className="flex gap-3 mt-4 justify-end">
                        <button 
                          onClick={() => copyToClipboard(rec.generated_caption, idx)}
                          className="px-4 py-2 text-sm font-label-bold text-primary border border-outline-variant/50 rounded-lg hover:bg-surface-container-low transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {copiedIndex === idx ? 'check' : 'content_copy'}
                          </span>
                          {copiedIndex === idx ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                        <button className="px-4 py-2 text-sm font-label-bold text-white bg-[#0a1f44] rounded-lg hover:bg-[#0a1f44]/90 transition-colors flex items-center gap-2 shadow-sm">
                          <span className="material-symbols-outlined text-[18px]">send</span>
                          Post Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
