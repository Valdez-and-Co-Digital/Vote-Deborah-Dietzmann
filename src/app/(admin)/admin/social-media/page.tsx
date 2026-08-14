"use client";

import { useState, useEffect } from 'react';

interface NewsItem {
  publisher: string;
  time_ago: string;
  title: string;
  snippet: string;
  category: string;
  article_link: string;
}

export default function SocialMediaPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // State for generating posts per article
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<Record<number, string>>({});
  const [selectedTones, setSelectedTones] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cron/daily-briefing');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch news.");
      if (data.trending_news) {
        setNews(data.trending_news);
      }
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(`Failed to load news: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLatestNews();
    setGeneratedPosts({}); // Clear previously generated posts on refresh
    setIsRefreshing(false);
  };

  const handleGeneratePost = async (index: number) => {
    const article = news[index];
    const tone = selectedTones[index] || 'Professional';
    
    setGeneratingIndex(index);
    setError(null);
    
    try {
      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article, tone })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Generation failed");
      }
      
      const data = await res.json();
      setGeneratedPosts(prev => ({ ...prev, [index]: data.caption }));
    } catch (err: any) {
      console.error("Error generating post:", err);
      alert(`Failed to generate post: ${err.message}`);
    } finally {
      setGeneratingIndex(null);
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

      <div className="flex mb-8 justify-between items-end">
        <div className="hidden md:block">
          <h1 className="font-headline-lg text-primary text-2xl md:text-3xl mb-1">Social Media Management</h1>
        </div>
        <div className="flex gap-2 md:gap-4 items-center ml-auto">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span className="hidden md:inline">{isRefreshing ? 'Refreshing...' : 'Pull New News'}</span>
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
          <p className="font-body-md animate-pulse">Scanning the latest local news...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-legal-gray border-2 border-dashed border-outline-variant/30 rounded-2xl">
          <span className="material-symbols-outlined text-4xl opacity-50">newspaper</span>
          <p className="font-body-md text-center">No trending news found.<br/>Click Pull New News to search again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, idx) => (
            <div key={idx} className="bg-neutral-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm flex flex-col p-5 h-full">
              
              {/* Article Content */}
              <div className="flex flex-col flex-1 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-[#0a1f44] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    {item.publisher}
                  </span>
                  <div className="text-xs text-legal-gray font-body-sm">
                    {item.time_ago}
                  </div>
                </div>
                <h3 className="font-headline-sm text-primary font-bold mb-3 leading-tight line-clamp-2">
                  <a href={item.article_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.title}
                  </a>
                </h3>
                <p className="text-sm font-body-sm text-legal-gray line-clamp-3 mb-2">
                  {item.snippet}
                </p>
                <a href={item.article_link} target="_blank" rel="noopener noreferrer" className="text-xs text-heritage-gold hover:underline flex items-center gap-1 mt-auto">
                  Read full article <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>
              </div>

              {/* AI Generation Controls */}
              {!generatedPosts[idx] ? (
                <div className="mt-4 pt-4 border-t border-outline-variant/30 flex flex-col gap-3">
                  <select 
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary font-body-md"
                    value={selectedTones[idx] || 'Professional'}
                    onChange={(e) => setSelectedTones({...selectedTones, [idx]: e.target.value})}
                  >
                    <option value="Professional">Tone: Professional</option>
                    <option value="Empathetic">Tone: Empathetic</option>
                    <option value="Urgent & Call to Action">Tone: Urgent / Call to Action</option>
                    <option value="Optimistic & Visionary">Tone: Optimistic</option>
                  </select>
                  <button 
                    onClick={() => handleGeneratePost(idx)}
                    disabled={generatingIndex === idx}
                    className="w-full btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
                  >
                    {generatingIndex === idx ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                        Drafting...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        Generate AI Post
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Generated Post Result */
                <div className="mt-4 pt-4 border-t border-heritage-gold/50 flex flex-col gap-3 bg-heritage-gold/5 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-label-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      AI Draft
                    </span>
                    <span className="text-[10px] text-legal-gray bg-white px-2 py-0.5 rounded border border-outline-variant/30">
                      {selectedTones[idx] || 'Professional'}
                    </span>
                  </div>
                  <div className="text-sm font-body-md text-primary whitespace-pre-wrap">
                    {generatedPosts[idx]}
                  </div>
                  
                  <div className="flex gap-2 mt-2 pt-3 border-t border-outline-variant/20">
                    <button 
                      onClick={() => copyToClipboard(generatedPosts[idx], idx)}
                      className="flex-1 py-1.5 text-xs font-label-bold text-primary border border-outline-variant/50 rounded hover:bg-white transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedIndex === idx ? 'check' : 'content_copy'}
                      </span>
                      {copiedIndex === idx ? 'Copied' : 'Copy'}
                    </button>
                    <button 
                      onClick={() => setGeneratedPosts(prev => { const next = {...prev}; delete next[idx]; return next; })}
                      className="flex-1 py-1.5 text-xs font-label-bold text-outline hover:text-error border border-outline-variant/50 rounded hover:bg-error/10 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">refresh</span>
                      Retry
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

