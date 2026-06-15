import React, { useState } from 'react';
import AdContainer from './AdContainer';

interface IslamicCalendarProps {
  language: 'en' | 'ur';
}

interface CalendarDay {
  gregorianDay: number;
  hijriDay: number;
  hijriMonth: string;
  isCurrentMonth: boolean;
  events?: { name: string; type: 'fard' | 'sunnah' | 'history' | 'celebration'; desc: string }[];
}

export default function IslamicCalendar({ language }: IslamicCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  
  // June 2026 begins on a Monday. June has 30 days.
  // We populate empty slots for preceding month grid (May) padding.
  // June 1 is Monday.
  const makeCalendarGrid = (): CalendarDay[] => {
    const grid: CalendarDay[] = [];
    
    // Add padded days for May (preceding month, ending on Sunday May 31)
    // May ends on Sunday, so 0 padding empty slots are needed!
    // Monday June 1st fits perfectly in the first index.

    for (let day = 1; day <= 30; day++) {
      // June 1st corresponds to 15 Dhul-Qi'dah 1447 AH
      // June 15 corresponds to 29 Dhul-Qi'dah 1447 AH
      // June 16 corresponds to 1 Muharram 1448 AH (Islamic New Year!)
      // June 25 corresponds to 10 Muharram 1448 AH (Ashura!)
      
      let hijriDay = 0;
      let hijriMonth = '';
      if (day <= 15) {
        hijriDay = day + 14;
        hijriMonth = "Dhul-Qi'dah 1447 AH";
      } else {
        hijriDay = day - 15;
        hijriMonth = 'Muharram 1448 AH';
      }

      const events = [];
      if (day === 15) {
        events.push({
          name: "Completion of the Kaaba's Reconstruction",
          type: 'history' as const,
          desc: 'Prophet Ibrahim (A.S.) and Hazrat Ismail (A.S.) complete the foundations of the Holy Kaaba.'
        });
      } else if (day === 16) {
        events.push({
          name: 'Islamic New Year (1 Muharram 1448 AH)',
          type: 'celebration' as const,
          desc: 'The beginning of the Hijri year 1448, commemorating the Holy migration (Hijrah) of the Prophet (PBUH).'
        });
      } else if (day === 22) {
        events.push({
          name: 'Water Cut Off in Karbala (7 Muharram)',
          type: 'history' as const,
          desc: 'Access to the Euphrates river is denied to Hazrat Imam Hussain (R.A.) camp.'
        });
      } else if (day === 25) {
        events.push({
          name: 'Day of Ashura (10 Muharram)',
          type: 'fard' as const,
          desc: 'Major historical fast commemorating Prophet Musa (A.S.)’s delivery and Hazrat Imam Hussian (R.A.) Martyrdom.'
        });
      }

      grid.push({
        gregorianDay: day,
        hijriDay,
        hijriMonth,
        isCurrentMonth: true,
        events: events.length > 0 ? events : undefined
      });
    }

    // Pad outstanding cells to form complete 35 boundary grid (June end 30 is Tuesday, June ends with 30 days)
    // Add 5 padding days of July
    for (let jDay = 1; jDay <= 5; jDay++) {
      grid.push({
        gregorianDay: jDay,
        hijriDay: jDay + 15,
        hijriMonth: 'Muharram 1448 AH',
        isCurrentMonth: false
      });
    }

    return grid;
  };

  const calendarGrid = makeCalendarGrid();

  const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
      
      {/* AD CONTAINER AT TOP */}
      <AdContainer id="ad-calendar-top" size="728x90 Billboard" type="leaderboard" />

      {/* COMPACT EXPLANATION */}
      <section className="bg-[var(--surface)] text-[var(--test-primary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)]">
              {language === 'en' ? 'Interactive Islamic Hijri Calendar' : 'قمری ہجری کیلنڈر'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Dual-grid system demonstrating both Gregorian and corresponding Hijri calendar dates with certified events.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <span className="text-sm font-semibold font-heading text-amber-600 dark:text-amber-400">June 2026</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm font-bold text-gray-500 font-heading">Dhul-Qi'dah / Muharram</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* CORE GRID CELL TABLE */}
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm transition-colors duration-300">
          
          {/* Header Month controls */}
          <div className="flex justify-between items-center mb-5 border-b border-[var(--border)] pb-3">
            <button 
              className="p-1 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--primary)] cursor-pointer"
              onClick={() => alert('Viewing May 2026... (Simulated historical logs)')}
            >
              ← Prev
            </button>
            
            <span className="font-heading font-black text-sm text-[var(--primary)] dark:text-amber-400">
              {language === 'en' ? 'JUNE 2026 — 1447/1448 AH' : 'جون 2026 — 1447/1448 ہجری'}
            </span>

            <button 
              className="p-1 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--primary)] cursor-pointer"
              onClick={() => alert('Viewing July 2026... (Simulated upcoming events)')}
            >
              Next →
            </button>
          </div>

          {/* Weekday indicator rows */}
          <div className="grid grid-cols-7 gap-2.5 text-center font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-3">
            {weekdayNames.map(name => (
              <div key={name}>{name}</div>
            ))}
          </div>

          {/* Grid nodes */}
          <div className="grid grid-cols-7 gap-2.5">
            {calendarGrid.map((day, i) => {
              const hasEvents = !!day.events;
              const isToday = day.gregorianDay === 15 && day.isCurrentMonth;
              
              // Color tags according to event types
              let markerColor = 'bg-transparent';
              if (hasEvents) {
                const type = day.events![0].type;
                if (type === 'fard') markerColor = 'bg-red-500';
                else if (type === 'celebration') markerColor = 'bg-amber-400';
                else if (type === 'history') markerColor = 'bg-emerald-600';
              }

              return (
                <div
                  key={i}
                  onClick={() => day.isCurrentMonth && setSelectedDay(day)}
                  className={`relative p-3.5 h-16 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                    !day.isCurrentMonth 
                      ? 'bg-gray-500/5 border-transparent text-gray-300 dark:text-gray-700 pointer-events-none' 
                      : isToday
                      ? 'bg-amber-500/10 border-amber-500 text-amber-950 dark:text-amber-300 font-bold'
                      : 'bg-[var(--background)] border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-primary)]'
                  }`}
                >
                  {/* Gregorian day (top-left) */}
                  <span className="text-xs">{day.gregorianDay}</span>

                  {/* Hijri day (bottom-right) */}
                  <span className="text-[10px] self-end font-semibold text-amber-700 dark:text-amber-400">
                    {day.hijriDay}
                  </span>

                  {/* Event marker dot */}
                  {hasEvents && (
                    <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${markerColor}`}></span>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* DETAILS PANEL ON THE RIGHT / INTERACTIVE CARD */}
        <div className="space-y-6">
          
          {/* COLOR CODED LEGEND */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-3.5 transition-colors duration-300">
            <h3 className="font-heading font-bold text-xs text-[var(--text-primary)] border-b border-[var(--border)] pb-2 uppercase tracking-wider">
              Calendar Legend
            </h3>

            <div className="space-y-2.5 text-[11px] text-[var(--text-secondary)]">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                <span>Fard/Fasting Holidays (Ashura/Ramadan)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                <span>Spiritual Celebrations (Eid/Mawlid)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>Historic Milestones</span>
              </div>
            </div>
          </div>

          {/* ACTIVE SELECTED DATE EVENTS CARD */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4 transition-colors duration-300">
            <h3 className="font-heading font-bold text-sm text-[var(--text-primary)]">
              {language === 'en' ? 'Day events explorer' : 'مخصوص تاریخی تفصیل'}
            </h3>

            {selectedDay ? (
              <div className="space-y-3.5">
                <div className="bg-[var(--background)] px-3 py-2 rounded-xl border border-[var(--border)]">
                  <span className="text-[10px] text-gray-400 block uppercase">Selected Date</span>
                  <div className="text-xs font-bold font-heading text-[var(--primary)] dark:text-amber-400 mt-0.5">
                    June {selectedDay.gregorianDay}, 2026
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium">
                    {selectedDay.hijriDay} {selectedDay.hijriMonth}
                  </div>
                </div>

                {selectedDay.events ? (
                  <div className="space-y-3">
                    {selectedDay.events.map(ev => {
                      let typeLabel = 'Event';
                      if (ev.type === 'fard') typeLabel = 'Strict Worship';
                      else if (ev.type === 'celebration') typeLabel = 'Festive';
                      else if (ev.type === 'history') typeLabel = 'Historical Record';

                      return (
                        <div key={ev.name} className="p-3 border border-[var(--border)] rounded-xl space-y-1.5 bg-[var(--surface)]">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold uppercase tracking-wider">
                            {typeLabel}
                          </span>
                          <h4 className="text-xs font-bold">{ev.name}</h4>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            {ev.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 p-4 border border-dashed border-[var(--border)] rounded-xl text-center">
                    No major historical military battles or holidays documented for this Gregorian date in June.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-400 p-6 border border-dashed border-[var(--border)] rounded-xl text-center">
                Click any active cellular date block on the calendar grid to review localized events and corresponding Hijri calculations.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
