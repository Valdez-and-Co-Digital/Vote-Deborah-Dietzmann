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
    venueName: '',
    streetAddress: '',
    city: 'San Antonio',
    state: 'Texas',
    zipCode: '',
    date: '',
    time: '',
    capacity: 0,
    category: ''
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
    
    // Combine location fields
    const combinedLocation = [
      formData.venueName,
      formData.streetAddress,
      formData.city,
      `${formData.state} ${formData.zipCode}`.trim()
    ].filter(Boolean).join(', ');
    
    if (editingEventId) {
      const { error } = await supabase.from('events').update({
        title: formData.title,
        description: formData.description,
        location: combinedLocation,
        date: new Date(`${formData.date}T${formData.time || '00:00'}`).toISOString(),
        capacity: formData.capacity,
        category: formData.category
      }).eq('id', editingEventId);

      if (!error) {
        setIsModalOpen(false);
        setEditingEventId(null);
        setFormData({ title: '', description: '', location: '', venueName: '', streetAddress: '', city: 'San Antonio', state: 'Texas', zipCode: '', date: '', time: '', capacity: 0, category: '' });
        refreshEvents();
      } else {
        alert("Error updating event");
      }
    } else {
      const { error } = await supabase.from('events').insert([
        {
          title: formData.title,
          description: formData.description,
          location: combinedLocation,
          date: new Date(`${formData.date}T${formData.time || '00:00'}`).toISOString(),
          capacity: formData.capacity,
          category: formData.category
        }
      ]);

      if (!error) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', location: '', venueName: '', streetAddress: '', city: 'San Antonio', state: 'Texas', zipCode: '', date: '', time: '', capacity: 0, category: '' });
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
      {isModalOpen ? (
        <div className="fixed inset-0 z-[100] bg-white md:static md:z-auto md:bg-transparent flex flex-col h-full md:h-auto overflow-y-auto md:overflow-visible">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-center relative p-4 border-b border-outline-variant/50">
            <button onClick={() => setIsModalOpen(false)} className="absolute left-4 text-primary">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="font-headline-md text-primary text-xl uppercase tracking-widest">{editingEventId ? "Edit Event" : "Add New Event"}</h2>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-end mb-6">
            <div>
              <h1 className="font-headline-lg text-primary text-3xl mb-2">{editingEventId ? "Edit Event" : "Create New Event"}</h1>
              <p className="font-body-md text-legal-gray">Schedule and manage details for upcoming campaign events.</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="flex items-center gap-2 text-primary font-label-bold hover:underline mb-2">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Events
            </button>
          </div>
          
          {/* Form Container */}
          <div className="flex-1 bg-[#fafafa] md:bg-white md:border md:border-outline-variant/40 md:rounded-2xl md:p-8 md:shadow-sm">
            <form onSubmit={handleSaveEvent} className="flex flex-col gap-8 p-4 md:p-0">
              
              {/* Event Details Section */}
              <div className="flex flex-col gap-4">
                <h3 className="hidden md:block font-headline-md text-primary text-lg border-b border-outline-variant/30 pb-2 mb-2">Event Details</h3>
                
                <div>
                  <label className="block font-label-bold text-sm text-primary mb-2">Event Name <span className="text-error">*</span></label>
                  <div className="relative bg-white md:bg-transparent">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-heritage-gold">calendar_month</span>
                    <input 
                      required type="text" 
                      placeholder="e.g., Fundraiser Dinner at The Manor"
                      className="w-full pl-10 pr-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary font-body-md" 
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-bold text-sm text-primary mb-2">Event Type <span className="text-error">*</span></label>
                    <div className="relative bg-white md:bg-transparent">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-heritage-gold">category</span>
                      <select 
                        required
                        className="w-full pl-10 pr-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary bg-transparent appearance-none font-body-md text-primary" 
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} 
                      >
                        <option value="" disabled>Select event type</option>
                        <option value="Town Hall">Town Hall</option>
                        <option value="Fundraiser">Fundraiser</option>
                        <option value="Meet & Greet">Meet & Greet</option>
                        <option value="Volunteer Drive">Volunteer Drive</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-bold text-sm text-primary mb-2">RSVP Capacity</label>
                    <div className="relative bg-white md:bg-transparent">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-heritage-gold">groups</span>
                      <input 
                        type="number" min="1"
                        placeholder="Leave blank for unlimited"
                        className="w-full pl-10 pr-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary font-body-md" 
                        value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="flex flex-col gap-4">
                <h3 className="hidden md:block font-headline-md text-primary text-lg border-b border-outline-variant/30 pb-2 mb-2">Date & Time</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-bold text-sm text-primary mb-2">Date <span className="text-error">*</span></label>
                    <div className="relative bg-white md:bg-transparent">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-heritage-gold">calendar_today</span>
                      <input 
                        required type="date" 
                        className="w-full pl-10 pr-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary font-body-md" 
                        value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-bold text-sm text-primary mb-2">Time <span className="text-error">*</span></label>
                    <div className="relative bg-white md:bg-transparent">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-heritage-gold">schedule</span>
                      <input 
                        required type="time" 
                        className="w-full pl-10 pr-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary font-body-md" 
                        value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="flex flex-col gap-4">
                <h3 className="hidden md:block font-headline-md text-primary text-lg border-b border-outline-variant/30 pb-2 mb-2">Location</h3>
                
                <div>
                  <label className="block font-label-bold text-sm text-primary mb-2">Venue Name</label>
                  <div className="relative bg-white md:bg-transparent">
                    <input 
                      type="text" 
                      placeholder="e.g., Anne Marie's Event Center"
                      className="w-full px-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary font-body-md" 
                      value={formData.venueName} onChange={e => setFormData({...formData, venueName: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-bold text-sm text-primary mb-2">Street Address <span className="text-error">*</span></label>
                  <div className="relative bg-white md:bg-transparent">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">location_on</span>
                    <input 
                      required type="text" 
                      placeholder="12472 Starcrest Drive"
                      className="w-full pl-10 pr-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary font-body-md" 
                      value={formData.streetAddress} onChange={e => setFormData({...formData, streetAddress: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-label-bold text-sm text-primary mb-2">City <span className="text-error">*</span></label>
                    <input 
                      required type="text" 
                      className="w-full px-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary font-body-md bg-white md:bg-transparent" 
                      value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block font-label-bold text-sm text-primary mb-2">State</label>
                    <div className="relative bg-white md:bg-transparent">
                      <select 
                        className="w-full px-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary appearance-none font-body-md text-primary bg-transparent" 
                        value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} 
                      >
                        <option value="Texas">Texas</option>
                        <option value="New York">New York</option>
                        <option value="California">California</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-bold text-sm text-primary mb-2">ZIP Code</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary font-body-md bg-white md:bg-transparent" 
                      value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="flex flex-col gap-4">
                <h3 className="hidden md:block font-headline-md text-primary text-lg border-b border-outline-variant/30 pb-2 mb-2">Additional Information</h3>
                <div>
                  <label className="block font-label-bold text-sm text-primary mb-1">Event Description</label>
                  <p className="hidden md:block text-xs text-legal-gray mb-2 font-body-sm">This will be visible on the public RSVP page.</p>
                  <textarea 
                    placeholder="Provide details about the event..."
                    className="w-full px-3 py-3 border border-outline-variant/60 rounded-lg focus:outline-none focus:border-primary h-28 resize-none font-body-md bg-white md:bg-transparent" 
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-2 flex flex-col md:flex-row gap-4 pb-8 md:pb-0 md:justify-end border-t border-outline-variant/30 pt-6 md:pt-4 md:border-none">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full md:w-auto bg-white border border-outline text-primary hover:bg-surface-container-lowest py-3.5 md:py-2.5 px-6 rounded-lg font-label-bold transition-colors order-2 md:order-1">
                  Cancel
                </button>
                <button type="submit" className="w-full md:w-auto bg-[#0a1f44] hover:bg-[#163363] text-white py-3.5 md:py-2.5 px-6 rounded-lg font-label-bold flex items-center justify-center gap-2 shadow-sm transition-colors order-1 md:order-2">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline-lg text-primary mb-2">Events Management</h1>
              <p className="font-body-md text-legal-gray">Create and track campaign events and RSVPs.</p>
            </div>
            <button 
              onClick={() => {
                setEditingEventId(null);
                setFormData({ title: '', description: '', location: '', venueName: '', streetAddress: '', city: 'San Antonio', state: 'Texas', zipCode: '', date: '', time: '', capacity: 0, category: '' });
                setIsModalOpen(true);
              }}
              className="hidden md:flex bg-[#8B0000] hover:bg-[#6b0000] text-white py-2 px-4 rounded-md items-center gap-1 font-label-bold transition-colors shadow-sm text-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
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
                        const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
                        const [datePart, timePart] = localIso.split('T');
                        
                        // Parse location string roughly
                        const locParts = (e.location || '').split(',').map(s => s.trim());
                        let vName = '', sAddr = '', cty = 'San Antonio', st = 'Texas', zip = '';
                        if (locParts.length >= 3) {
                          if (locParts.length > 3) {
                            vName = locParts[0];
                            sAddr = locParts[1];
                            cty = locParts[2];
                            const stZip = locParts[3]?.split(' ') || [];
                            st = stZip[0] || 'Texas';
                            zip = stZip[1] || '';
                          } else {
                            sAddr = locParts[0];
                            cty = locParts[1];
                            const stZip = locParts[2]?.split(' ') || [];
                            st = stZip[0] || 'Texas';
                            zip = stZip[1] || '';
                          }
                        } else {
                          sAddr = e.location || '';
                        }

                        setFormData({
                          title: e.title,
                          description: e.description || '',
                          location: e.location || '',
                          venueName: vName,
                          streetAddress: sAddr,
                          city: cty,
                          state: st,
                          zipCode: zip,
                          date: datePart,
                          time: timePart.substring(0, 5),
                          capacity: e.capacity || 0,
                          category: e.category || ''
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
              
              {/* Mobile Bottom Stats Blocks */}
              <div className="flex gap-4 mt-6 md:hidden pb-12">
                <div className="flex-1 bg-neutral-white border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="font-headline-lg text-primary text-3xl mb-1">{totalEvents}</span>
                  <span className="font-label-bold text-xs text-outline-variant uppercase tracking-wider">Total Events</span>
                </div>
                <div className="flex-1 bg-primary border border-primary-variant rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="font-headline-lg text-heritage-gold text-3xl mb-1">{upcomingEvents.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}</span>
                  <span className="font-label-bold text-xs text-on-primary/80 uppercase tracking-wider">This Month</span>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar Widgets */}
            <div className="w-full lg:w-[350px] flex flex-col gap-6">
              {/* Quick Stats - Campaign Impact */}
              <div className="bg-[#0a1f44] border-none rounded-2xl p-6 shadow-md text-white">
                <h3 className="font-headline-sm text-white mb-6">Campaign Impact</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-label-bold uppercase tracking-wider text-white/70">Total Events</span>
                    <span className="font-headline-lg text-heritage-gold text-3xl">{totalEvents}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-label-bold uppercase tracking-wider text-white/70">Total RSVPs</span>
                    <span className="font-headline-lg text-heritage-gold text-3xl">{totalRsvps}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-label-bold uppercase tracking-wider text-white/70">Avg Attendance Rate</span>
                  <div className="flex items-center gap-3">
                    <span className="font-headline-md text-white text-2xl">{avgAttendance}%</span>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden flex-1">
                      <div 
                        className="h-full bg-white rounded-full" 
                        style={{ width: `${avgAttendance}%` }}
                      ></div>
                    </div>
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

          {/* Mobile Floating Action Button (FAB) */}
          <button 
            onClick={() => {
              setEditingEventId(null);
              setFormData({ title: '', description: '', location: '', venueName: '', streetAddress: '', city: 'San Antonio', state: 'Texas', zipCode: '', date: '', time: '', capacity: 0, category: '' });
              setIsModalOpen(true);
            }}
            className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-primary text-neutral-white rounded-full flex items-center justify-center shadow-lg z-40 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </>
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
