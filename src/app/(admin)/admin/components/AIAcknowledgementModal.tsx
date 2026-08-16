'use client';

import { useState, useEffect } from 'react';

export default function AIAcknowledgementModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const acknowledged = sessionStorage.getItem('ai_acknowledged');
    if (!acknowledged) {
      setShowModal(true);
    }
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-white rounded-3xl shadow-xl border border-outline-variant/30 w-full max-w-md p-6 md:p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-6 text-heritage-gold">
          <span className="material-symbols-outlined text-4xl icon-fill-1" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
          <h2 className="font-headline-md text-primary text-2xl font-bold">AI Assistant Notice</h2>
        </div>
        
        <div className="space-y-4 mb-8 text-primary/90 font-body-md leading-relaxed">
          <p className="font-medium">
            This tool uses Artificial Intelligence to help analyze data and generate content.
          </p>
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/50">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-[18px] mt-0.5">warning</span>
                <span>AI can sometimes make mistakes or provide inaccurate information.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-heritage-gold text-[18px] mt-0.5">lightbulb</span>
                <span>All outputs are just suggestions, not definitive facts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#008a00] text-[18px] mt-0.5">fact_check</span>
                <span>Please review and verify all generated content before publishing.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <button 
          onClick={() => {
            sessionStorage.setItem('ai_acknowledged', 'true');
            setShowModal(false);
          }}
          className="w-full bg-secondary hover:bg-secondary-container text-on-secondary font-label-bold uppercase tracking-widest py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
}
