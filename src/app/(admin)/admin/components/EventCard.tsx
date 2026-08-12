"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type EventType = {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  capacity: number;
  rsvp_count?: number;
};

interface EventCardProps {
  event: EventType;
  onUpdate: () => void;
}

export default function EventCard({ event, onUpdate }: EventCardProps) {
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const percentFull = Math.min(Math.round(((event.rsvp_count || 0) / (event.capacity || 1)) * 100), 100);
  
  let progressColor = "bg-primary";
  if (percentFull >= 90) progressColor = "bg-error";
  else if (percentFull >= 70) progressColor = "bg-yellow-500";

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    setIsDeleting(true);
    const { error } = await supabase.from('events').delete().eq('id', event.id);
    if (!error) {
      onUpdate();
    }
    setIsDeleting(false);
  };

  return (
    <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-headline-md text-primary text-xl pr-12">{event.title}</h3>
        <div className="flex items-center gap-1 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="p-1.5 bg-surface-container rounded-md hover:bg-surface-variant transition-colors text-primary"
            title="Edit Event"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button 
            className="p-1.5 bg-red-50 rounded-md hover:bg-red-100 transition-colors text-error"
            title="Delete Event"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-legal-gray gap-4 mb-4">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span>{new Date(event.event_date).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span>{event.location}</span>
        </div>
      </div>
      
      <p className="font-body-md text-on-surface-variant text-sm mb-6 line-clamp-2 flex-1">
        {event.description}
      </p>
      
      <div className="mt-auto">
        <div className="flex justify-between items-end mb-2">
          <span className="font-label-bold text-xs uppercase tracking-wider text-legal-gray">RSVP Status</span>
          <span className="font-headline-sm text-primary text-sm">
            {event.rsvp_count || 0} <span className="text-legal-gray text-xs font-body-sm">/ {event.capacity}</span>
          </span>
        </div>
        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`} 
            style={{ width: `${percentFull}%` }}
          />
        </div>
      </div>
    </div>
  );
}
