"use client";

import { useState } from 'react';

type Event = {
  id: string;
  title: string;
  date: string;
  end_time: string | null;
  location: string | null;
  description: string | null;
};

export default function InteractiveCalendar({ events }: { events: Event[] }) {
  // Default to the month of the nearest future event, or current month if none
  const getDefaultDate = () => {
    const now = new Date();
    const futureEvents = events.filter(e => new Date(e.date) >= now);
    if (futureEvents.length > 0) {
      return new Date(futureEvents[0].date);
    }
    return now;
  };

  const [currentDate, setCurrentDate] = useState(getDefaultDate);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = monthNames[currentMonth];

  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-outline-variant overflow-hidden">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
        <h2 className="font-headline-lg text-2xl text-primary">{monthName} {currentYear}</h2>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="w-10 h-10 border border-outline-variant rounded flex items-center justify-center hover:bg-surface-variant transition-colors text-primary" 
            aria-label="Previous Month"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button 
            onClick={nextMonth}
            className="w-10 h-10 border border-outline-variant rounded flex items-center justify-center hover:bg-surface-variant transition-colors text-primary" 
            aria-label="Next Month"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="p-6">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="text-center font-bold text-xs text-primary uppercase tracking-wider py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Padding days before the 1st */}
          {paddingDays.map((pad) => (
            <div key={`pad-${pad}`} className="aspect-square border border-outline-variant/30 rounded p-1 flex flex-col items-end opacity-40 bg-surface"></div>
          ))}
          
          {/* Actual Days */}
          {monthDays.map(day => {
            // Check if this day has events
            const dayEvents = (events || []).filter(e => {
              const eDate = new Date(e.date);
              return eDate.getDate() === day && eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
            });
            const hasEvents = dayEvents.length > 0;

            return (
              <div 
                key={day} 
                className={`aspect-square border rounded p-1 flex flex-col ${
                  hasEvents 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-outline-variant/50 hover:border-primary/50'
                } relative overflow-hidden transition-colors cursor-pointer group`}
              >
                <span className={`text-sm self-end font-medium ${hasEvents ? 'text-primary font-bold' : 'text-on-surface'}`}>
                  {day}
                </span>
                
                {/* Event Indicators */}
                <div className="flex flex-col gap-1 mt-auto w-full">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className="w-full bg-primary text-on-primary text-[9px] font-bold p-1 rounded-sm text-center leading-none truncate group-hover:bg-primary-fixed-variant transition-colors">
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] text-primary font-bold text-center">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
