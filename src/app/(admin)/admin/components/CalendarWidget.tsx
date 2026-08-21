"use client";

import { useState } from 'react';
import { EventType } from './EventCard';

interface CalendarWidgetProps {
  events: EventType[];
}

export default function CalendarWidget({ events }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  // Helper to check if a day has events
  const getEventsForDay = (day: number) => {
    return events.filter(e => {
      const eventDate = new Date(e.date);
      const eDay = parseInt(eventDate.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'America/Chicago' }));
      const eMonth = parseInt(eventDate.toLocaleDateString('en-US', { month: 'numeric', timeZone: 'America/Chicago' })) - 1;
      const eYear = parseInt(eventDate.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'America/Chicago' }));
      return eDay === day && 
             eMonth === month && 
             eYear === year;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-headline-sm text-primary">{monthNames[month]} {year}</h4>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-surface-variant text-outline flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-surface-variant text-outline flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs font-label-bold text-legal-gray">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="p-2 text-transparent">0</div>
        ))}
        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          const hasEvent = dayEvents.length > 0;
          const today = isToday(day);
          
          return (
            <div key={day} className="relative py-2 flex flex-col items-center justify-center">
              <span 
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                  today ? 'bg-secondary text-neutral-white font-bold' : 
                  hasEvent ? 'font-bold text-primary bg-primary/10' : 'text-on-surface'
                }`}
                title={hasEvent ? dayEvents.map(e => e.title).join(', ') : ''}
              >
                {day}
              </span>
              {hasEvent && !today && (
                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></div>
              )}
              {hasEvent && today && (
                <div className="absolute bottom-1 w-1 h-1 bg-neutral-white rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
