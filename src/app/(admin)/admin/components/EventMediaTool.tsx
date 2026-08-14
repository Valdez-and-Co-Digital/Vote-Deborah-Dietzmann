'use client';

import { useState } from 'react';

export default function EventMediaTool() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ pressRelease?: string; socialPost?: string; newsletterExcerpt?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/analyze-event-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedImage, mimeType })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze media');
      }

      setResults(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <p className="font-body-md text-legal-gray text-base">
          Upload event photos (town halls, rallies, block walks) to automatically generate press releases, social media posts, and newsletter excerpts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div 
            className="border-2 border-dashed border-outline-variant hover:border-primary transition-colors rounded-xl bg-surface-container-low p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {selectedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedImage} alt="Uploaded Event" className="absolute inset-0 w-full h-full object-cover opacity-90" />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-5xl text-outline mb-2">add_photo_alternate</span>
                <span className="font-headline-md text-primary text-lg">Drag & Drop Image</span>
                <span className="font-body-sm text-legal-gray">or click to browse files</span>
              </div>
            )}
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
          </div>

          <button 
            className="btn-primary w-full py-4 text-lg bg-[#bb0027] hover:bg-[#93000a] text-white rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-label-bold uppercase tracking-wider"
            onClick={handleGenerate}
            disabled={!selectedImage || loading}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined">auto_awesome</span>
            )}
            {loading ? 'Analyzing...' : 'Generate Content'}
          </button>

          {error && (
            <div className="bg-error/10 border border-error/30 text-error p-4 rounded-xl text-sm font-body-sm">
              <span className="font-bold block mb-1">Error</span>
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Press Release Card */}
          <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-primary px-6 py-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-heritage-gold">article</span>
              <h2 className="font-headline-md text-white m-0 text-lg">Press Release Draft</h2>
            </div>
            <div className="p-6 flex-1 min-h-[150px]">
              {results?.pressRelease ? (
                <div className="font-body-md text-primary whitespace-pre-wrap leading-relaxed">{results.pressRelease}</div>
              ) : (
                <div className="text-legal-gray italic font-body-sm text-center py-8">Generate content to see draft.</div>
              )}
            </div>
          </div>

          {/* Social Media Post Card */}
          <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-surface-container px-6 py-4 flex items-center gap-3 border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">share</span>
              <h2 className="font-headline-md text-primary m-0 text-lg">Social Media Post</h2>
            </div>
            <div className="p-6 flex-1 min-h-[120px]">
              {results?.socialPost ? (
                <div className="font-body-md text-primary whitespace-pre-wrap leading-relaxed">{results.socialPost}</div>
              ) : (
                <div className="text-legal-gray italic font-body-sm text-center py-6">Generate content to see draft.</div>
              )}
            </div>
          </div>

          {/* Newsletter Excerpt Card */}
          <div className="bg-neutral-white border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-surface-container px-6 py-4 flex items-center gap-3 border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">mark_email_read</span>
              <h2 className="font-headline-md text-primary m-0 text-lg">Newsletter Excerpt</h2>
            </div>
            <div className="p-6 flex-1 min-h-[120px]">
              {results?.newsletterExcerpt ? (
                <div className="font-body-md text-primary whitespace-pre-wrap leading-relaxed">{results.newsletterExcerpt}</div>
              ) : (
                <div className="text-legal-gray italic font-body-sm text-center py-6">Generate content to see draft.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
