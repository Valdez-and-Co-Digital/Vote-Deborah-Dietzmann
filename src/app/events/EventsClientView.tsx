"use client";

import { useState } from 'react';
import RSVPModal from '@/components/RSVPModal';

type Event = {
  id: string;
  title: string;
  date: string;
  end_time: string | null;
  location: string | null;
  description: string | null;
};

export default function EventsClientView({ events }: { events: Event[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-outline-variant p-8 text-center">
          <p className="text-legal-gray">No upcoming events scheduled at this time. Please check back later!</p>
        </div>
      ) : (
        events.map((event) => {
          // Format the date
          const dateObj = new Date(event.date);
          const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' });
          const day = dateObj.getDate();
          const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          
          const timeFormatted = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          const endTimeFormatted = event.end_time 
            ? new Date(event.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            : null;

          return (
            <div key={event.id} className="bg-white rounded-xl shadow-md border-l-4 border-primary p-5 hover:shadow-lg transition-shadow">
              <div className="text-primary font-bold text-xs uppercase tracking-widest mb-2">{dateFormatted}</div>
              <h3 className="font-headline-md text-xl text-primary mb-3">{event.title}</h3>
              <div className="flex flex-col gap-2 mb-5">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>{timeFormatted} {endTimeFormatted ? `- ${endTimeFormatted}` : ''}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>{event.location}</span>
                  </div>
                )}
                {event.description && (
                  <p className="text-sm text-legal-gray mt-2">{event.description}</p>
                )}
              </div>
              <button 
                onClick={() => setSelectedEvent(event)}
                className="w-full border border-primary text-primary hover:bg-primary hover:text-on-primary font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors"
              >
                RSVP
              </button>
            </div>
          );
        })
      )}

      {selectedEvent && (
        <RSVPModal 
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          eventDate={selectedEvent.date}
          eventEndTime={selectedEvent.end_time}
          eventLocation={selectedEvent.location}
          eventDescription={selectedEvent.description}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
