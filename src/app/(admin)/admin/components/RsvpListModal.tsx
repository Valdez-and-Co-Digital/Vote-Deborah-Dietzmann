"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Rsvp {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  guests: number;
  created_at: string;
}

interface RsvpListModalProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export default function RsvpListModal({ eventId, eventTitle, onClose }: RsvpListModalProps) {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRsvps() {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setRsvps(data);
      }
      setIsLoading(false);
    }
    fetchRsvps();
  }, [eventId, supabase]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-primary p-6 text-on-primary flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold font-headline-md mb-1">RSVPs</h2>
            <p className="text-sm opacity-90">{eventTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            </div>
          ) : rsvps.length === 0 ? (
            <div className="text-center py-8 text-legal-gray">
              No RSVPs yet for this event.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2 px-2 bg-primary/5 p-3 rounded-lg border border-primary/10">
                <span className="font-bold text-primary">Total RSVPs: {rsvps.length}</span>
                <span className="font-bold text-primary">Total Guests: {rsvps.reduce((acc, r) => acc + (r.guests || 1), 0)}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="py-3 px-4 font-bold text-sm text-primary">Name</th>
                      <th className="py-3 px-4 font-bold text-sm text-primary">Contact</th>
                      <th className="py-3 px-4 font-bold text-sm text-primary text-center">Guests</th>
                      <th className="py-3 px-4 font-bold text-sm text-primary">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="border-b border-outline-variant/50 hover:bg-surface-variant/20">
                        <td className="py-3 px-4">
                          {rsvp.first_name} {rsvp.last_name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-sm">{rsvp.email}</span>
                            {rsvp.phone && <span className="text-xs text-legal-gray">{rsvp.phone}</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">{rsvp.guests || 1}</td>
                        <td className="py-3 px-4 text-sm text-legal-gray">
                          {new Date(rsvp.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
