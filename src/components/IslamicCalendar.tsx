import { useState, useEffect } from 'react';
import AdContainer from './AdContainer';

interface IslamicCalendarProps {
  language: 'en' | 'ur';
}

const MONTHS = [
  'Muharram', 'Safar', 'Rabi-ul-Awwal', 'Rabi-us-Sani', 'Jumada-ul-Awwal', 'Jumada-us-Sani',
  'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhul-Qi\'dah', 'Dhul-Hijjah',
];

const GREG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function IslamicCalendar({ language }: IslamicCalendarProps) {
  const now = new Date();
  const [dateOffset, setDateOffset] = useState(0);
  const [hijri, setHijri] = useState<{ day: string; month: string; monthAr: string; year: string; full: string } | null>(null);
  const [dayEvents, setDayEvents] = useState<{ name: string; type: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date(now);
  currentDate.setDate(currentDate.getDate() + dateOffset);

  useEffect(() => {
    fetchDayData();
  }, [dateOffset, language]);

  const fetchDayData = async () => {
    setLoading(true);
    const d = String(currentDate.getDate()).padStart(2, '0');
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const y = currentDate.getFullYear();
    try {
      const dateRes = await fetch(`/api/hijri/date?day=${d}&month=${m}&year=${y}`);
      const dateJson = await dateRes.json();
      if (dateJson.success) {
        setHijri(dateJson.data.hijri);
        const monthName = MONTHS[parseInt(dateJson.data.hijri.monthNumber) - 1] || dateJson.data.hijri.month;
        const eventsRes = await fetch(`/api/events/month/${monthName}`);
        const eventsJson = await eventsRes.json();
        if (eventsJson.success && eventsJson.data?.events) {
          const filtered = eventsJson.data.events
            .filter(ev => ev.day === parseInt(dateJson.data.hijri.day))
            .map(ev => ({ name: language === 'en' ? ev.title?.en : ev.title?.ur, type: ev.type }));
          setDayEvents(filtered);
        } else {
          setDayEvents([]);
        }
      }
    } catch {}
    setLoading(false);
  };

  const isToday = dateOffset === 0;
  const gregMonthName = GREG_MONTHS[currentDate.getMonth()];
  const dayName = DAY_NAMES[currentDate.getDay()];

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto px-4 pb-16 animate-fadeIn">
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-heading font-black flex items-center gap-2">
          <span>🗓️</span>
          <span>{language === 'en' ? 'Islamic Calendar' : 'اسلامی کیلنڈر'}</span>
        </h2>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setDateOffset(o => o - 1)}
            className="px-3 py-2 bg-[var(--background)] text-[var(--text-primary)] text-sm font-bold rounded-xl cursor-pointer hover:bg-[var(--primary)] hover:text-white transition">
            ←
          </button>
          <div className="text-center">
            {isToday && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">{language === 'en' ? 'Today' : 'آج'}</span>}
            <p className="text-lg font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)]">
              {dayName}, {gregMonthName} {currentDate.getDate()}, {currentDate.getFullYear()}
            </p>
          </div>
          <button onClick={() => setDateOffset(o => o + 1)}
            className="px-3 py-2 bg-[var(--background)] text-[var(--text-primary)] text-sm font-bold rounded-xl cursor-pointer hover:bg-[var(--primary)] hover:text-white transition">
            →
          </button>
        </div>

        <div className="text-center py-4 border-t border-[var(--border)]">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto" />
            </div>
          ) : hijri ? (
            <>
              <p className="text-2xl font-arabic font-bold text-emerald-800 dark:text-emerald-400" dir="rtl">
                {hijri.day} {hijri.monthAr} {hijri.year}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {hijri.full}
              </p>
            </>
          ) : null}
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-heading font-bold mb-3 flex items-center gap-2">
          <span>📅</span>
          <span>{language === 'en' ? 'Events' : 'واقعات'}</span>
        </h3>
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ) : dayEvents.length === 0 ? (
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

      <AdContainer id="ad-calendar-bottom" size="728x90 Bottom" type="leaderboard" />
    </div>
  );
}
