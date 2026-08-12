"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import EventCard, { EventType } from './EventCard';

interface EventsManagerProps {
  initialUpcoming: EventType[];
  initialPast: EventType[];
}

export default function EventsManager({ initialUpcoming, initialPast }: EventsManagerProps) {
  const supabase = createClient();
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>(initialUpcoming);
  const [pastEvents, setPastEvents] = useState<EventType[]>(initialPast);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    capacity: 50
  });

  const refreshEvents = async () => {
    const now = new Date().toISOString();
    
    // Fetch upcoming
    const { data: upcoming } = await supabase
      .from('events')
      .select('*, rsvps(count)')
      .gte('event_date', now)
      .order('event_date', { ascending: true });
      
    // Fetch past
    const { data: past } = await supabase
      .from('events')
      .select('*, rsvps(count)')
      .lt('event_date', now)
      .order('event_date', { ascending: false });
      
    if (upcoming) {
      setUpcomingEvents(upcoming.map(e => ({...e, rsvp_count: e.rsvps?.[0]?.count || 0})));
    }
    if (past) {
      setPastEvents(past.map(e => ({...e, rsvp_count: e.rsvps?.[0]?.count || 0})));
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('events').insert([
      {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        event_date: new Date(formData.event_date).toISOString(),
        capacity: formData.capacity
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ title: '', description: '', location: '', event_date: '', capacity: 50 });
      refreshEvents();
    } else {
      alert("Error adding event");
    }
  };

  // Quick stats
  const totalEvents = upcomingEvents.length + pastEvents.length;
  const totalRsvps = [...upcomingEvents, ...pastEvents].reduce((acc, curr) => acc + (curr.rsvp_count || 0), 0);
  const totalCapacity = [...upcomingEvents, ...pastEvents].reduce((acc, curr) => acc + (curr.capacity || 1), 0);
  const avgAttendance = totalCapacity > 0 ? Math.round((totalRsvps / totalCapacity) * 100) : 0;

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-primary mb-2">Events Management</h1>
          <p className="font-body-md text-legal-gray">Create and track campaign events and RSVPs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
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
                <EventCard key={event.id} event={event} onUpdate={refreshEvents} />
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
                <span className="font-headline-md text-primary">{avgAttendance}%</span>
              </div>
            </div>
          </div>
          
          {/* Mini Calendar Placeholder */}
          <div className="bg-neutral-white border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-primary mb-4 border-b border-outline-variant pb-2">Event Calendar</h3>
            <div className="h-48 bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline">
              <p className="font-body-sm text-legal-gray italic">Calendar Widget</p>
            </div>
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
                  <li key={event.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-label-bold text-primary">{event.title}</p>
                      <p className="text-xs text-legal-gray">{new Date(event.event_date).toLocaleDateString()} - {event.location}</p>
                    </div>
                    <div className="text-sm font-label-bold text-secondary">
                      {event.rsvp_count} attended
                    </div>
                  </li>
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
              <h2 className="font-headline-md text-primary">Add New Event</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
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
                  value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} 
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
                <label className="block font-label-bold text-xs uppercase text-legal-gray mb-1">Capacity (Max RSVPs)</label>
                <input 
                  required type="number" min="1" 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:border-primary" 
                  value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 50})} 
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
    </>
  );
}
