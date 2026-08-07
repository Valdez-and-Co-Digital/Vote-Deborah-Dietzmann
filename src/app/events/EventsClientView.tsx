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
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="flex-1 border border-primary text-primary hover:bg-primary hover:text-on-primary font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors"
                >
                  RSVP
                </button>
                <button
                  onClick={() => {
                    const startDate = new Date(event.date);
                    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                    const startStr = formatDate(startDate);
                    const endStr = event.end_time ? formatDate(new Date(event.end_time)) : formatDate(new Date(startDate.getTime() + 60 * 60 * 1000));
                    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Deborah Dietzmann Campaign//EN\nBEGIN:VEVENT\nUID:${event.id}@deborahdietzmannforjudge.com\nDTSTAMP:${formatDate(new Date())}\nDTSTART:${startStr}\nDTEND:${endStr}\nSUMMARY:${event.title}\nDESCRIPTION:${event.description || ''}\nLOCATION:${event.location || ''}\nEND:VEVENT\nEND:VCALENDAR`;
                    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 bg-surface-variant hover:bg-outline-variant text-primary border border-outline-variant font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">event</span>
                  Add to Calendar
                </button>
              </div>
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
