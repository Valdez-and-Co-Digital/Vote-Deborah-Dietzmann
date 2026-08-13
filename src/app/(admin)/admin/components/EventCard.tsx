"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type EventType = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  rsvp_count?: number;
};

interface EventCardProps {
  event: EventType;
  onUpdate: () => void;
}

export default function EventCard({ event, onUpdate }: EventCardProps) {
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      setIsDeleting(true);
      await supabase.from('events').delete().eq('id', event.id);
      setIsDeleting(false);
      onUpdate();
    }
  };

  return (
    <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-headline-sm text-primary text-lg">{event.title}</h3>
          {new Date(event.date) < new Date() ? (
            <span className="px-2 py-1 bg-surface-variant text-on-surface-variant text-[10px] uppercase font-bold rounded-full">Past</span>
          ) : (
            <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded-full border border-primary/20">Upcoming</span>
          )}
        </div>
        
        <p className="font-body-sm text-on-surface opacity-80 mb-4">{event.description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center text-sm text-legal-gray">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span>{new Date(event.date).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">group</span>
            <span>{event.rsvp_count || 0} RSVPs</span>
          </div>
        </div>
      </div>
      
      <div className="flex md:flex-col gap-2 min-w-[120px]">
        <button 
          className="btn-secondary py-2 px-4 w-full flex items-center justify-center gap-2"
          onClick={() => {
            alert('Edit functionality coming soon');
          }}
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit
        </button>
        <button 
          className="bg-error/10 text-error border border-error/20 hover:bg-error/20 rounded-md py-2 px-4 font-label-bold transition-all w-full flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Delete
        </button>
      </div>
    </div>
  );
}
