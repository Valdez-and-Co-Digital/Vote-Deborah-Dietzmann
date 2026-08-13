"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import ReactMarkdown from 'react-markdown';

interface DailyBriefing {
  id: string;
  created_at: string;
  raw_markdown: string;
}

export default function AIDailyBriefing() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchLatestBriefing();
  }, []);

  const fetchLatestBriefing = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_briefings')
        .select('*')
        .eq('analytics_summary', 'DASHBOARD_OPERATIONS')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine initially
        throw error;
      }
      setBriefing(data || null);
    } catch (err: any) {
      console.error("Error fetching briefing:", err);
      setError("Failed to load briefing.");
    } finally {
      setLoading(false);
    }
  };

  const generateNewBriefing = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/cron/dashboard-operations', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}` 
        }
      });
      if (!res.ok) {
        throw new Error("API Route Failed");
      }
      // Re-fetch the latest
      await fetchLatestBriefing();
    } catch (err: any) {
      console.error("Error generating briefing:", err);
      setError("Failed to generate new briefing.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">psychiatry</span>
          </div>
          <div>
            <h2 className="font-headline-sm text-primary text-xl font-bold">Campaign Operations</h2>
            <p className="font-body-sm text-legal-gray text-xs">AI Assistant</p>
          </div>
        </div>
        <button 
          onClick={generateNewBriefing} 
          disabled={isGenerating}
          className="text-primary hover:text-heritage-gold transition-colors"
          title="Generate New Briefing"
        >
          <span className={`material-symbols-outlined ${isGenerating ? 'animate-spin' : ''}`}>
            sync
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-legal-gray">
            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
            <p className="font-body-sm animate-pulse">Fetching latest insights...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-error/10 text-error rounded-lg text-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <p>{error}</p>
          </div>
        ) : briefing ? (
          <div className="prose prose-sm max-w-none text-primary">
            <ReactMarkdown 
              components={{
                h3: ({node, ...props}) => <h3 className="font-headline-sm text-heritage-gold mt-4 mb-2 text-lg" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2 font-body-sm" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 font-body-sm leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-primary" {...props} />
              }}
            >
              {briefing.raw_markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-legal-gray">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">description</span>
            <p className="font-body-sm text-center">No briefing available yet.<br/>Click the refresh icon to generate the first one.</p>
          </div>
        )}
      </div>

      {briefing && (
        <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-between items-center text-xs text-legal-gray">
          <span>Generated via Cron Job</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {new Date(briefing.created_at).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
