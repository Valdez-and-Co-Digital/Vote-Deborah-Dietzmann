"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { EventType } from './EventCard';

export default function PastEventRow({ event, onUpdate, onViewRsvps }: { event: EventType, onUpdate: () => void, onViewRsvps?: (event: EventType) => void }) {
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [attendance, setAttendance] = useState<string>(event.actual_attendance?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const val = attendance === '' ? null : parseInt(attendance);
    await supabase.from('events').update({ actual_attendance: val }).eq('id', event.id);
    setIsSaving(false);
    setIsEditing(false);
    onUpdate();
  };

  return (
    <li className="py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      <div>
        <p className="font-label-bold text-primary">{event.title}</p>
        <p className="text-xs text-legal-gray">{new Date(event.date).toLocaleDateString()} - {event.location}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-legal-gray flex flex-col items-end">
          <button 
            onClick={() => onViewRsvps && onViewRsvps(event)}
            className="hover:text-primary transition-colors text-right"
          >
            <strong className="text-primary underline decoration-dotted underline-offset-2">{event.rsvp_count}</strong> <span className="underline decoration-dotted underline-offset-2">RSVPs</span>
          </button>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="number" 
                value={attendance}
                onChange={e => setAttendance(e.target.value)}
                placeholder="Actual attendees"
                className="w-24 px-2 py-1 text-sm border border-outline-variant rounded"
                min="0"
              />
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-primary text-on-primary text-xs px-3 py-1 rounded disabled:opacity-50"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <span className="font-label-bold text-secondary">
                {event.actual_attendance != null ? `${event.actual_attendance} attended` : 'Attendance not set'}
              </span>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-outline hover:text-primary transition-colors flex items-center"
                title="Mark Attendance"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
