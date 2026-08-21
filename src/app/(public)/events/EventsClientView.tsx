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
  rsvp_link?: string | null;
  image_url?: string | null;
};

export default function EventsClientView({ events }: { events: Event[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [calendarDropdownOpen, setCalendarDropdownOpen] = useState<string | null>(null);
  const [copiedEmailEventId, setCopiedEmailEventId] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const handleMailtoClick = (e: React.MouseEvent<HTMLAnchorElement>, email: string, eventId: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopiedEmailEventId(eventId);
    setTimeout(() => setCopiedEmailEventId(null), 2000);
    window.location.href = `mailto:${email}`;
  };

  const getCalendarLinks = (event: Event) => {
    const startDate = new Date(event.date);
    const endDate = event.end_time ? new Date(event.end_time) : new Date(startDate.getTime() + 60 * 60 * 1000);
    
    // Google formatting
    const formatGoogleDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const googleStart = formatGoogleDate(startDate);
    const googleEnd = formatGoogleDate(endDate);
    const googleParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${googleStart}/${googleEnd}`,
      details: event.description || '',
      location: event.location || ''
    });
    const googleLink = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;

    // Outlook formatting
    const formatOutlookDate = (date: Date) => date.toISOString().split('.')[0] + 'Z';
    const outlookStart = formatOutlookDate(startDate);
    const outlookEnd = formatOutlookDate(endDate);
    const outlookParams = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      startdt: outlookStart,
      enddt: outlookEnd,
      body: event.description || '',
      location: event.location || ''
    });
    const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.toString()}`;

    return { googleLink, outlookLink };
  };

  const downloadIcs = (event: Event) => {
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
    setCalendarDropdownOpen(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {events.length === 0 ? (
        <div className="md:col-span-2 bg-white rounded-xl shadow-md border border-outline-variant p-8 text-center">
          <p className="text-legal-gray">No upcoming events scheduled at this time. Please check back later!</p>
        </div>
      ) : (
        events.map((event) => {
          const dateObj = new Date(event.date);
          const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' });
          const timeFormatted = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' });
          const endTimeFormatted = event.end_time 
            ? new Date(event.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' })
            : null;

          const { googleLink, outlookLink } = getCalendarLinks(event);

          return (
            <div key={event.id} id={`event-${event.id}`} className={`bg-white rounded-xl shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow flex flex-col md:flex-row overflow-hidden ${event.image_url ? 'p-0' : 'p-5'}`}>
              {event.image_url && (
                <div className="md:w-[40%] relative min-h-[200px] md:min-h-full bg-surface-container-lowest group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                  <button 
                    onClick={() => setFullScreenImage(event.image_url!)}
                    className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs backdrop-blur-sm transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                    View Full Image
                  </button>
                </div>
              )}
              <div className={`flex flex-col flex-1 ${event.image_url ? 'p-5 md:p-6' : ''}`}>
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
                {/* RSVP Button Logic */}
                {event.rsvp_link === 'internal' && (
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="flex-1 border border-primary text-primary hover:bg-primary hover:text-on-primary font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors"
                  >
                    RSVP
                  </button>
                )}
                {event.rsvp_link && event.rsvp_link !== 'internal' && event.rsvp_link.startsWith('mailto:') && (
                  <a 
                    href={event.rsvp_link}
                    onClick={(e) => handleMailtoClick(e, event.rsvp_link!.replace('mailto:', ''), event.id)}
                    className="flex-1 border border-primary text-primary hover:bg-primary hover:text-on-primary font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors text-center flex flex-col items-center justify-center relative"
                  >
                    {copiedEmailEventId === event.id ? (
                      <span className="animate-pulse">Email Copied!</span>
                    ) : (
                      <>
                        <span>Email to RSVP</span>
                        <span className="text-[10px] opacity-80 normal-case tracking-normal">{event.rsvp_link.replace('mailto:', '')}</span>
                      </>
                    )}
                  </a>
                )}
                {event.rsvp_link && event.rsvp_link !== 'internal' && !event.rsvp_link.startsWith('mailto:') && (
                  <a 
                    href={event.rsvp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-primary text-primary hover:bg-primary hover:text-on-primary font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors text-center flex items-center justify-center"
                  >
                    RSVP Info
                  </a>
                )}

                {/* Add to Calendar Button with Dropdown */}
                <div className="relative flex-1">
                  <button
                    onClick={() => setCalendarDropdownOpen(calendarDropdownOpen === event.id ? null : event.id)}
                    className="w-full h-full bg-surface-variant hover:bg-outline-variant text-primary border border-outline-variant font-bold text-sm uppercase tracking-wider py-3 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">event</span>
                    Add to Calendar
                  </button>
                  
                  {calendarDropdownOpen === event.id && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-outline-variant rounded-md shadow-lg z-10 flex flex-col overflow-hidden">
                      <a 
                        href={googleLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => setCalendarDropdownOpen(null)}
                        className="px-4 py-3 text-sm text-primary hover:bg-surface-variant transition-colors flex items-center gap-2 border-b border-outline-variant"
                      >
                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                        Google Calendar
                      </a>
                      <a 
                        href={outlookLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => setCalendarDropdownOpen(null)}
                        className="px-4 py-3 text-sm text-primary hover:bg-surface-variant transition-colors flex items-center gap-2 border-b border-outline-variant"
                      >
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                        Outlook Web
                      </a>
                      <button 
                        onClick={() => downloadIcs(event)}
                        className="px-4 py-3 text-sm text-primary hover:bg-surface-variant transition-colors flex items-center gap-2 text-left w-full"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Apple / Desktop
                      </button>
                    </div>
                  )}
                </div>
              </div>
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

      {fullScreenImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setFullScreenImage(null)}>
          <button 
            onClick={() => setFullScreenImage(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 transition-colors"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={fullScreenImage} 
            alt="Full screen view" 
            className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
