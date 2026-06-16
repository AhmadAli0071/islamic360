import { useState, useEffect } from 'react';
import AdContainer from './AdContainer';

interface IslamicCalendarProps {
  language: 'en' | 'ur';
}

const MONTHS = [
  'Muharram', 'Safar', 'Rabi-ul-Awwal', 'Rabi-us-Sani', 'Jumada-ul-Awwal', 'Jumada-us-Sani',
  'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhul-Qi\'dah', 'Dhul-Hijjah',
];

export default function IslamicCalendar({ language }: IslamicCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<Record<number, { name: string; type: string }[]>>({});
  const [selectedDay, setSelectedDay] = useState<{ greg: number; events: { name: string; type: string }[] } | null>(null);
  const [hijriInfo, setHijriInfo] = useState<{ month: string; year: number } | null>(null);

  useEffect(() => {
    fetchMonthEvents();
  }, [currentMonth]);

  const fetchMonthEvents = async () => {
    try {
      const res = await fetch(`/api/events/month/${MONTHS[currentMonth]}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const grouped: Record<number, { name: string; type: string }[]> = {};
        for (const ev of json.data) {
          if (!grouped[ev.day]) grouped[ev.day] = [];
          grouped[ev.day].push({ name: language === 'en' ? ev.title?.en : ev.title?.ur, type: ev.type });
        }
        setEvents(grouped);
      }
    } catch {
      // silently fail
    }
  };

  const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  // Convert to Hijri approximate
  const getHijriApprox = (day: number) => {
    // Rough approximate: add 14 days offset
    const hijriDay = ((day + 13) % 30) || 30;
    return { day: hijriDay, month: MONTHS[(currentMonth + 2) % 12], year: currentYear - 579 };
  };

  const prevMonth = () => {
    setSelectedDay(null);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    setSelectedDay(null);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const dayEvents = selectedDay ? events[selectedDay.greg] || [] : [];

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-2xl p-5 shadow-md">
        <h2 className="text-lg font-heading font-black flex items-center gap-2">
          <span>🗓️</span>
          <span>{language === 'en' ? 'Islamic Calendar' : 'اسلامی کیلنڈر'}</span>
        </h2>
        <p className="text-xs text-emerald-200 mt-1">
          {language === 'en' ? 'Hijri & Gregorian dates with events' : 'ہجری اور عیسوی تاریخیں واقعات کے ساتھ'}
        </p>
      </div>

      {/* Month navigation */}
      <div className="flex justify-between items-center bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-sm">
        <button onClick={prevMonth} className="px-4 py-2 bg-[var(--background)] text-[var(--text-primary)] text-sm font-bold rounded-xl cursor-pointer hover:bg-[var(--primary)] hover:text-white transition">←</button>
        <div className="text-center">
          <p className="text-sm font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)]">
            {new Date(currentYear, currentMonth).toLocaleString(language === 'en' ? 'en-US' : 'ur-PK', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-[10px] text-[var(--text-secondary)]">
            {MONTHS[(currentMonth + 2) % 12]} {currentYear - 579} AH
          </p>
        </div>
        <button onClick={nextMonth} className="px-4 py-2 bg-[var(--background)] text-[var(--text-primary)] text-sm font-bold rounded-xl cursor-pointer hover:bg-[var(--primary)] hover:text-white transition">→</button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-sm">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-[var(--text-secondary)] py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Empty slots */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} className="h-14" />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hijri = getHijriApprox(day);
            const dayHasEvents = events[day] && events[day].length > 0;
            const isSelected = selectedDay?.greg === day;
            const isFriday = new Date(currentYear, currentMonth, day).getDay() === 5;

            return (
              <button key={day} onClick={() => setSelectedDay({ greg: day, events: events[day] || [] })}
                className={`h-14 rounded-xl text-xs flex flex-col items-center justify-center transition cursor-pointer relative ${
                  isSelected ? 'bg-[var(--primary)] text-white shadow-md' : dayHasEvents ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30' : isFriday ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'hover:bg-[var(--background)]'
                }`}>
                <span className="font-bold text-[11px]">{day}</span>
                <span className="text-[8px] opacity-70">{hijri.day}</span>
                {dayHasEvents && <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-heading font-bold mb-3 flex items-center gap-2">
            <span>📅</span>
            <span>{language === 'en' ? `Events for ${currentMonth + 1}/${selectedDay.greg}/${currentYear}` : `${selectedDay.greg}/${currentMonth + 1}/${currentYear} کے واقعات`}</span>
          </h3>
          {dayEvents.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)]">
              {language === 'en' ? 'No events on this day.' : 'اس دن کوئی واقعہ نہیں'}
            </p>
          ) : (
            <div className="space-y-2">
              {dayEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10">
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                    ev.type === 'fard' ? 'bg-red-100 text-red-700' : ev.type === 'sunnah' ? 'bg-green-100 text-green-700' : ev.type === 'celebration' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>{ev.type}</span>
                  <span className="text-xs font-semibold">{ev.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[10px] text-[var(--text-secondary)]">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> {language === 'en' ? 'Has events' : 'واقعات'}</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-300" /> {language === 'en' ? 'Friday' : 'جمعہ'}</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-100 text-red-700 text-[8px] flex items-center justify-center">F</span> Fard</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-100 text-green-700 text-[8px] flex items-center justify-center">S</span> Sunnah</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-100 text-amber-700 text-[8px] flex items-center justify-center">C</span> Celebration</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-100 text-blue-700 text-[8px] flex items-center justify-center">H</span> History</span>
      </div>

      <AdContainer id="ad-calendar-bottom" size="728x90 Bottom" type="leaderboard" />
    </div>
  );
}
