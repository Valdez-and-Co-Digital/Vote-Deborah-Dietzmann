'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function LocalAnalyticsPage() {
  const [dataInput, setDataInput] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setDataInput((prev) => prev + (prev ? '\n\n' : '') + (event.target?.result as string));
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!dataInput.trim()) {
      setError('Please provide some data to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch('/api/local-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataInput, question })
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to analyze data');
      }

      setAnswer(resData.answer);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pt-16 md:pt-8 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-hidden">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-3xl">shield_locked</span>
          <h1 className="font-headline-lg text-primary text-2xl md:text-3xl font-bold tracking-tight m-0">Local Analytics</h1>
        </div>
        <p className="font-body-md text-legal-gray text-base">
          Powered by <span className="font-bold text-primary">Gemma 4 (Open Weights)</span>. Securely analyze sensitive internal campaign data (donor lists, polling, targeting strategies).
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 pb-20 md:pb-0">
        {/* Left Column: Data Input */}
        <div className="flex flex-col gap-4 bg-neutral-white border border-outline-variant/30 rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="flex justify-between items-center shrink-0">
            <h2 className="font-headline-md text-primary text-xl">Data Source</h2>
            <label className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-2 cursor-pointer border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors font-label-bold uppercase">
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              Upload CSV/TXT
              <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          
          <textarea
            className="flex-1 w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 font-body-sm text-primary resize-none focus:outline-none focus:border-primary transition-colors"
            placeholder="Paste raw data here, e.g., CSV rows of donor history or recent polling crosstabs..."
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
          ></textarea>

          <div className="shrink-0 flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-white border border-outline-variant/50 rounded-xl py-3 pl-4 pr-12 font-body-md text-primary focus:outline-none focus:border-primary transition-colors shadow-sm"
                placeholder="Ask a specific question (or leave blank for general insights)..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyze();
                }}
              />
              <button 
                onClick={handleAnalyze}
                disabled={loading || !dataInput.trim()}
                className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-[#0a1f44]/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
            
            {error && (
              <div className="text-error text-sm font-body-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="flex flex-col bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-4 shrink-0 border-b border-outline-variant/30 pb-4">
            <span className="material-symbols-outlined text-heritage-gold">auto_awesome</span>
            <h2 className="font-headline-md text-primary text-xl">Gemma Strategic Analysis</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-legal-gray gap-4">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary/50">sync</span>
                <p className="font-body-md animate-pulse">Gemma is analyzing your secure data...</p>
              </div>
            ) : answer ? (
              <div className="prose prose-sm md:prose-base prose-headings:font-headline-md prose-headings:text-primary prose-p:text-legal-gray prose-p:font-body-md prose-li:text-legal-gray prose-strong:text-primary max-w-none">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-legal-gray opacity-60 gap-2">
                <span className="material-symbols-outlined text-4xl">monitoring</span>
                <p className="font-body-md text-center">Input data and ask a question to generate secure strategic insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
