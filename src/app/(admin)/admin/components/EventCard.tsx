"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type EventType = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  end_time: string | null;
  capacity?: number;
  category?: string;
  rsvp_count?: number;
  rsvp_link?: string | null;
  actual_attendance?: number | null;
};

interface EventCardProps {
  event: EventType;
  onUpdate: () => void;
  onEdit?: (event: EventType) => void;
  onViewRsvps?: (event: EventType) => void;
}

export default function EventCard({ event, onUpdate, onEdit, onViewRsvps }: EventCardProps) {
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

  const isPast = new Date(event.date) < new Date();
  
  // Format dates for display
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Calculate days difference for the "In X days" badge
  const diffTime = Math.abs(eventDate.getTime() - new Date().getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const relativeTime = isPast ? `${diffDays} days ago` : diffDays === 0 ? 'Today' : `In ${diffDays} days`;

  // Use category from DB or default
  const category = (event.category || 'Town Hall').toUpperCase();
  const borderColor = category === 'MEET & GREET' ? 'border-heritage-gold' : 'border-primary';

  // Use capacity from DB or default
  const capacity = event.capacity || 200;
  const rsvpCount = event.rsvp_count || 0;
  const progressPercent = Math.min(100, Math.round((rsvpCount / capacity) * 100));

  return (
    <div className={`bg-neutral-white border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col relative transition-all hover:shadow-md border-l-4 ${borderColor}`}>
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-surface-container-high text-primary text-[10px] uppercase font-bold rounded">
            {category}
          </span>
          <div className="flex items-center text-xs text-legal-gray font-body-sm">
            <span className="material-symbols-outlined text-[14px] mr-1">schedule</span>
            {relativeTime}
          </div>
        </div>
        
        {onEdit && (
          <button 
            onClick={() => onEdit(event)}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        )}
      </div>

      <h3 className="font-headline-md text-primary text-xl mb-4 pr-10">{event.title}</h3>
      
      <div className="flex flex-col gap-3 text-sm text-legal-gray mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>{formattedDate} · {formattedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          <span>{event.location}</span>
        </div>
      </div>

      {/* RSVP Progress block */}
      <div className="bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:bg-surface-container-low transition-colors" onClick={() => onViewRsvps && onViewRsvps(event)}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-label-bold text-primary">RSVP Progress</span>
          <span className="font-label-bold text-primary">{rsvpCount} / {capacity} Guests</span>
        </div>
        <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden mb-2">
          <div 
            className={`h-full rounded-full ${category === 'MEET & GREET' ? 'bg-primary' : 'bg-heritage-gold'}`} 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="text-right text-xs text-legal-gray font-body-sm">
          {progressPercent}% Capacity Reached
        </div>
      </div>
      
      {/* Mobile-only Delete action, can be added into an action menu later, but we'll place it minimally here */}
      <div className="mt-4 flex justify-end">
         <button 
            className="text-xs text-error hover:underline flex items-center gap-1"
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={isDeleting}
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
            Delete
          </button>
      </div>
    </div>
  );
}
