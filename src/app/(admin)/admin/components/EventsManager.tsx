"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import EventCard, { EventType } from './EventCard';
import PastEventRow from './PastEventRow';
import CalendarWidget from './CalendarWidget';
import RsvpListModal from './RsvpListModal';

interface EventsManagerProps {
  initialUpcoming: EventType[];
  initialPast: EventType[];
}

export default function EventsManager({ initialUpcoming, initialPast }: EventsManagerProps) {
  const supabase = createClient();
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>(initialUpcoming);
  const [pastEvents, setPastEvents] = useState<EventType[]>(initialPast);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [viewingRsvpsForEvent, setViewingRsvpsForEvent] = useState<EventType | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: ''
  });

  const refreshEvents = async () => {
    const now = new Date().toISOString();
    
    // Fetch upcoming
    const { data: upcoming } = await supabase
      .from('events')
      .select('*, rsvps(count)')
      .gte('date', now)
      .order('date', { ascending: true });
      
    // Fetch past
    const { data: past } = await supabase
      .from('events')
      .select('*, rsvps(count)')
      .lt('date', now)
      .order('date', { ascending: false });
      
    if (upcoming) {
      setUpcomingEvents(upcoming.map(e => ({...e, rsvp_count: e.rsvps?.[0]?.count || 0})));
    }
    if (past) {
      setPastEvents(past.map(e => ({...e, rsvp_count: e.rsvps?.[0]?.count || 0})));
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEventId) {
      const { error } = await supabase.from('events').update({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: new Date(formData.date).toISOString()
      }).eq('id', editingEventId);

      if (!error) {
        setIsModalOpen(false);
        setEditingEventId(null);
        setFormData({ title: '', description: '', location: '', date: '' });
        refreshEvents();
      } else {
        alert("Error updating event");
      }
    } else {
      const { error } = await supabase.from('events').insert([
        {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: new Date(formData.date).toISOString()
        }
      ]);

      if (!error) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', location: '', date: '' });
        refreshEvents();
      } else {
        alert("Error adding event");
      }
    }
  };

  const totalEvents = upcomingEvents.length + pastEvents.length;
  const totalRsvps = [...upcomingEvents, ...pastEvents].reduce((acc, curr) => acc + (curr.rsvp_count || 0), 0);
  
  const pastEventsWithAttendance = pastEvents.filter(e => e.actual_attendance != null);
  const totalAttended = pastEventsWithAttendance.reduce((acc, curr) => acc + (curr.actual_attendance || 0), 0);
  
  const avgAttendance = pastEventsWithAttendance.length > 0 
    ? Math.round(totalAttended / pastEventsWithAttendance.length) 
    : 0;

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-primary mb-2">Events Management</h1>
          <p className="font-body-md text-legal-gray">Create and track campaign events and RSVPs.</p>
        </div>
        <button 
          onClick={() => {
            setEditingEventId(null);
            setFormData({ title: '', description: '', location: '', date: '' });
            setIsModalOpen(true);
          }}
          className="btn-primary py-2 px-6 flex items-center gap-2 !bg-[#8B0000] !border-[#8B0000] hover:!bg-[#6b0000]"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add New Event
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Left Column - Upcoming Events */}
        <div className="flex-1">
          <h2 className="font-headline-md text-primary text-xl mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">event_upcoming</span>
            Upcoming Events
          </h2>
          
          <div className="flex flex-col gap-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onUpdate={refreshEvents}
                  onEdit={(e) => {
                    setEditingEventId(e.id);
                    const d = new Date(e.date);
                    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    setFormData({
                      title: e.title,
                      description: e.description || '',
                      location: e.location || '',
                      date: localIso
                    });
                    setIsModalOpen(true);
                  }}
                  onViewRsvps={(e) => setViewingRsvpsForEvent(e)}
                />
              ))
            ) : (
              <div className="bg-neutral-white border border-outline-variant rounded-2xl p-12 text-center shadow-sm">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
                <p className="font-body-md text-legal-gray">No upcoming events scheduled.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6">
          {/* Quick Stats */}
          <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-primary mb-4 border-b border-outline-variant pb-2">Campaign Impact</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-legal-gray">Total Events</span>
                <span className="font-headline-md text-primary">{totalEvents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-legal-gray">Total RSVPs</span>
                <span className="font-headline-md text-primary">{totalRsvps}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-legal-gray">Avg Attendance</span>
                <span className="font-headline-md text-primary">{avgAttendance} / event</span>
              </div>
            </div>
          </div>
          
          {/* Event Calendar Widget */}
          <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-primary mb-4 border-b border-outline-variant pb-2">Event Calendar</h3>
            <CalendarWidget events={[...upcomingEvents, ...pastEvents]} />
          </div>
        </div>
      </div>

      {/* Past Events */}
      <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
        <details className="group">
          <summary className="font-headline-md text-primary text-xl flex justify-between items-center cursor-pointer list-none">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">history</span>
              Past Events
            </div>
            <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-outline">
              expand_more
            </span>
          </summary>
          
          <div className="mt-4 pt-4 border-t border-outline-variant">
            {pastEvents.length > 0 ? (
              <ul className="divide-y divide-outline-variant/30">
                {pastEvents.map(event => (
                  <PastEventRow 
                    key={event.id} 
                    event={event} 
                    onUpdate={refreshEvents} 
                    onViewRsvps={(e) => setViewingRsvpsForEvent(e)}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-legal-gray italic py-4 text-center">No past events found.</p>
            )}
          </div>
        </details>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-white rounded-2xl p-6 max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-primary">{editingEventId ? "Edit Event" : "Add New Event"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveEvent} className="flex flex-col gap-4">
              <div>
                <label className="block font-label-bold text-xs uppercase text-legal-gray mb-1">Event Title</label>
                <input 
                  required type="text" 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:border-primary" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block font-label-bold text-xs uppercase text-legal-gray mb-1">Date & Time</label>
                <input 
                  required type="datetime-local" 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:border-primary" 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block font-label-bold text-xs uppercase text-legal-gray mb-1">Location</label>
                <input 
                  required type="text" 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:border-primary" 
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} 
                />
              </div>
              

              
              <div>
                <label className="block font-label-bold text-xs uppercase text-legal-gray mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:border-primary h-24 resize-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                ></textarea>
              </div>
              
              <div className="mt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-2 px-4">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-4">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View RSVPs Modal */}
      {viewingRsvpsForEvent && (
        <RsvpListModal 
          eventId={viewingRsvpsForEvent.id} 
          eventTitle={viewingRsvpsForEvent.title} 
          onClose={() => setViewingRsvpsForEvent(null)} 
        />
      )}
    </>
  );
}
